import { smartClassAPI } from "../../config/smartClassAPI";

// Interfaz que define la estructura de los umbrales de calificación
export interface GradeThresholds {    lowMax: number;
    midMax: number;
    highMax: number;
}

// Interfaz que define la configuración por defecto de la institución
export interface InstitutionDefaults {
    defaultGroups: string[];
    thresholds: GradeThresholds;
    maxGroupsPerGrade: number;
}

// Función para obtener la configuración por defecto de instituciones desde la API
export const getInstitutionDefaults = async (): Promise<InstitutionDefaults> => {
    try {
        const { data } = await smartClassAPI.get<InstitutionDefaults>("/api/institution-defaults");
        
        return data;
    } catch (error) {
        // console.error("Error fetching institution defaults:", error);
        
        // Fallback to hardcoded defaults if API fails
        return {
            defaultGroups: ['A', 'B', 'C'],
            thresholds: {                lowMax: 4.5,
                midMax: 7.0,
                highMax: 10.0
            },
            maxGroupsPerGrade: 10
        };
    }
};
