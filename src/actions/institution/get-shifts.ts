import { smartClassAPI } from "../../config/smartClassAPI";

// Interfaz que define la estructura de un turno/jornada
export interface Shift {
    value: string;
    label: string;
    description?: string;
}

// Función para obtener la lista de turnos/jornadas disponibles desde la API
export const getShifts = async (): Promise<Shift[]> => {
    try {
        const { data } = await smartClassAPI.get<Shift[]>("/api/shifts");
        
        return data;
    } catch (error) {
        // console.error("Error fetching shifts:", error);
        
        // Fallback to hardcoded shifts if API fails
        return [
            { value: 'MORNING', label: 'Mañana' },
            { value: 'AFTERNOON', label: 'Tarde' },
            { value: 'NIGHT', label: 'Noche' },
            { value: 'FULL_TIME', label: 'Tiempo completo' }
        ];
    }
};
