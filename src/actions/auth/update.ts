import { smartClassAPI } from "../../config/smartClassAPI";

export const update = async (
    id: string,
    email?: string,
    role?: string,
    username?: string, 
    password?: string,
    firstName?: string,
    lastName?: string,
    identificationNumber?: string
) => {

    try {
        
        const { data } = await smartClassAPI.put(`/students/update/${id}`,
            {
                username,
                password,
                email,
                role,
                firstName,
                lastName,
                identificationNumber
            });

        return data;

    } catch (error) {

        return {
            success: false,
            data: (error as any).response?.data || { alert: "An unknown error occurred" },
        };
    }
};