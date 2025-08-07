import { smartClassAPI } from "../../config/smartClassAPI";

// Interfaz que define la estructura de un grado académico
export interface Grade {
    value: number;
    label: string;
    level: 'PRESCHOOL' | 'PRIMARY' | 'SECONDARY';
}

// Función para obtener la lista de grados académicos disponibles desde la API
export const getGrades = async (): Promise<Grade[]> => {
    try {
        const { data } = await smartClassAPI.get<Grade[]>("/api/grades");
        
        return data;
    } catch (error) {
        // console.error("Error fetching grades:", error);
        
        // Fallback to hardcoded grades if API fails
        return Array.from({ length: 13 }, (_, i) => ({
            value: i,
            label: i === 0 ? 'Preescolar' 
                : i <= 5 ? `${i}° de primaria`
                : i === 11 ? '11° de bachillerato' 
                : i === 12 ? '12° de bachillerato'
                : `${i}° de secundaria`,
            level: i === 0 ? 'PRESCHOOL' : i <= 5 ? 'PRIMARY' : 'SECONDARY'
        }));
    }
};
