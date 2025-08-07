import { smartClassAPI } from "../../config/smartClassAPI";

/**
 * Force refresh user data and invalidate any cached status
 */
export const forceRefreshUserStatus = async (): Promise<{
  success: boolean;
  userData?: any;
  error?: string;
}> => {
  try {
    
    // Add cache busting parameter
    const timestamp = Date.now();
    const { data } = await smartClassAPI.get(`/users/me?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    return {
      success: true,
      userData: data
    };
    
  } catch (error: any) {
    // console.error('❌ Error force refreshing user status:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error refreshing user status'
    };
  }
};

/**
 * Verify institution status consistency
 */
export const verifyInstitutionStatusConsistency = async (): Promise<{
  isConsistent: boolean;
  backendStatus: string;
  hasAssignedCourses: boolean;
  analysis: string;
}> => {
  try {
    
    // Get fresh user data
    const userResult = await forceRefreshUserStatus();
    if (!userResult.success) {
      throw new Error('Failed to get user data');
    }
    
    // Get courses
    const { data: coursesData } = await smartClassAPI.get('/courses');
    const hasAssignedCourses = Array.isArray(coursesData) && coursesData.length > 0;
    
    const backendStatus = userResult.userData?.status;
    const isConsistent = 
      (hasAssignedCourses && backendStatus === 'ACTIVE') ||
      (!hasAssignedCourses && (backendStatus === 'PENDING' || backendStatus === 'INACTIVE'));
    
    let analysis = '';
    if (hasAssignedCourses && backendStatus === 'PENDING') {
      analysis = 'INCONSISTENT: Institution has courses but status is PENDING';
    } else if (hasAssignedCourses && backendStatus === 'ACTIVE') {
      analysis = 'CONSISTENT: Institution has courses and status is ACTIVE';
    } else if (!hasAssignedCourses && backendStatus === 'PENDING') {
      analysis = 'CONSISTENT: No courses assigned and status is PENDING';
    } else {
      analysis = `ANALYSIS: Courses=${hasAssignedCourses}, Status=${backendStatus}`;
    }
    
    return {
      isConsistent,
      backendStatus,
      hasAssignedCourses,
      analysis
    };
    
  } catch (error: any) {
    // console.error('❌ Error verifying status consistency:', error);
    return {
      isConsistent: false,
      backendStatus: 'ERROR',
      hasAssignedCourses: false,
      analysis: 'Error occurred during consistency check'
    };
  }
};
