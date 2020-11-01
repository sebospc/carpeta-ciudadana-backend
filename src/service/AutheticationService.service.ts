import { Cityzen } from "../models/core";
import jwt from 'jsonwebtoken';
import * as config from '../../config';
import { TokenPayload } from "../payload/TokenPayload.token";
import { Organization } from "src/models/core/Organization.entity";

export const authenticateCityzen = async (cityzen: Cityzen): Promise<string> => {
    const payload: TokenPayload = {
        id: cityzen.identifier,
        email: cityzen.email
    };

    return jwt.sign(payload, config.jwt_secret_token, {
        expiresIn: "1h"
    });
}

export const decodeToken = async (token: string): Promise<any | undefined> => {
    return (<any>jwt.verify(token, config.jwt_secret_token));
}

export const authenticateOrganization = async (organization: Organization): Promise<string> => {
    const payload = {
        identifier: organization.identifier
    }
    return jwt.sign(payload, config.jwt_secret_token, {
        expiresIn: "1h"
    });
}