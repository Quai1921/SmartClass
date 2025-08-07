import { smartClassAPI } from "../../config/smartClassAPI";

export const activateAccount = async (
    id: string,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    identificationNumber: string
) => {
    try {
        const requestBody = {
            username,
            password,
            email,
            firstName,
            lastName,
            role,
            identificationNumber
        };
        
        
        const { data } = await smartClassAPI.put(`/auth/activate/${id}`, requestBody);

        return {
            success: true,
            data
        };

    } catch (error) {

        return {
            success: false,
            data: (error as any).response?.data || { message: "An unknown error occurred" },
            statusCode: (error as any).response?.status
        };
    }
};
