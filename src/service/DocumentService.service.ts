import { Citizen, DocumentContainer, Document } from "../models/core";
import { readFileSync } from 'fs';
import { getManager } from "typeorm";
import * as documentDao from '../dao/DocumentDao.dao';

export const saveTemporalDocument = async (fileInfo: JSON, citizen: Citizen): Promise<[DocumentContainer | undefined, String] | undefined> => {
    const documentContainerRepository = getManager().getRepository(DocumentContainer);
    const currentDocuments: DocumentContainer[] = await documentContainerRepository.find({
        citizen: citizen
    });
    if (!currentDocuments.some(doc => doc.fileName == fileInfo['filename'])) {

        const document: Document = new Document();

        document.file = ("\\x" + readFileSync(fileInfo['path']).toString('hex')) as any;
        const documentRepository = getManager().getRepository(Document);
        await documentRepository.save(document);


        const documentContainer: DocumentContainer = new DocumentContainer();

        documentContainer.fileName = fileInfo['filename'];
        documentContainer.mimeType = fileInfo['mimetype'];
        documentContainer.citizen = citizen;
        documentContainer.document = document;
        return [await documentContainerRepository.save(documentContainer), "Document saved"];
    } else {
        return [undefined, "Document already exists"];
    }

}

export const getDocumentContainers = async (citizen: Citizen) => {

    return await documentDao.findDocumentContainersBycitizen(citizen);
}

export const getDocumentByContainerID = async (containerID: string): Promise<Document> => {
    const documentContainerRepository = getManager().getRepository(DocumentContainer);
    const documentContainerRelationed: DocumentContainer = await documentContainerRepository.findOne({
        where: {
            id: containerID
        },
        relations: ['document']
    });
    return documentContainerRelationed.document;
}


            
                