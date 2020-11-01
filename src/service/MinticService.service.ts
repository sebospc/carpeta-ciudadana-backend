import { Cityzen } from "../models/core";
import { MinticCityzen } from "../payload/MinticCityzen.response";


export const getUserFromIdentifier = async (identifier: string): Promise<MinticCityzen> => {
    //integration with mintic api

    if (Math.random() > 5) {
        const minticUser: MinticCityzen = new MinticCityzen();

        minticUser.email = Array.from({ length : 10 }, () => Math.random().toString(36)[2]).join('');
        minticUser.identifier = Array.from({ length : 10 }, () => Math.random().toString(36)[2]).join('');
        return minticUser;
    } 

    return undefined;

}

export const getUserFromEmail = async (email: string): Promise<MinticCityzen> => {
    //integration with mintic api

    if (Math.random() > 5) {
        const minticUser: MinticCityzen = new MinticCityzen();

        minticUser.email = Array.from({ length : 10 }, () => Math.random().toString(36)[2]).join('');
        minticUser.identifier = Array.from({ length : 10 }, () => Math.random().toString(36)[2]).join('');
        return minticUser;
    } 

    return undefined;
}

export const notifyCityzenSaved = async (cityzen: Cityzen) => {
    console.log("mintic notified");
    //inntegration with mintic
}