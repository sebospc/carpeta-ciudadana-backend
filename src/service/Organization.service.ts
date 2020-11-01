import { Organization } from "../models/core/Organization.entity";
import { RegisterOrganization } from "../payload/RegisterOrganization.request";
import * as organizationDao from '../dao/Organization.dao';
import { getRepository } from "typeorm";
import bcrypt from 'bcrypt';
import * as authenticationService from './AutheticationService.service';
import * as cityzenDao from '../dao/CityzenDao.dao';
import * as documentService from './DocumentService.service';
import { Cityzen, DocumentContainer } from "../models/core";

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

export const saveVerifiedDocumentToCityzen = async (fileInfo: JSON, cityzenEmail: string): Promise<[DocumentContainer | undefined, String] | undefined> => {
    const cityzen: Cityzen = await cityzenDao.findByEmail(cityzenEmail);

    if (fileInfo && cityzen) {
        return await documentService.saveTemporalDocument(fileInfo, cityzen);
    } else {
        return [undefined, "Incomplete information"];
    }
}