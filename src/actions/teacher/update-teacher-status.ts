import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const updateTeacherStatus = async (
    teacherId: string,
    status: string
): Promise<void> => {
    const token = StorageAdapter.getItem("token");    try {
        await smartClassAPI.patch(
            `/teachers/${teacherId}/status`, 
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    status: status
                }
            }
        );
    } catch (error: any) {
        const message = error.response?.data?.message || 'Error updating teacher status';
        throw new Error(message);
    }
};
