import { RegisterCityzen } from "../payload/RegisterCityzen.request";
import bcrypt from 'bcrypt';
import { Cityzen, DocumentContainer, Document } from "../models/core";
import { getManager } from "typeorm";
import { LoginCityzen } from "../payload/LoginCityzen.request";
import { TokenPayload } from "../payload/TokenPayload.token";
import events from 'events';

import * as minticService from './MinticService.service';
import * as cityzenDao from '../dao/CityzenDao.dao';
import * as authenticationService from './AutheticationService.service';
import * as documentService from './DocumentService.service';

const eventEmitter = new events.EventEmitter();

export const register = async (registerUser: RegisterCityzen): Promise<Cityzen | undefined> => {

    if (!await minticService.getUserFromIdentifier(registerUser.identifier) &&
        !await cityzenDao.findByIdentifier(registerUser.identifier)) {

        const cityzen: Cityzen = new Cityzen();

        cityzen.identifier = registerUser.identifier;
        cityzen.firstName = registerUser.firstName;
        cityzen.lastName = registerUser.lastName;
        cityzen.email = Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('') + "@carpeta-ciudadana.com";
        cityzen.password = await bcrypt.hash(registerUser.password, 7);

        const userRepository = getManager().getRepository(Cityzen);
        const savedCityzen: Cityzen = await userRepository.save(cityzen);

        if (registerUser) {
            eventEmitter.emit('cityzenSaved', savedCityzen);
            return savedCityzen;
        } else {
            return undefined;
        }


    } else {
        return undefined;
    }
}

export const login = async (loginCityzen: LoginCityzen): Promise<String | undefined> => {

    const cityzen: Cityzen = await cityzenDao.findByEmail(loginCityzen.email);
    if (cityzen && await bcrypt.compare(loginCityzen.password, cityzen.password)) {
        return authenticationService.authenticateCityzen(cityzen);
    } else {
        return undefined;
    }
}

export const saveTemporalDocument = async (fileInfo: JSON, currentCityzen: TokenPayload): Promise<[DocumentContainer | undefined, String] | undefined> => {

    const cityzen: Cityzen = await cityzenDao.findByEmail(currentCityzen.email);

    if (fileInfo && cityzen) {
        return await documentService.saveTemporalDocument(fileInfo, cityzen);
    } else {
        return [undefined, "Incomplete information"];
    }
}

export const getMyDocumentsName = async (currentCityzen: TokenPayload): Promise<String[] | undefined> => {
    const cityzen: Cityzen = await cityzenDao.findByEmail(currentCityzen.email);
    if (cityzen) {
        const documents: DocumentContainer[] = await documentService.getDocumentContainers(cityzen);
        if (documents) {
            return documents.map(doc => doc.fileName);
        }
        return undefined;
    }
}

export const getMyDocument = async (currentCityzen: TokenPayload, fileName: string): Promise<Buffer> => {
    const cityzen: Cityzen = await cityzenDao.findByEmail(currentCityzen.email);
    if (cityzen) {
        const documents: DocumentContainer[] = await documentService.getDocumentContainers(cityzen);
        if (documents) {
            const documentContainer: DocumentContainer = documents.find(doc => doc.fileName == fileName);

            return (await documentService.getDocumentByContainerID(documentContainer.id)).file;
        }
    }
}


const notifyToMintic = async (savedCityzen: Cityzen) => {
    minticService.notifyCityzenSaved(savedCityzen)
}
eventEmitter.on('cityzenSaved', notifyToMintic);

