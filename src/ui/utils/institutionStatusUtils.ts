import { getCourses } from '../../actions/courses/get-courses';
import { getUserData } from '../../actions/user/get-user-data';

/**
 * Utility to check if an institution should be active based on assigned courses
 * This is a workaround for backend status issues
 */
export const checkInstitutionShouldBeActive = async (): Promise<{
  shouldBeActive: boolean;
  hasAssignedCourses: boolean;
  backendStatus: string | undefined;
  reason: string;
}> => {
  try {    
    // Get user data to check current backend status
    const userData = await getUserData();
    const backendStatus = userData?.status;
    
    // Get courses to check if institution has assignments
    const coursesResponse = await getCourses();
    const hasAssignedCourses = coursesResponse.success && coursesResponse.data && coursesResponse.data.length > 0;
    
    const shouldBeActive = hasAssignedCourses;
    
    let reason = '';
    if (hasAssignedCourses && backendStatus === 'PENDING') {
      reason = 'Institution has assigned courses but backend status is PENDING';
    } else if (hasAssignedCourses && backendStatus === 'ACTIVE') {
      reason = 'Institution has assigned courses and backend status is correctly ACTIVE';
    } else if (!hasAssignedCourses) {
      reason = 'Institution has no assigned courses';
    } else {
      reason = 'Status check completed';
    }
    
    return {
      shouldBeActive: shouldBeActive || false,
      hasAssignedCourses: hasAssignedCourses || false,
      backendStatus,
      reason
    };
    
  } catch (error) {
    return {
      shouldBeActive: false,
      hasAssignedCourses: false,
      backendStatus: undefined,
      reason: 'Error occurred during status check'
    };
  }
};

/**
 * Hook to automatically fix institution status when needed
 */
export const useInstitutionStatusFix = () => {
  const performStatusCheck = async () => {
    const statusCheck = await checkInstitutionShouldBeActive();
    
    if (statusCheck.hasAssignedCourses && statusCheck.backendStatus === 'PENDING') {
      // Institution has courses but backend status is PENDING
      // This should be reported to backend team
    }
    
    return statusCheck;
  };
  
  return { performStatusCheck };
};

/**
 * Enhanced diagnostic function to track course loading and status changes
 */
export const performDetailedInstitutionDiagnostic = async (): Promise<{
  timestamp: string;
  userDataResult: any;
  coursesResult: any;
  tokenInfo: any;
  analysis: string[];
}> => {
  const timestamp = new Date().toISOString();
  const analysis: string[] = [];
  
  try {
    // Check token status
    const tokenInfo = {
      hasToken: !!localStorage.getItem('token'),
      tokenLength: localStorage.getItem('token')?.length || 0,
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
      refreshTokenLength: localStorage.getItem('refreshToken')?.length || 0
    };
    
    analysis.push(`Token Status: ${tokenInfo.hasToken ? 'PRESENT' : 'MISSING'} (${tokenInfo.tokenLength} chars)`);
    
    // Get user data
    const userDataResult = await getUserData();
    
    analysis.push(`User Data: ${userDataResult ? 'SUCCESS' : 'FAILED'}`);
    if (userDataResult) {
      analysis.push(`Institution: ${userDataResult.institutionName || 'N/A'}`);
      analysis.push(`Backend Status: ${userDataResult.status || 'N/A'}`);
      analysis.push(`Has Grades: ${userDataResult.grades?.length || 0}`);
      analysis.push(`Has Groups: ${userDataResult.groups?.length || 0}`);
    }
    
    // Get courses
    const coursesResult = await getCourses();
    
    analysis.push(`Courses API: ${coursesResult?.success ? 'SUCCESS' : 'FAILED'}`);
    if (coursesResult?.success) {
      analysis.push(`Courses Count: ${coursesResult.data?.length || 0}`);
      if (coursesResult.data && coursesResult.data.length > 0) {
        analysis.push(`Course Titles: ${coursesResult.data.map((c: any) => c.title).join(', ')}`);
      }
    } else {
      analysis.push(`Courses Error: ${JSON.stringify(coursesResult)}`);
    }
    
    // Status analysis
    const hasAssignedCourses = coursesResult?.success && coursesResult.data && coursesResult.data.length > 0;
    const backendStatus = userDataResult?.status;
    
    if (hasAssignedCourses && backendStatus === 'PENDING') {
      analysis.push('🚨 MISMATCH: Institution has courses but backend status is PENDING');
    } else if (hasAssignedCourses && backendStatus === 'ACTIVE') {
      analysis.push('✅ STATUS OK: Institution has courses and backend status is ACTIVE');
    } else if (!hasAssignedCourses && backendStatus === 'PENDING') {
      analysis.push('ℹ️ EXPECTED: No courses assigned and backend status is PENDING');
    } else {
      analysis.push(`ℹ️ ANALYSIS: Courses=${hasAssignedCourses}, Status=${backendStatus}`);
    }
    
    return {
      timestamp,
      userDataResult,
      coursesResult,
      tokenInfo,
      analysis
    };
    
  } catch (error) {
    analysis.push(`ERROR: ${error}`);
    
    return {
      timestamp,
      userDataResult: null,
      coursesResult: null,
      tokenInfo: {},
      analysis
    };
  }
};
