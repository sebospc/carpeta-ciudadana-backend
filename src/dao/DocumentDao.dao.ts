import { DocumentContainer, Citizen } from "../models/core";
import { getRepository } from "typeorm";

export const findDocumentContainersBycitizen = async (citizen: Citizen) => {
    const documentContainerRepository = getRepository(DocumentContainer);

    return await documentContainerRepository.find({
        citizen: citizen
    });
}
