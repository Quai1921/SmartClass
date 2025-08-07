import { smartClassAPI } from "../../config/smartClassAPI";



export const register = async (
    email: string,
    role: string,
    username?: string, 
    password?: string,
    firstName?: string,
    lastName?: string,
    identificationNumber?: string
) => {

    try {
        const { data } = await smartClassAPI.post("/auth/register",
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
