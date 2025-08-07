import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

export interface Course {
  id: string;
  title: string;
  banner: string;
  description: string;
  tutorName: string;
  grade: string;
  group: string;
  subject: string;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  createdAt: string;
  modules?: Module[]; // Add modules array as optional property
}

// Import Module type to avoid circular dependency
interface Module {
  id: string;
  courseId?: string;
  type: 'ACADEMIC' | 'EVALUATIVE';
  title: string;
  description?: string;
  content?: string;
  order?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  createdAt: string;
}

interface GetCoursesResponse {
  success: boolean;
  data?: Course[];
  error?: string;
  statusCode?: number;
}

export const getCourses = async (): Promise<GetCoursesResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    const { data } = await smartClassAPI.get('/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      // console.error('❌ get-courses.ts - Expected array but got:', typeof data);
      return {
        success: false,
        error: 'Invalid response format - expected array',
        data: []
      };
    }
    
    
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    // console.error('❌ get-courses.ts - Error fetching courses:', error);
    // console.error('❌ get-courses.ts - Error status:', error.response?.status);
    // console.error('❌ get-courses.ts - Error data:', error.response?.data);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al cargar los cursos',
      statusCode: error.response?.status,
    };
  }
};
