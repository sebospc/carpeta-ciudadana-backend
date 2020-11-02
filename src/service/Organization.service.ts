import { Organization } from "../models/core/Organization.entity";
import { RegisterOrganization } from "../payload/RegisterOrganization.request";
import { Citizen, DocumentContainer } from "../models/core";
import { getRepository } from "typeorm";
import bcrypt from 'bcrypt';

import * as authenticationService from './AutheticationService.service';
import * as citizenDao from '../dao/CitizenDao.dao';
import * as documentService from './DocumentService.service';
import * as organizationDao from '../dao/Organization.dao';
import * as minticService from './MinticService.service';


export const registerOrganization = async (registerOrganization: RegisterOrganization): Promise<String> => {

    if (!await organizationDao.findByIdentifier(registerOrganization.identifier)) {
        const organization: Organization = new Organization();

        organization.identifier = registerOrganization.identifier;

        const secretKey: string = Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('')


        organization.secretKey = await bcrypt.hash(secretKey, 7);

        const organizationRepository = getRepository(Organization);

        const organizationSaved: Organization = await organizationRepository.save(organization);

        if (organizationSaved) {
            return secretKey;
        } else {
            return undefined;
        }
    }
}

export const loginOrganization = async (identifier: string, secretKey: string): Promise<String> => {
    const organization: Organization = await organizationDao.findByIdentifier(identifier);
    if (organization && await bcrypt.compare(secretKey, organization.secretKey)) {
        return await authenticationService.authenticateOrganization(organization);
    } else {
        return undefined;
    }
}

export const saveVerifiedDocumentToCitizen = async (fileInfo: JSON, citizenEmail: string): Promise<[DocumentContainer | undefined, String] | undefined> => {
    const citizen: Citizen = await citizenDao.findByEmail(citizenEmail);
    if (fileInfo && citizen) {
        const documentResult = await documentService.saveTemporalDocument(fileInfo, citizen);
        if (documentResult[0]) {
            if (await minticService.validateDocument(citizen.identifier, documentResult[0])) {
                return [documentResult[0], 'Document saved and authenticated'];
            } else {
                return documentResult;
            }
        } else {
            return documentResult;
        }
    } else {
        return [undefined, "Incomplete information"];
    }
}