import { smartClassAPI } from "../../config/smartClassAPI";

// Interfaz que define la estructura de datos requerida para crear una nueva institución
export interface CreateInstitutionData {
    name: string;
    address: string;
    cityId: number;
    logo?: File;
}

// Función para crear una nueva institución educativa en el sistema
export const createInstitution = async (data: CreateInstitutionData) => {
    try {        // Create FormData for multipart/form-data request
        const formData = new FormData();
        
        // Only append logo if it exists (for @RequestPart)
        if (data.logo) {
            formData.append('logo', data.logo);
        }

        // Create query parameters for @RequestParam fields
        const queryParams = new URLSearchParams({
            name: data.name,
            address: data.address,
            cityId: data.cityId.toString()
        });        const { data: response } = await smartClassAPI.post(`/institutions/create?${queryParams.toString()}`, formData, {
            headers: {
                'Content-Type': undefined, // Remove the default application/json content type
            },
        });

        return {
            success: true,
            message: response.message || "Institución creada exitosamente"
        };
    } catch (error) {
        // console.error("Error creating institution:", error);
        
        return {
            success: false,
            message: "Error al crear la institución. Inténtalo de nuevo."
        };
    }
};
