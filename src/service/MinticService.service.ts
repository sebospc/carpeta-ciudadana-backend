import { Citizen, DocumentContainer } from '../models/core';
import axios from 'axios';
import * as config from '../../config';

export const citizenAlreadyRegistered = async (identifier: string): Promise<boolean> => {

    try {
        const response = await axios.get(`${config.mintic_hostname}/apis/validateCitizen/${identifier}`);
        console.log(response.data)
        return response.status == 200;
    } catch (error) {
        console.log(error)
        return undefined;
    }

}

export const notifyCitizenSaved = async (citizen: Citizen): Promise<boolean> => {

    const minticCitizenRequest = {
        id: citizen.identifier,
        name: citizen.firstName + ' ' + citizen.lastName,
        address: citizen.address ?? Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join(''),
        email: citizen.email,
        operatorId: 2,
        operatorName: 'Carpeta Ciudadana'
    }

    try {
        const response = await axios.post(config.mintic_hostname+'/apis/registercitizen', minticCitizenRequest);
        console.log(response.data)
        return response.status == 200;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}

export const validateDocument = async(identifier: string, documentContainer: DocumentContainer): Promise<boolean> => {

    try {
        const response = await axios.get(`${config.mintic_hostname}/apis/authenticateDocument/${identifier}/${documentContainer.fileName}/${documentContainer.fileName}`);
        console.log(response.data)
        return response.status == 200;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}