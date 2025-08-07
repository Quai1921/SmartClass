import { smartClassAPI } from "../../config/smartClassAPI";

// Interfaz que define la estructura de una ciudad según la API
export interface City {
    id: number;
    municipality: string;
    department: string;
    country: string;
    countryCode: string;
}

// Función para obtener la lista de ciudades disponibles desde la API
export const getCities = async (): Promise<City[]> => {
    try {
        const { data } = await smartClassAPI.get<City[]>("/cities");
        
        // Retorna directamente los datos ya que la API devuelve un array de ciudades
        return data;
    } catch (error) {
        // console.error("Error fetching cities:", error);
        throw new Error("Error al obtener las ciudades");
    }
};
