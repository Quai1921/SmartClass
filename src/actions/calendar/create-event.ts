import { smartClassAPI } from "../../config/smartClassAPI";

export interface CreateEventData {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    eventType: string;
    grade: string;                    // Required field
    group: string;                    // Required field  
    shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT';  // Required field
    recurrenceType: string;
    recurrenceEndDate?: string;
    allDay: boolean;
}

export interface CreatedEvent {
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

export const createEvent = async (eventData: CreateEventData): Promise<CreatedEvent> => {
    try {
        const response = await smartClassAPI.post('/calendar/events/create', eventData);
        
        if (response.status !== 201) {
            throw new Error(`Error creating event: ${response.statusText}`);
        }

        return response.data as CreatedEvent;
    } catch (error) {
        // console.error('Error creating event:', error);
        throw new Error(error instanceof Error ? error.message : 'Error creating event');
    }
};
