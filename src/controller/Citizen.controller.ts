import express from 'express';
import { LoginCitizen } from '../payload/LoginCitizen.request';
import { RegisterCitizen } from '../payload/RegisterCitizen.request';
import { TokenPayload } from '../payload/TokenPayload.token';
import fs from 'fs';
import { Citizen } from '../models/core';

import * as citizenService from '../service/CitizenService.service';
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
        this.router.get('/myDocuments', this.citizenAuth, this.getMyDocuments);
        this.router.post('/uploadTemporalDocument', this.citizenAuth, upload.single('file'), this.uploadTemporalDocument);
        this.router.get('/myDocument', this.citizenAuth, this.getMyDocument);
        this.router.get('/', (req, res) => {
            res.send("citizen test");
        })
    }

    public async login(req: express.Request, res: express.Response) {
        const logincitizen: LoginCitizen = {
            email: req.body.email,
            password: req.body.password
        };

        const jwt: String = await citizenService.login(logincitizen);
        if (jwt) {
            res.send({id_token: jwt});
        } else {
            res.status(401)
                .send({ error: "Invalid login" });
        }
    }

    public async register(req: express.Request, res: express.Response) {

        const registercitizen: RegisterCitizen = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            identifier: req.body.identifier,
            password: req.body.password,
            address: req.body.address
        };
        const citizen: Citizen = await citizenService.register(registercitizen);
        if (citizen) {
            res.status(200)
                .send({email: citizen.email});

        } else {
            res.status(403)
                .send({ message: "citizen already exists" });
        }
    }

    public async getMyDocuments(req: express.Request, res: express.Response) {
        const fileNames: String[] = await citizenService.getMyDocumentsName(req['currentcitizen'])
        if (fileNames) {
            res.send({ fileNames: fileNames });
        } else {
            res.status(403)
                .send({ error: "files not found" });
        }
    }

    public async uploadTemporalDocument(req: express.Request, res: express.Response) {
        var result;
        try {
            result = await citizenService.saveTemporalDocument(req['file'], req['currentcitizen']);
        } finally {
            fs.unlink(config.multer_path + req['file']['filename'], (err) => {
                if (err) {
                    console.error(err)
                }
            })
        }

        if (result[0]) {
            res.send({ message: result[1] });
        } else {
            res.status(403)
                .send({ error: result[1] });
        }
    }

    public async citizenAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token: string = req.get('authToken');
        if (token) {
            try {
                const currentcitizen: TokenPayload = await autheticationService.decodeToken(token);

                if (currentcitizen) {
                    req['currentcitizen'] = currentcitizen;
                    next();
                }
            } catch (err) {
                res.status(401)
                    .send({error: "unauthorized, token expired"});
            }
        } else {
            res.status(401)
                .send({error: "unauthorized, token can't be null"});
        }
    }

    public async getMyDocument(req: express.Request, res: express.Response) {
        const file: Buffer = await citizenService.getMyDocument(req['currentcitizen'], req.query.fileName as string);
        if (file) {
            res.send(file);
        } else {
            res.status(403)
                .send({ error: 'File not found' });
        }
    }
}