import { getRepository } from "typeorm";
import { Cityzen } from '../models/core';



export const findByIdentifier = async (identifier: string): Promise<Cityzen> => {
    const cityzenRepository = getRepository(Cityzen);

    const cityzen: Cityzen = new Cityzen();
    cityzen.identifier = identifier;
    return cityzenRepository.findOne(cityzen);

}

export const findByEmail = async (email: string): Promise<Cityzen> => {
    const cityzenRepository = getRepository(Cityzen);

    const cityzen: Cityzen = new Cityzen();
    cityzen.email = email;
    return cityzenRepository.findOne(cityzen);

}