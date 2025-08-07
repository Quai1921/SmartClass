import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";



export const getUserData = async () => {
    const token = StorageAdapter.getItem('token');    try {
        const response = await smartClassAPI.get("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { data } = response;

        // Check if response status is not 200
        if (response.status !== 200) {
            throw new Error(`API returned status ${response.status}`);
        }

        // Check if data is empty or invalid
        if (!data || data === '' || (typeof data === 'string' && data.trim() === '')) {
            throw new Error("Empty response from API - this might indicate an inactive institution or invalid token");
        }

        // If data is a string but not empty, try to parse it
        if (typeof data === 'string') {
            try {
                const parsedData = JSON.parse(data);
                const userData = UserMapper.smartClassUserToEntity(parsedData);
                return userData;
            } catch (parseError) {
                throw new Error("Invalid JSON response from API");
            }
        }

        // If data is already an object, use it directly
        const userData = UserMapper.smartClassUserToEntity(data);
        return userData;    } catch (error: any) {
        
        // If it's a network error, provide more specific message
        if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
            throw new Error("Network error - check your internet connection");
        }
        
        // If it's a 401/403, it's likely an auth issue
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            throw new Error("Authentication failed - please log in again");
        }
        
        throw new Error("Error getting user data");
    }
};