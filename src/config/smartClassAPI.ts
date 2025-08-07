import axios from "axios";
import { StorageAdapter } from "./adapters/storage-adapter";

export const API_URL = 'http://localhost:8080/api';

const smartClassAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Function to refresh the access token
const refreshAuthToken = async () => {
    try {
        const refreshToken = StorageAdapter.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        // Create a new axios instance without interceptors to avoid infinite loops
        const refreshAPI = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await refreshAPI.post('/auth/refresh', {
            refreshToken: refreshToken
        });

        if (response.data && response.data.accessToken) {
            
            // Store the new tokens
            StorageAdapter.setItem('token', response.data.accessToken);
            if (response.data.refreshToken) {
                StorageAdapter.setItem('refreshToken', response.data.refreshToken);
            }
            
            return {
                success: true,
                accessToken: response.data.accessToken
            };
        } else {
            throw new Error('Invalid refresh response format');
        }
    } catch (error) {
        // console.error('❌ Token refresh failed:', error);
        return {
            success: false,
            error: error
        };
    }
};

// Interceptor to attach the token to requests
smartClassAPI.interceptors.request.use(
    async (config) => {
        const token = StorageAdapter.getItem('token');
        
        if (token) {
            // Basic token validation - don't throw errors, just warn
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                // console.warn('⚠️ Invalid token format - expected 3 parts, got:', tokenParts.length);
                // console.warn('⚠️ Token might be corrupted, but continuing with request');
            }
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // console.warn('⚠️ No token found for protected endpoint:', config.url);
        }
        return config;
    },
    (error) => {
        // console.error('🔐 Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors and automatic token refresh
smartClassAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`);
        // console.error('❌ Error details:', error.response?.data);

        // Handle 401 errors with automatic token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // console.warn('🔄 Authentication failed - attempting token refresh...');
            
            try {
                const refreshResult = await refreshAuthToken();
                
                if (refreshResult.success) {
                    
                    // Update Authorization header with new token
                    originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
                    
                    // Retry the original request with new token
                    return smartClassAPI(originalRequest);
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (refreshError) {
                // console.error('❌ Token refresh failed:', refreshError);
                
                // Clear all auth data if refresh fails
                StorageAdapter.removeItem('token');
                StorageAdapter.removeItem('refreshToken');
                
                // console.warn('⚠️ Authentication tokens cleared due to refresh failure');
                
                // Don't force redirect - let the app handle it gracefully
                return Promise.reject(new Error('Authentication failed. Please log in again.'));
            }
        }

        return Promise.reject(error);
    }
);

export { smartClassAPI };