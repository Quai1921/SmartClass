import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const pathChangeEmail = async (newEmail: string, oldEmail: string) => {

    const token = StorageAdapter.getItem('token');

    try {
        const { data } = await smartClassAPI.patch(
            `/users/me/changeemail`,
            {},
            {
                params: {
                    newEmail,
                    oldEmail
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return data;

    } catch (error) {
        throw new Error("Error getting user data");
    }
}
