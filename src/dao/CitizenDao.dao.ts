import { getRepository } from "typeorm";
import { Citizen } from '../models/core';



export const findByIdentifier = async (identifier: string): Promise<Citizen> => {
    const citizenRepository = getRepository(Citizen);

    const citizen: Citizen = new Citizen();
    citizen.identifier = identifier;
    return citizenRepository.findOne(citizen);

}

export const findByEmail = async (email: string): Promise<Citizen> => {
    const citizenRepository = getRepository(Citizen);

    const citizen: Citizen = new Citizen();
    citizen.email = email;
    return citizenRepository.findOne(citizen);

}