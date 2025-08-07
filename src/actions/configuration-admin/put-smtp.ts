import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const putSMTP = async(
    host: string,
    port: number,
    username: string,
    password: string,
    auth: boolean,
    starttls: boolean

) => {

    const token = StorageAdapter.getItem('token');

    try {

        const { data } = await smartClassAPI.put(
            `/config/smtp/update`,
            {
                host,
                port,
                username,
                password,
                auth,
                starttls
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return data;

    } catch (error) {

        throw new Error("Error put smtp data");
    }
}
