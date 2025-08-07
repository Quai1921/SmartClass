import { smartClassAPI } from "../../config/smartClassAPI";

export const deleteEvent = async (eventId: number): Promise<void> => {
    try {
        const response = await smartClassAPI.delete(`/calendar/events/${eventId}`);
        
        // Accept both 200 OK and 204 No Content as successful deletion
        if (response.status !== 200 && response.status !== 204) {
            throw new Error(`Error deleting event: ${response.statusText}`);
        }

        // Successfully deleted
    } catch (error) {
        // console.error('Error deleting event:', error);
        throw new Error(error instanceof Error ? error.message : 'Error deleting event');
    }
};
