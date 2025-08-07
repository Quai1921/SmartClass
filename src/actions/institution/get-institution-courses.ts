import { smartClassAPI } from "../../config/smartClassAPI";

export interface InstitutionCourse {
  id: string;
  title: string;
}

interface GetInstitutionCoursesResponse {
  success: boolean;
  data?: {
    courses: InstitutionCourse[];
  };
  error?: string;
  statusCode?: number;
}

export const getInstitutionCourses = async (institutionId: string): Promise<GetInstitutionCoursesResponse> => {
  try {
    const { data } = await smartClassAPI.get(`/institutions/${institutionId}/courses`);
    
    return {
      success: true,
      data: {
        courses: data.courses || [],
      },
    };
  } catch (error: any) {
    // console.error('Error fetching institution courses:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener los cursos de la institución',
      statusCode: error.response?.status,
    };
  }
};
