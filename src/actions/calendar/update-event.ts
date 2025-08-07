import { smartClassAPI } from "../../config/smartClassAPI";

export interface UpdateEventData {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    eventType: string;
    grade: string;
    group: string;
    shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT';
    recurrenceType: string;
    recurrenceEndDate?: string;
    allDay: boolean;
}

export interface UpdatedEvent {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    eventType: string;
    grade: string;
    group: string;
    shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT';
    recurrenceType: string;
    recurrenceEndDate?: string;
    allDay: boolean;
}

export const updateEvent = async (eventId: number, eventData: UpdateEventData): Promise<UpdatedEvent> => {
    try {
        const response = await smartClassAPI.put(`/calendar/events/${eventId}`, eventData);
        
        if (response.status !== 200) {
            throw new Error(`Error updating event: ${response.statusText}`);
        }

        return response.data as UpdatedEvent;
    } catch (error) {
        // console.error('Error updating event:', error);
        throw new Error(error instanceof Error ? error.message : 'Error updating event');
    }
};
