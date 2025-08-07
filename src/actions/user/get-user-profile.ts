import { smartClassAPI } from "../../config/smartClassAPI";

export interface UserProfile {
  id: string;
  firstName: string;
  institutionName: string;
  urlInstitutionLogo: string;
  cities: string[];
  totalUsers: number;
  totalInstitutions: number;
  totalReports: number;
  totalCourses: number;
  totalClassesProgrammed: number;
  nextEventResponseDtos: Array<{
    id: string;
    title: string;
    startTime: string;
  }>;
  grades: string[];
  groups: string[];
  shifts: string[];
  subjects: string[];
}

interface GetUserProfileResponse {
  success: boolean;
  data?: UserProfile;
  error?: string;
  statusCode?: number;
}

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  try {
    const { data } = await smartClassAPI.get('/users/me');
    
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    // console.error('Error fetching user profile:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener el perfil del usuario',
      statusCode: error.response?.status || 500,
    };
  }
};
