import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

export interface CourseWithPages {
  id: string;
  title: string;
  description: string;
  tutorName: string;
  grade: string;
  group: string;
  assignment?: string;
  type: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  pages: CoursePage[];
}

export interface CoursePage {
  id: string;
  title: string;
  content: any; // JSON content of the page builder elements
  createdAt: string;
  updatedAt: string;
}

export interface GetCourseWithPagesResponse {
  success: boolean;
  data?: CourseWithPages;
  error?: string;
  statusCode?: number;
}

export const getCourseWithPages = async (courseId: string): Promise<GetCourseWithPagesResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    const { data } = await smartClassAPI.get(`/courses/${courseId}/pages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    // console.error('Error fetching course with pages:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al cargar el curso',
      statusCode: error.response?.status,
    };
  }
};
