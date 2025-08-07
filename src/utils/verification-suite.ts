/**
 * Comprehensive test suite for verifying authentication and module functionality
 */
import { StorageAdapter } from '../config/adapters/storage-adapter';
import { smartClassAPI } from '../config/smartClassAPI';
import { getCourses } from '../actions/courses/get-courses';
import { getModules } from '../actions/modules/modules';

export interface VerificationResult {
  step: string;
  success: boolean;
  details: any;
  error?: string;
}

/**
 * Complete verification test suite
 */
export const runCompleteVerification = async (courseId: string = "1"): Promise<VerificationResult[]> => {
  const results: VerificationResult[] = [];

  // Step 1: Check authentication token

  try {
    const token = StorageAdapter.getItem('token');
    if (!token) {
      results.push({
        step: '1. Authentication Token',
        success: false,
        details: 'No token found',
        error: 'No authentication token in storage'
      });
      return results;
    }

    // Parse and validate token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    const timeUntilExpiry = payload.exp - currentTime;

    results.push({
      step: '1. Authentication Token',
      success: !isExpired,
      details: {
        hasToken: true,
        role: payload.role,
        isExpired,
        expiryTime: new Date(payload.exp * 1000).toISOString(),
        timeUntilExpiryMinutes: Math.round(timeUntilExpiry / 60),
        tokenLength: token.length
      },
      error: isExpired ? 'Token is expired' : undefined
    });

    if (isExpired) {
      // console.error('❌ Token is expired, stopping verification');
      return results;
    }
  } catch (error: any) {
    results.push({
      step: '1. Authentication Token',
      success: false,
      details: 'Token parsing failed',
      error: error.message
    });
    return results;
  }

  // Step 2: Test courses API directly

  try {
    const response = await fetch('http://localhost:8080/api/courses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${StorageAdapter.getItem('token')}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    const responseText = await response.text();
    let parsedData = null;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      // Response might not be JSON
    }

    results.push({
      step: '2. Courses API Direct',
      success: response.ok,
      details: {
        status: response.status,
        statusText: response.statusText,
        isJson: !!parsedData,
        dataLength: responseText.length,
        courseCount: Array.isArray(parsedData) ? parsedData.length : 'N/A',
        preview: responseText.substring(0, 100) + (responseText.length > 100 ? '...' : '')
      },
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    });
  } catch (error: any) {
    results.push({
      step: '2. Courses API Direct',
      success: false,
      details: 'Request failed',
      error: error.message
    });
  }

  // Step 3: Test getCourses action

  try {
    const coursesResponse = await getCourses();
    
    results.push({
      step: '3. getCourses Action',
      success: coursesResponse.success,
      details: {
        success: coursesResponse.success,
        statusCode: coursesResponse.statusCode,
        courseCount: coursesResponse.data ? coursesResponse.data.length : 0,
        courses: coursesResponse.data ? coursesResponse.data.map(c => ({
          id: c.id,
          title: c.title,
          hasModules: !!c.modules
        })) : []
      },
      error: coursesResponse.success ? undefined : coursesResponse.error
    });
  } catch (error: any) {
    results.push({
      step: '3. getCourses Action',
      success: false,
      details: 'Action failed',
      error: error.message
    });
  }

  // Step 4: Test getModules for specific course

  try {
    const modulesResponse = await getModules(courseId);
    
    results.push({
      step: '4. getModules Action',
      success: modulesResponse.success,
      details: {
        courseId,
        success: modulesResponse.success,
        statusCode: modulesResponse.statusCode,
        moduleCount: modulesResponse.data ? modulesResponse.data.length : 0,
        modules: modulesResponse.data ? modulesResponse.data.map(m => ({
          id: m.id,
          title: m.title,
          type: m.type,
          status: m.status
        })) : []
      },
      error: modulesResponse.success ? undefined : modulesResponse.error
    });
  } catch (error: any) {
    results.push({
      step: '4. getModules Action',
      success: false,
      details: 'Action failed',
      error: error.message
    });
  }

  // Step 5: Test backend connectivity

  try {
    const healthResponse = await fetch('http://localhost:8080/actuator/health', {
      method: 'GET'
    });
    
    const healthData = await healthResponse.text();
    
    results.push({
      step: '5. Backend Health',
      success: healthResponse.ok,
      details: {
        status: healthResponse.status,
        response: healthData.substring(0, 200),
        timestamp: new Date().toISOString()
      },
      error: healthResponse.ok ? undefined : `Health check failed: ${healthResponse.status}`
    });
  } catch (error: any) {
    results.push({
      step: '5. Backend Health',
      success: false,
      details: 'Health check failed',
      error: error.message
    });
  }

  return results;
};

/**
 * Display verification results in a readable format
 */
export const displayVerificationResults = (results: VerificationResult[]) => {

  
  let allPassed = true;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';

    
    if (result.success) {

    } else {
      allPassed = false;
    }
  });
  
  
  return allPassed;
};

// Make functions available globally for browser console testing
(window as any).runCompleteVerification = runCompleteVerification;
(window as any).displayVerificationResults = displayVerificationResults;
