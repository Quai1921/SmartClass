import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const pathChangePwd = async (password: string, newPassword: string) => {

    const token = StorageAdapter.getItem('token');

    try {

        const { data } = await smartClassAPI.patch(
            `/users/me/changepwd`,
            {},
            {
                params: {
                    password,
                    newPassword,
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
