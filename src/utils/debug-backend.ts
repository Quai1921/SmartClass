/**
 * Debug utilities to test backend connectivity and response handling
 */
import { smartClassAPI } from '../config/smartClassAPI';
import { StorageAdapter } from '../config/adapters/storage-adapter';

/**
 * Test basic backend connectivity
 */
export const testBackendConnectivity = async () => {
  
  try {
    // Try a simple health check or login endpoint first
    const response = await fetch('http://localhost:8080/api/courses', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${StorageAdapter.getItem('token')}`,
      }
    });
    
    return {
      isReachable: response.status !== 0,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    // console.error('🧪 Backend connectivity test failed:', error);
    return {
      isReachable: false,
      error: error.message
    };
  }
};

/**
 * Test the courses API endpoint specifically
 */
export const testCoursesEndpoint = async () => {
  
  try {
    const token = StorageAdapter.getItem('token');
    if (!token) {
      return { success: false, error: 'No token available' };
    }
    
    const response = await smartClassAPI.get('/courses', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      params: {
        _test: Date.now()
      }
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    // console.error('🧪 Courses endpoint test failed:', error);
    // console.error('🧪 Error details:', {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   message: error.message
    // });
    
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Clear all browser caches and storage that might contain stale data
 */
export const clearAllCaches = () => {
  
  try {
    // Clear localStorage except for auth token
    const token = StorageAdapter.getItem('token');
    const userData = StorageAdapter.getItem('userData');
    localStorage.clear();
    if (token) StorageAdapter.setItem('token', token);
    if (userData) StorageAdapter.setItem('userData', userData);
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    return true;
  } catch (error) {
    // console.error('❌ Error clearing caches:', error);
    return false;
  }
};
