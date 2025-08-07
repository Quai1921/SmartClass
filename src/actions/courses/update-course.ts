import { API_URL } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

export interface UpdateCourseRequest {
  title: string;                  // @NotBlank - Required
  description: string;            // @NotBlank - Required  
  grade?: string;                 // Optional
  subject?: string;               // Optional
  status?: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW'; // Optional - CourseStatus enum
}

export interface CourseRequestDto {
  title: string;
  description: string;
  grade: string;
  subject: string;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
}

export interface UpdateCourseResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string;
    tutorName: string;
    grade: string;
    group: string;
    subject?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
    createdAt: string;
    updatedAt: string;
    banner?: string;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Update an existing course
 * PATCH /api/courses/update/{id}
 */
export const updateCourse = async (
  courseId: string,
  courseData: UpdateCourseRequest
): Promise<UpdateCourseResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    // Build URL with query parameters as expected by backend
    const params = new URLSearchParams();
    
    // Add only non-empty fields to query parameters
    if (courseData.title?.trim()) {
      params.append('title', courseData.title.trim());
    }
    if (courseData.description?.trim()) {
      params.append('description', courseData.description.trim());
    }
    if (courseData.grade?.trim()) {
      params.append('grade', courseData.grade.trim());
    }
    if (courseData.subject?.trim()) {
      params.append('subject', courseData.subject.trim());
    }
    if (courseData.status !== undefined) {
      params.append('status', courseData.status);
    }
    

    for (const [key, value] of params.entries()) {
    }
    
    const queryString = params.toString();
    const url = `${API_URL}/courses/update/${courseId}${queryString ? `?${queryString}` : ''}`;
    
    // Create FormData for potential file uploads (banner when implemented)
    const formData = new FormData();
    // Banner file can be added here when file upload is implemented
    // if (bannerFile) {
    //   formData.append('banner', bannerFile);
    // }
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData.has('banner') ? formData : undefined
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('❌ Course update failed:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    // Handle SSE response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
    }
    
    // Try to parse the last SSE event
    let responseData = null;
    if (result) {
      const lines = result.split('\n').filter(line => line.startsWith('data:'));
      if (lines.length > 0) {
        try {
          const lastDataLine = lines[lines.length - 1];
          responseData = JSON.parse(lastDataLine.substring(5)); // Remove 'data:' prefix
        } catch (e) {
          // console.warn('Failed to parse SSE data:', e);
        }
      }
    }
    
    return {
      success: true,
      data: responseData || {
        id: courseId,
        title: courseData.title || 'Updated Course',
        description: courseData.description || '',
        tutorName: 'Unknown',
        grade: courseData.grade || '',
        group: 'A',
        subject: courseData.subject || '',
        status: courseData.status || 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    // console.error('Error updating course:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al actualizar el curso',
      statusCode: error.response?.status,
    };
  }
};
