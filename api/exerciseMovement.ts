import { fetchFromApi } from "./exerciseClient";
import {Exercise} from "../types/exercise"

export const getCardio = async (): Promise <Exercise[]> => {
    const data = await fetchFromApi('?type=cardio')
    return data.cardio
}

export const getMovement = async (muscle:string): Promise <Exercise[]> => {
    return await fetchFromApi (`?type=strenght&muscle=${muscle}`);
}
