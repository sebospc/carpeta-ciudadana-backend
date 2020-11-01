import { Organization } from "../models/core/Organization.entity";
import { getRepository } from "typeorm";

export const findByIdentifier = async (identifier: string): Promise<Organization> => {
    const organizationRepository = getRepository(Organization);

    return organizationRepository.findOne({ identifier: identifier });
}