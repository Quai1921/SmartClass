import { smartClassAPI } from "../../config/smartClassAPI";

interface AssignCoursesResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export const assignCoursesToInstitution = async (
  institutionId: string, 
  courseIds: string[]
): Promise<AssignCoursesResponse> => {
  try {
    
    const { data } = await smartClassAPI.post(
      `/institutions/${institutionId}/courses/assign`,
      courseIds
    );
    
    return {
      success: true,
      message: data?.message || 'Cursos asignados exitosamente',
    };
  } catch (error: any) {
    // console.error('❌ Error assigning courses to institution:', error);
    // console.error('❌ Error details:', {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   institutionId,
    //   courseIds
    // });
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al asignar los cursos',
      statusCode: error.response?.status,
    };
  }
};

/**
 * Enhanced course assignment with status verification
 */
export const assignCoursesToInstitutionWithStatusUpdate = async (
  institutionId: string, 
  courseIds: string[]
): Promise<AssignCoursesResponse & { statusUpdated?: boolean }> => {
  try {
    
    // 1. Assign courses
    const assignResult = await assignCoursesToInstitution(institutionId, courseIds);
    
    if (!assignResult.success) {
      return assignResult;
    }
    
    // 2. Wait a moment for backend processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Verify status was updated
    let statusUpdated = false;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!statusUpdated && attempts < maxAttempts) {
      try {
        const { data: userData } = await smartClassAPI.get('/users/me');
        
        if (userData?.status === 'ACTIVE') {
          statusUpdated = true;
        } else if (attempts < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        // console.warn(`⚠️ Error checking status on attempt ${attempts + 1}:`, error);
      }
      
      attempts++;
    }
    
    if (!statusUpdated) {
      // console.warn('🚨 WARNING: Courses assigned but institution status may not have updated to ACTIVE');
    }
    
    return {
      ...assignResult,
      statusUpdated
    };
    
  } catch (error: any) {
    // console.error('❌ Error in enhanced course assignment:', error);
    return {
      success: false,
      error: 'Error en la asignación de cursos con verificación de estado',
      statusUpdated: false
    };
  }
};
