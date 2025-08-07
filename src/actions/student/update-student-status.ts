import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { smartClassAPI } from "../../config/smartClassAPI";

export const updateStudentStatus = async (
    studentId: number,
    status: string
): Promise<void> => {
    const token = StorageAdapter.getItem("token"); try {
        await smartClassAPI.patch(
            `/students/${studentId}/status`,
            status,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error: any) {
        const message = error.response?.data?.message || `Error actualizando el estado del estudiante.
        Inténtalo de nuevo.`;
        throw new Error(message);
    }
};
