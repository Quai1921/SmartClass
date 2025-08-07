import { smartClassAPI } from "../../config/smartClassAPI";

export const importUsers = async (file: File, updateExisting: boolean, deleteNotFound: boolean) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('updateExisting', updateExisting.toString());
        formData.append('deleteNotFound', deleteNotFound.toString());

        const response = await smartClassAPI.post('/api/users/import-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        // console.error('Error importing users:', error);
        throw new Error('Error al importar usuarios');
    }
};
