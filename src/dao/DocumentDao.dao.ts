import { DocumentContainer, Cityzen } from "../models/core";
import { getRepository } from "typeorm";

export const findDocumentContainersByCityzen = async (cityzen: Cityzen) => {
    const documentContainerRepository = getRepository(DocumentContainer);

    return await documentContainerRepository.find({
        cityzen: cityzen
    });
}
