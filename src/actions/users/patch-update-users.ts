import { smartClassAPI } from "../../config/smartClassAPI";

interface UpdateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    identificationNumber: string;
}

interface UpdateUserResponse {
    message: string;
}

interface UpdateUserResult {
    success: boolean;
    message: string;
}

export const updateUser = async (
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    identificationNumber: string
): Promise<UpdateUserResult> => {
    try {
        const requestData: UpdateUserRequest = {
            email,
            firstName,
            lastName,
            identificationNumber
        };        const { data } = await smartClassAPI.patch<UpdateUserResponse>(
            `/users/update/${userId}`,
            requestData
        );

        return {
            success: true,
            message: data.message
        };
    } catch (error: any) {
        if (error.response?.data?.message) {
            return {
                success: false,
                message: error.response.data.message
            };
        }
        return {
            success: false,
            message: "Error al actualizar usuario"
        };
    }
};
