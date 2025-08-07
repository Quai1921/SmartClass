import { smartClassAPI } from '../../../../config/smartClassAPI';
import { getApiUrl } from '../config/fileManagerConfig';
import type { StoredFile, Folder } from '../types';

// Updated interface to match actual API response
export interface MediaAPIItem {
  name: string;
  lastModified: string;
  path: string;
  type: string; 
  size: number;
  url?: string; 
  description?: string;
}

export interface MediaAPIFile {
  fileKey: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  description?: string;
}

export interface MediaAPIFolder {
  fileKey: string;
  name: string;
  parentPath: string;
  createdAt: string;
}

// Generate a unique ID for file uploads
const generateUniqueFileId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Media API service for file manager operations
 */
export class MediaAPIService {
  
  /**
   * Helper method to convert API response to expected format
   */
  private static convertAPIResponse(items: MediaAPIItem[], currentPath: string = ''): { files: MediaAPIFile[]; folders: MediaAPIFolder[] } {
    const files: MediaAPIFile[] = [];
    const folders: MediaAPIFolder[] = [];
  
    
    // Process items
    items.forEach((item) => {
      if (item.type === 'folder') {
        folders.push({
          fileKey: item.path,
          name: item.name,
          parentPath: currentPath,
          createdAt: item.lastModified || new Date().toISOString()
        });
      } else {
        let fileType = item.type;
        let fileUrl = item.url;
        
        files.push({
          fileKey: item.path,
          name: item.name,
          url: fileUrl || '', 
          type: fileType,
          size: item.size,
          uploadedAt: item.lastModified || new Date().toISOString(),
          description: item.description
        });
      }
    });
    
    
    return { files, folders };
  }

  /**
   * Upload a file to the server
   */
  static async uploadFile(file: File, bucketPath: string = ''): Promise<MediaAPIFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Prepare query parameters
    const params: Record<string, string> = {
      bucketPath: bucketPath,
      id: generateUniqueFileId().toString()
    };

    try {
      const response = await smartClassAPI.post('/api/media/upload', formData, { params });
      return response.data;
    } catch (error) {
      // console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Get files and folders from the server
   */
  static async getFilesAndFolders(path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    try {
      const params: Record<string, string> = {};
      if (path) {
        params.path = path;
      }


      
      const response = await smartClassAPI.get('/api/media/list', { params });
      

      
      // Convert API response to expected format
      return this.convertAPIResponse(response.data, path);
    } catch (error) {
      // console.error('Error getting files and folders:', error);
      return { files: [], folders: [] };
    }
  }

  /**
   * Create a new folder on the server
   */
  static async createFolder(folderName: string, parentPath: string = ''): Promise<MediaAPIFolder> {
    const params: Record<string, string> = { folderName };
    if (parentPath) {
      params.parentPath = parentPath;
    }

    try {
      const response = await smartClassAPI.post('/api/media/folder', null, { params });
      return {
        fileKey: response.data.path,
        name: folderName,
        parentPath,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      // console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * Delete a file or folder from the server
   */
  static async deleteFileOrFolder(fileKey: string): Promise<boolean> {
    try {
      await smartClassAPI.delete('/api/media/delete', {
        params: { fileKey }
      });
      return true;
    } catch (error) {
      // console.error('Error deleting file/folder:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files or folders from the server
   */
  static async deleteMultiple(fileKeys: string[]): Promise<boolean> {
    try {
      await smartClassAPI.post('/api/media/delete-multiple', { fileKeys });
      return true;
    } catch (error) {
      // console.error('Error deleting multiple files/folders:', error);
      throw error;
    }
  }

  /**
   * Search for files and folders
   */
  static async search(term: string, path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    try {
      const params: Record<string, string> = { term };
      if (path) {
        params.path = path;
      }

      const response = await smartClassAPI.get('/api/media/search', { params });
      return this.convertAPIResponse(response.data, path);
    } catch (error) {
      // console.error('Error searching files and folders:', error);
      return { files: [], folders: [] };
    }
  }

  /**
   * Filter files by type
   */
  static async filterByType(fileType: string, path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    try {
      const params: Record<string, string> = { fileType };
      if (path) {
        params.path = path;
      }

      const response = await smartClassAPI.get('/api/media/filter', { params });
      return this.convertAPIResponse(response.data, path);
    } catch (error) {
      // console.error('Error filtering files:', error);
      return { files: [], folders: [] };
    }
  }
}
