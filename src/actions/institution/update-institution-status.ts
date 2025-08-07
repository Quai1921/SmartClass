import { smartClassAPI } from "../../config/smartClassAPI";

interface UpdateInstitutionStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export const updateInstitutionStatus = async (
  institutionId: string, 
  active: boolean
): Promise<UpdateInstitutionStatusResponse> => {
  try {
    const { data } = await smartClassAPI.patch(
      `/institutions/${institutionId}/status?active=${active}`
    );
    
    return {
      success: true,
      message: data?.message || 'Estado de institución actualizado exitosamente',
    };
  } catch (error: any) {
    // console.error('Error updating institution status:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al actualizar el estado de la institución',
      statusCode: error.response?.status,
    };
  }
};
