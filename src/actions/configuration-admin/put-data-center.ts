import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const putDataCenter = async (
    endpoint: string,
    accessKey: string,
    secretKey: string,
    bucketName: string,

) => {

    const token = StorageAdapter.getItem('token');

    try {

        const { data } = await smartClassAPI.put(
            `/config/wasabi`,
            {
                endpoint,
                accessKey,
                secretKey,
                bucketName,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return data;

    } catch (error) {

        throw new Error("Error getting user data");
    }
}
