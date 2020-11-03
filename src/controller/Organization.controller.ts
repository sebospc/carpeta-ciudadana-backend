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
        this.router.post('/organization/uploadVerifiedDocumentTocitizen', this.entityAuth, upload.single('file'), this.uploadVerifiedDocumentTocitizen);
    }

    public async login(req: express.Request, res: express.Response) {
        const token: String = await organizationService.loginOrganization(req.body.identifier, req.body.secretKey);
        if(token){
            res.send({ id_token: token });
        }else{
            res.status(401)
                .send({ error: "Organization not found" });
        }
    }

    public async register(req: express.Request, res: express.Response) {
        const registerOrganization: RegisterOrganization = {
            identifier: req.body.identifier
        };
        const secretKey = await organizationService.registerOrganization(registerOrganization);

        if (secretKey) {
            res.send({ secretKey: secretKey });
        } else {
            res.status(403)
                .send({ error: 'Organization already exists' });
        }
    }

    public async uploadVerifiedDocumentTocitizen(req: express.Request, res: express.Response,) {
        var result;
        try {
            result = await organizationService.saveVerifiedDocumentToCitizen(req['file'], req.body.citizenEmail)
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
                .send({ message: result[1] });
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
                    .send({ error: "unauthorized, token expired" });
            }
        } else {
            res.status(401)
                .send({ error: "unauthorized, token can't be null" });
        }
    }
}