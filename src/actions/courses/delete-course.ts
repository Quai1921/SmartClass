import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

interface DeleteCourseResponse {
  success: boolean;
  error?: string;
  statusCode?: number;
}

/**
 * Delete a course
 * DELETE /api/courses/delete/{id}
 */
export const deleteCourse = async (courseId: string): Promise<DeleteCourseResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    await smartClassAPI.delete(`/courses/delete/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return {
      success: true,
    };
  } catch (error: any) {
    // console.error('Error deleting course:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar el curso',
      statusCode: error.response?.status,
    };
  }
};
