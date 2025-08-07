import { smartClassAPI } from "../../config/smartClassAPI";

interface RemoveCourseFromInstitutionResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export const removeCourseFromInstitution = async (
  institutionId: string, 
  courseId: string
): Promise<RemoveCourseFromInstitutionResponse> => {
  try {
    const { data } = await smartClassAPI.delete(
      `/institutions/${institutionId}/courses/${courseId}`
    );
    
    return {
      success: true,
      message: data?.message || 'Curso removido exitosamente',
    };
  } catch (error: any) {
    // console.error('Error removing course from institution:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al remover el curso',
      statusCode: error.response?.status,
    };
  }
};
