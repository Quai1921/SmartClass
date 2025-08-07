import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

export const importTeachers = async (
    file: File, 
    updateExisting: boolean = false, 
    deleteNotFound: boolean = false
) => {
    try {
        const token = StorageAdapter.getItem("token");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('updateExisting', updateExisting.toString());
        formData.append('deleteNotFound', deleteNotFound.toString());

        const response = await smartClassAPI.post('/institutions/teachers/import-csv', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        // console.error('Error importing teachers:', error);
        throw new Error('Error al importar docentes');
    }
};
