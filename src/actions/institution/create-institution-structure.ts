import { smartClassAPI } from "../../config/smartClassAPI";

export interface InstitutionStructureData {
    shifts: Array<{
        shift: string;
        fromGrade: number;
        toGrade: number;
        groupNames: string[];
    }>;    thresholds: {
        lowMax: number;
        midMax: number;
        highMax: number;
    };
}

export const createInstitutionStructure = async (data: InstitutionStructureData) => {
    try {
        const { data: response } = await smartClassAPI.post('/institutions/structure/create', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return {
            success: true,
            message: response.message || "Estructura de institución configurada exitosamente"
        };
    } catch (error) {
        // console.error("Error creating institution structure:", error);
        
        return {
            success: false,
            message: "Error al configurar la estructura de la institución. Inténtalo de nuevo."
        };
    }
};
