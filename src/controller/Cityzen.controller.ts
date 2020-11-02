import express from 'express';
import { LoginCityzen } from '../payload/LoginCityzen.request';
import { RegisterCityzen } from '../payload/RegisterCityzen.request';
import { TokenPayload } from '../payload/TokenPayload.token';
import fs from 'fs';
import { Cityzen } from '../models/core';

import * as cityzenService from '../service/CityzenService.service';
import * as autheticationService from '../service/AutheticationService.service';
import * as config from '../../config';
import { upload } from './multer';




export default class CitizenController {
    public router: express.Router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // endpoints
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
        this.router.get('/myDocuments', this.cityzenAuth, this.getMyDocuments);
        this.router.post('/uploadTemporalDocument', this.cityzenAuth, upload.single('file'), this.uploadTemporalDocument);
        this.router.get('/myDocument', this.cityzenAuth, this.getMyDocument);
        this.router.get('/', (req, res) => {
            res.send("Cityzen test");
        })
    }

    public async login(req: express.Request, res: express.Response) {
        const loginCityzen: LoginCityzen = {
            email: req.body.email,
            password: req.body.password
        };

        const jwt: String = await cityzenService.login(loginCityzen);
        if (jwt) {
            res.send(jwt);
        } else {
            res.status(401)
                .send("Invalid login");
        }
    }

    public async register(req: express.Request, res: express.Response) {

        const registerCityzen: RegisterCityzen = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            identifier: req.body.identifier,
            password: req.body.password
        };
        const cityzen: Cityzen = await cityzenService.register(registerCityzen);
        if (cityzen) {
            res.status(200)
                .send({
                    email: cityzen.email
                });

        } else {
            res.status(403)
                .send("cityzen already exists");
        }
    }

    public async getMyDocuments(req: express.Request, res: express.Response) {
        const fileNames: String[] = await cityzenService.getMyDocumentsName(req['currentCityzen'])
        if (fileNames) {
            res.send(fileNames);
        } else {
            res.status(403)
                .send("files not found");
        }
    }

    public async uploadTemporalDocument(req: express.Request, res: express.Response) {
        var result;
        try {
            result = await cityzenService.saveTemporalDocument(req['file'], req['currentCityzen']);
        } finally {
            fs.unlink(config.multer_path + req['file']['filename'], (err) => {
                if (err) {
                    console.error(err)
                }
            })
        }

        if (result[0]) {
            res.send(result[1]);
        } else {
            res.status(403)
                .send(result[1]);
        }
    }

    public async cityzenAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token: string = req.get('authToken');
        if (token) {
            try {
                const currentCityzen: TokenPayload = await autheticationService.decodeToken(token);

                if (currentCityzen) {
                    req['currentCityzen'] = currentCityzen;
                    next();
                }
            } catch (err) {
                res.status(401)
                    .send("unauthorized, token expired");
            }
        } else {
            res.status(401)
                .send("unauthorized, token can't be null");
        }

    }

    public async getMyDocument(req: express.Request, res: express.Response) {
        const file: Buffer = await cityzenService.getMyDocument(req['currentCityzen'], req.query.fileName as string);
        if (file) {
            res.send(file);
        } else {
            res.status(403)
                .send('File not found');
        }
    }
}