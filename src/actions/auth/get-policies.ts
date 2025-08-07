import { smartClassAPI } from "../../config/smartClassAPI";

export interface Policy {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    lastModified: string;
    active: boolean;
}

export const getPolicies = async (): Promise<Policy[]> => {
    try {
        const { data } = await smartClassAPI.get<Policy[]>("/users/policies");
        return data || [];
    } catch (error) {
        // console.error("Error fetching policies:", error);
        throw new Error("Error al obtener las políticas");
    }
};
