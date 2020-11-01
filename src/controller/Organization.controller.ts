import express from 'express';
import { upload } from './multer';
import { RegisterOrganization } from '../payload/RegisterOrganization.request';
import fs from 'fs';

import * as config from '../../config';
import * as autheticationService from '../service/AutheticationService.service';
import * as organizationService from '../service/Organization.service';

export default class OrganizationController {
    public router: express.Router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // endpoints
        
        this.router.post('/organization/register', this.register);
        this.router.post('/organization/login', this.login);
        this.router.post('/organization/uploadVerifiedDocumentToCityzen', this.entityAuth, upload.single('file'), this.uploadVerifiedDocumentToCityzen);
    }

    public async login(req: express.Request, res: express.Response) {
        const token: String = await organizationService.loginOrganization(req.body.identifier, req.body.secretKey);
        if(token){
            res.send(token);
        }else{
            res.status(401)
            .send("Organization not found");
        }
    }

    public async register(req: express.Request, res: express.Response) {
        const registerOrganization: RegisterOrganization = {
            identifier: req.body.identifier
        };
        const secretKey = await organizationService.registerOrganization(registerOrganization);

        if (secretKey) {
            res.send(secretKey);
        } else {
            res.status(403)
                .send('Organization already exists');
        }
    }

    public async uploadVerifiedDocumentToCityzen(req: express.Request, res: express.Response,) {
        var result;
        try {
            result = await organizationService.saveVerifiedDocumentToCityzen(req['file'], req.body.cityzenEmail)
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
    public async entityAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token: string = req.get('authToken');
        if (token) {
            try {
                const verifiedPayload = await autheticationService.decodeToken(token);

                if (verifiedPayload) {
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
}