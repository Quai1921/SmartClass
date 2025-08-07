import { StorageAdapter } from "../../config/adapters/storage-adapter";
import { API_URL } from "../../config/smartClassAPI";

export interface CreateCourseRequest {
  title: string;
  description: string;
  grade: string;
  subject: string;
  publish: boolean;
  banner?: string;
}

export interface CreateCourseResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string;
    tutorName: string;
    grade: string;
    group: string;
    subject: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    banner?: string;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Helper function to process Server-Sent Events response
 */
async function processSSEResponse(response: Response): Promise<CreateCourseResponse> {
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result = '';
  
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      result += chunk;
    }
  }
  
  
  // Parse the final result from SSE stream
  const lines = result.split('\n');
  let courseResponse = null;
  
  for (const line of lines) {
    if (line.startsWith('data: ') && !line.includes('"step"')) {
      try {
        const dataContent = line.substring(6);
        const parsed = JSON.parse(dataContent);
        if (parsed.id) {
          courseResponse = parsed;
        }
      } catch (e) {
      }
    }
  }
  
  
  return {
    success: true,
    data: courseResponse,
  };
}

/**
 * Create a new course
 */
export const createCourse = async (courseData: CreateCourseRequest): Promise<CreateCourseResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    
    if (!token || token.trim() === '') {
      return {
        success: false,
        error: 'No authentication token found. Please log in again.',
        statusCode: 401,
      };
    }

    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.grade || !courseData.subject) {
      // console.error('❌ Missing required fields:', courseData);
      return {
        success: false,
        error: 'Missing required fields',
        statusCode: 400,
      };
    }
    
    // Create FormData with exact field names matching backend @RequestParam
    const formData = new FormData();
    formData.append('title', courseData.title.trim());
    formData.append('description', courseData.description.trim());
    formData.append('grade', courseData.grade.trim());
    formData.append('subject', courseData.subject.trim());
    formData.append('publish', courseData.publish.toString());
    
    // Log what we're sending
    for (const [key, value] of formData.entries()) {
    }
    
    const url = `${API_URL}/courses/create`;
    
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for multipart/form-data
      },
      body: formData
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('❌ First attempt failed:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   errorText: errorText
      // });
      
      // Try with backend's typo 'subjet' instead of 'subject'
      
      const formDataRetry = new FormData();
      formDataRetry.append('title', courseData.title.trim());
      formDataRetry.append('description', courseData.description.trim());
      formDataRetry.append('grade', courseData.grade.trim());
      formDataRetry.append('subjet', courseData.subject.trim()); // Backend typo
      formDataRetry.append('publish', courseData.publish.toString());
      

      for (const [key, value] of formDataRetry.entries()) {
      }
      
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataRetry
      });
      
      if (!response.ok) {
        const retryErrorText = await response.text();
        // console.error('❌ Retry also failed:', response.status, retryErrorText);
        return {
          success: false,
          error: `Course creation failed: ${response.status} - ${retryErrorText}`,
          statusCode: response.status,
        };
      }
    }
    
    return await processSSEResponse(response);
    
  } catch (error: any) {
    // console.error('❌ Error creating course:', error);
    return {
      success: false,
      error: error.message || 'Error al crear el curso',
      statusCode: error.status || 500,
    };
  }
};

/**
 * Create course with file upload support for banner images
 */
export const createCourseWithFile = async (
  courseData: CreateCourseRequest, 
  bannerFile?: File
): Promise<CreateCourseResponse> => {
  try {
    const token = StorageAdapter.getItem("token");
    
    if (!token || token.trim() === '') {
      return {
        success: false,
        error: 'No authentication token found. Please log in again.',
        statusCode: 401,
      };
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('grade', courseData.grade);
    formData.append('subjet', courseData.subject); // Use backend's typo directly
    formData.append('publish', courseData.publish.toString());
    
    // Add banner file if provided
    if (bannerFile) {
      formData.append('banner', bannerFile, bannerFile.name);
    }
    
    const response = await fetch(`${API_URL}/courses/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('❌ Course creation with file failed:', response.status, errorText);
      return {
        success: false,
        error: `Error creating course: ${response.status} ${response.statusText}`,
        statusCode: response.status,
      };
    }
    
    return await processSSEResponse(response);
    
  } catch (error: any) {
    // console.error('❌ Error creating course with file:', error);
    return {
      success: false,
      error: error.message || 'Error al crear el curso',
      statusCode: error.status || 500,
    };
  }
};
