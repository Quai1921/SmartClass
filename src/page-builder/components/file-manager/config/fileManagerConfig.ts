/**
 * File Manager Configuration
 * Server-based file management configuration
 */

export interface FileManagerConfig {
  // Use server-based file management (always true)
  useServerMode: boolean;
  
  // Fallback to localStorage (deprecated - always false)
  enableFallback: boolean;
  
  // API endpoints configuration
  api: {
    baseUrl: string;
    endpoints: {
      upload: string;
      createFolder: string;
      delete: string;
      list: string;
      move: string;
      search: string;
      filter: string;
      health: string;
      download: string; // New endpoint for getting file URLs
    };
  };
  
  // Feature flags
  features: {
    dragAndDrop: boolean;
    bulkOperations: boolean;
    fileVersioning: boolean;
    realTimeSync: boolean;
  };
  
  // UI Configuration
  ui: {
    showMigrationStatus: boolean;
    enableDebugMode: boolean;
  };
}

export const fileManagerConfig: FileManagerConfig = {
  // Server mode only - no localStorage fallback
  useServerMode: true,
  
  // Disable fallback to localStorage - always use server
  enableFallback: false,
  
  api: {
    baseUrl: '/media',
    endpoints: {
      upload: '/upload',
      createFolder: '/folder',
      delete: '/delete',
      list: '/list',
      move: '/move',
      search: '/search',
      filter: '/filter',
      health: '/health',
      download: '/download', // New endpoint for getting file URLs
    },
  },
  
  features: {
    dragAndDrop: true,
    bulkOperations: false, // TODO: Implement
    fileVersioning: false, // TODO: Implement
    realTimeSync: false,   // TODO: Implement
  },
  
  ui: {
    showMigrationStatus: import.meta.env.DEV,
    enableDebugMode: import.meta.env.DEV,
  },
};

/**
 * Get the full API URL for an endpoint
 */
export const getApiUrl = (endpoint: keyof FileManagerConfig['api']['endpoints']): string => {
  return `${fileManagerConfig.api.baseUrl}${fileManagerConfig.api.endpoints[endpoint]}`;
};
