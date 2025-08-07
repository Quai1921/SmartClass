import { smartClassAPI } from "../../config/smartClassAPI";

// 📅 Interfaz para un evento del calendario
export interface CalendarEvent {
    id: number;
    grade: string;
    group: string;
    shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT';
    eventType: 'HOLIDAY' | 'EXAM' | 'MEETING' | 'CLASS' | 'EVENT';
    title: string;
    description: string;
    startTime: string; // ISO date string
    endTime: string;   // ISO date string
    recurrenceEndDate?: string;
    allDay: boolean;
}

/**
 * Obtiene los próximos eventos y festivos del calendario institucional
 * 
 * @param gradeId - ID del grado (opcional, para filtrar por grado específico)
 * @param group - Grupo específico (opcional)
 * @param shiftType - Turno específico (opcional)
 * @returns Promise<CalendarEvent[]> - Array de eventos del calendario
 */
export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    try {
        // � Obtener todos los eventos sin filtros (el backend no filtra correctamente)
        const endpoint = '/calendar';


        const { data } = await smartClassAPI.get<CalendarEvent[]>(endpoint);


        // Log each event's grade for debugging
        // data.forEach((event, index) => {
        // });
        // 🔍 Return all events for debugging (remove future filter temporarily)
        const allEvents = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        return allEvents;
    } catch (error) {
        // console.error("❌ Error al obtener eventos del calendario:", {
        //     error: error instanceof Error ? error.message : 'Error desconocido',
        //     status: (error as any)?.response?.status,
        //     data: (error as any)?.response?.data
        // });

        // 🔄 En caso de error, retornar array vacío para evitar crash de la UI
        return [];
    }
};

/**
 * Obtiene específicamente los próximos 2 festivos/eventos importantes
 * Útil para mostrar en el dashboard principal
 * 
 * @returns Promise<CalendarEvent[]> - Máximo 2 eventos próximos más importantes
 */
export const getUpcomingHolidays = async (): Promise<CalendarEvent[]> => {
    try {
        // 📅 Obtener todos los eventos próximos
        const allEvents = await getCalendarEvents();

        // 🎯 Filtrar por tipos importantes y tomar solo los primeros 2
        const importantEvents = allEvents
            .filter(event =>
                event.eventType === 'HOLIDAY' ||
                event.eventType === 'EXAM' ||
                event.eventType === 'EVENT'
            )
            .slice(0, 2); // Solo los próximos 2 eventos importantes

        return importantEvents;

    } catch (error) {
        // console.error("❌ Error al obtener festivos próximos:", error);
        return [];
    }
};

/**
 * Formatea una fecha para mostrar en el dashboard
 * 
 * @param dateString - Fecha en formato ISO
 * @returns string - Fecha formateada (ej: "Jul 2")
 */
export const formatEventDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const month = date.toLocaleDateString('es-ES', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    } catch (error) {
        // console.error("Error al formatear fecha:", error);
        return "Fecha inválida";
    }
};
