import { RegisterCitizen } from '../payload/RegisterCitizen.request';
import bcrypt from 'bcrypt';
import { Citizen, DocumentContainer, Document } from '../models/core';
import { getManager } from 'typeorm';
import { LoginCitizen } from '../payload/LoginCitizen.request';
import { TokenPayload } from '../payload/TokenPayload.token';

import * as minticService from './MinticService.service';
import * as citizenDao from '../dao/CitizenDao.dao';
import * as authenticationService from './AutheticationService.service';
import * as documentService from './DocumentService.service';

export const register = async (registerUser: RegisterCitizen): Promise<Citizen | undefined> => {

    if (!await minticService.citizenAlreadyRegistered(registerUser.identifier) &&
        !await citizenDao.findByIdentifier(registerUser.identifier)) {

        const citizen: Citizen = new Citizen();

        citizen.identifier = registerUser.identifier;
        citizen.firstName = registerUser.firstName;
        citizen.lastName = registerUser.lastName;
        citizen.email = Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('') + '@carpeta-ciudadana.com';
        citizen.password = await bcrypt.hash(registerUser.password, 7);
        citizen.address = registerUser.address;

        const userRepository = getManager().getRepository(Citizen);

        if (minticService.notifyCitizenSaved(citizen)) {
            const savedcitizen: Citizen = await userRepository.save(citizen);
            return savedcitizen;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export const login = async (logincitizen: LoginCitizen): Promise<String | undefined> => {

    const citizen: Citizen = await citizenDao.findByEmail(logincitizen.email);
    if (citizen && await bcrypt.compare(logincitizen.password, citizen.password)) {
        return authenticationService.authenticatecitizen(citizen);
    } else {
        return undefined;
    }
}

export const saveTemporalDocument = async (fileInfo: JSON, currentcitizen: TokenPayload): Promise<[DocumentContainer | undefined, String] | undefined> => {

    const citizen: Citizen = await citizenDao.findByEmail(currentcitizen.email);

    if (fileInfo && citizen) {
        return await documentService.saveDocument(fileInfo, citizen);
    } else {
        return [undefined, 'Incomplete information'];
    }
}

export const getMyDocumentsName = async (currentcitizen: TokenPayload): Promise<String[] | undefined> => {
    const citizen: Citizen = await citizenDao.findByEmail(currentcitizen.email);
    if (citizen) {
        const documents: DocumentContainer[] = await documentService.getDocumentContainers(citizen);
        if (documents) {
            return documents.map(doc => doc.fileName);
        }
        return undefined;
    }
}

export const getMyDocument = async (currentcitizen: TokenPayload, fileName: string): Promise<Buffer> => {
    const citizen: Citizen = await citizenDao.findByEmail(currentcitizen.email);
    if (citizen) {
        const documents: DocumentContainer[] = await documentService.getDocumentContainers(citizen);
        if (documents) {
            const documentContainer: DocumentContainer = documents.find(doc => doc.fileName == fileName);

            return (await documentService.getDocumentByContainerID(documentContainer.id)).file;
        }
    }
}