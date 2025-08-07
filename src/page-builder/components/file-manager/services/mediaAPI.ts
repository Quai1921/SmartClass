import { smartClassAPI } from '../../../../config/smartClassAPI';
import { getApiUrl } from '../config/fileManagerConfig';
import type { StoredFile, Folder } from '../types';

// Updated interface to match actual API response
export interface MediaAPIItem {
  name: string;
  lastModified: string;
  path: string;
  type: string; // "folder" for folders, "file" for files
  size: number;
  url?: string; // Only present for files
  description?: string;
}

// Legacy interfaces (keeping for backwards compatibility if needed)
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

export interface UploadFileRequest {
  bucketPath: string;
  id: number;
  file: File;
}

export interface CreateFolderRequest {
  parentPath?: string;
  folderName: string;
}

export interface DeleteRequest {
  fileKey: string;
}

export interface SearchRequest {
  term: string;
  path?: string;
}

export interface FilterRequest {
  path?: string;
  fileType: string;
}

// Generate a unique ID for file uploads
const generateUniqueFileId = (): number => {
  // Generate a unique ID based on timestamp and random number
  // This ensures each file upload gets a unique identifier
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Media API service for file manager operations
 */
export class MediaAPIService {
  
  /**
   * Helper method to convert API response to expected format (UPDATED FOR CORRECT API FORMAT)
   * Based on the actual API response structure from /api/media/list
   */
  private static convertAPIResponse(items: MediaAPIItem[], currentPath: string = ''): { files: MediaAPIFile[]; folders: MediaAPIFolder[] } {
    // Normalize currentPath (remove leading/trailing slashes)
    const normCurrentPath = currentPath.replace(/^\/+|\/+$/g, '');


    // Process folders and files
    const folderMap = new Map<string, MediaAPIFolder>();
    const filesList: MediaAPIFile[] = [];

    items.forEach((item, index) => {
      // Skip navigation items
      if (item.type === 'navigation') {
        return;
      }
      
      const cleanPath = item.path.replace(/^\/+|\/+$/g, '');
      
      if (item.type === 'folder') {
        // For folders, determine the immediate next level from current path
        let targetFolderPath: string;
        let folderName: string = item.name;
        
        if (normCurrentPath === '') {
          // At root level - take the first segment
          const segments = cleanPath.split('/').filter(Boolean);
          if (segments.length > 0) {
            targetFolderPath = segments[0];
            folderName = folderName || segments[0];

          } else {
            return;
          }
        } else {
          // At non-root level - check if this folder belongs to current path
          if (!cleanPath.startsWith(normCurrentPath)) {
            return;
          }
          
          if (cleanPath === normCurrentPath) {
            return;
          }
          
          // Special handling for paths that end with special characters like /** or just /
          if (cleanPath.endsWith('/**') || cleanPath === normCurrentPath + '/') {
            return;
          }
          
          // Get the next level after current path
          const remainder = cleanPath.slice(normCurrentPath.length + 1);
          const nextSegment = remainder.split('/')[0];
          
          
          if (!nextSegment) {
            return;
          }
          
          targetFolderPath = normCurrentPath + '/' + nextSegment;
          folderName = folderName || nextSegment;
        }
        
        // Only add unique folders (avoid duplicates)
        if (!folderMap.has(targetFolderPath)) {
          const folder: MediaAPIFolder = {
            fileKey: targetFolderPath,
            name: folderName,
            parentPath: normCurrentPath,
            createdAt: item.lastModified || new Date().toISOString(),
          };
          
          folderMap.set(targetFolderPath, folder);
        } else {
        }
        
      } else if (item.type === 'file') {
        // For files, check if they belong directly to current path
        const pathSegments = cleanPath.split('/');
        const fileParentPath = pathSegments.slice(0, -1).join('/');
        
        if (fileParentPath === normCurrentPath) {
          const fileType = this.getFileType(item.name);
          const mimeType = this.getFileMimeType(item.name);
          
          const file: MediaAPIFile = {
            fileKey: item.url || cleanPath, // Use the S3 URL as fileKey for proper preview
            name: item.name,
            url: item.url || '',
            type: fileType,
            size: item.size || 0,
            uploadedAt: item.lastModified || new Date().toISOString(),
            description: item.description || '',
          };
          
          filesList.push(file);
        } else {
        }
      }
    });

    const folders = Array.from(folderMap.values());
    
    if (folders.length > 0) {
      // folders.forEach(f => 
      //   console.log(`   📁 Final folder: "${f.name}" (${f.fileKey})`)
      // );
    } else {
    }

    return { files: filesList, folders };
  }
    
  /**
   * Upload a file to the server
   */
  static async uploadFile(file: File, bucketPath: string = ''): Promise<MediaAPIFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Prepare query parameters (bucketPath and id go as query params, not form data)
    const params: Record<string, string> = {
      bucketPath: bucketPath, // Use the bucketPath as-is (can be empty string, folder name, etc.)
      id: generateUniqueFileId().toString() // Generate unique ID for this file upload
    };


    const response = await smartClassAPI.post(getApiUrl('upload'), formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    
    // The upload API might return different formats, let's handle both cases
    let uploadResult = response.data;
    
    // If the response is just a URL string, convert it to our expected format
    if (typeof uploadResult === 'string') {
      uploadResult = {
        fileKey: `${bucketPath}/${file.name}`.replace(/^\/+/, ''), // Remove leading slashes
        name: file.name,
        url: uploadResult,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    }
    
    return uploadResult;
  }

  /**
   * Get all files and folders from the server
   */
  static async getFilesAndFolders(path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    
    try {
      const params: Record<string, string> = {};
      if (path) {
        params.path = path;
      }


      const response = await smartClassAPI.get(getApiUrl('list'), {
        params: Object.keys(params).length > 0 ? params : undefined
      });
      
      
      // The API returns a flat array of MediaAPIItem[], convert to expected format
      const items: MediaAPIItem[] = response.data;
      const result = this.convertAPIResponse(items, path);
      
      
      return result;
    } catch (error) {
      // console.error('❌ [DEBUG] Failed to fetch files and folders:', error);
      throw new Error('Failed to fetch files and folders from server');
    }
  }

  /**
   * Create a new folder
   */
  static async createFolder(folderName: string, parentPath: string = ''): Promise<MediaAPIFolder> {
    const params: Record<string, string> = { folderName };
    if (parentPath) {
      params.parentPath = parentPath;
    }

    const response = await smartClassAPI.post(getApiUrl('createFolder'), '', {
      params
    });

    return response.data;
  }

  /**
   * Delete a file or folder
   */
  static async deleteFile(fileKey: string): Promise<void> {
    
    // The delete API expects: DELETE /api/media/delete?fileKey=path/to/file.jpg
    // fileKey should be the path, not the full URL
    
    try {
      const deleteUrl = `${getApiUrl('delete')}?fileKey=${encodeURIComponent(fileKey)}`;
      
      const response = await smartClassAPI.delete(deleteUrl);
    } catch (error) {
      // console.error('❌ Delete error:', error);
      throw new Error(`Failed to delete file: ${fileKey}`);
    }
  }

  /**
   * Move file to different folder
   */
  static async moveFile(sourceKey: string, destinationPath: string): Promise<MediaAPIFile> {
    const response = await smartClassAPI.put(getApiUrl('move'), '', {
      params: {
        sourceKey,
        destinationPath
      }
    });
    
    return response.data;
  }

  /**
   * Search files by term
   */
  static async searchFiles(term: string, path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    const params: Record<string, string> = { term };
    if (path) {
      params.path = path;
    }

    const response = await smartClassAPI.get(getApiUrl('search'), {
      params
    });
    
    // Convert API response to expected format
    const items: MediaAPIItem[] = response.data;
    return this.convertAPIResponse(items, path);
  }

  /**
   * Filter files by type
   */
  static async filterFiles(fileType: string, path: string = ''): Promise<{ files: MediaAPIFile[]; folders: MediaAPIFolder[] }> {
    const params: Record<string, string> = { fileType };
    if (path) {
      params.path = path;
    }

    const response = await smartClassAPI.get(getApiUrl('filter'), {
      params
    });
    
    // Convert API response to expected format
    const items: MediaAPIItem[] = response.data;
    return this.convertAPIResponse(items, path);
  }

  /**
   * Extract file type from filename and convert to MIME type for proper preview
   */
  private static getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (!extension) return 'application/octet-stream';
    
    // Map common extensions to MIME types for proper preview
    const mimeTypeMap: Record<string, string> = {
      // Images - return proper MIME types for preview
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'bmp': 'image/bmp',
      'ico': 'image/x-icon',
      'tiff': 'image/tiff',
      'tif': 'image/tiff',
      
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      
      // Spreadsheets
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv',
      
      // Presentations
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'm4a': 'audio/mp4',
      
      // Video
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'webm': 'video/webm',
      'mkv': 'video/x-matroska',
      'wmv': 'video/x-ms-wmv',
      
      // Archives
      'zip': 'application/zip',
      'rar': 'application/vnd.rar',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      
      // Code files
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'html': 'text/html',
      'css': 'text/css',
      'json': 'application/json',
      'xml': 'application/xml',
      
      // Other common types
      'md': 'text/markdown',
      'yaml': 'text/yaml',
      'yml': 'text/yaml',
    };
    
    return mimeTypeMap[extension] || `application/${extension}`;
  }

  /**
   * Get MIME type from filename (alias for getFileType for clarity)
   */
  private static getFileMimeType(filename: string): string {
    return this.getFileType(filename);
  }
}

/**
 * Utility functions to convert between API format and local format
 */
export class MediaAPIConverter {
  
  /**
   * Convert API file to local StoredFile format
   */
  static apiFileToStoredFile(apiFile: MediaAPIFile): StoredFile {
    const pathParts = apiFile.fileKey.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const folderPath = pathParts.slice(0, -1).join('/');
    
    
    return {
      id: apiFile.fileKey, // Use fileKey as ID
      name: fileName,
      url: apiFile.url,
      type: apiFile.type,
      size: apiFile.size,
      uploadedAt: new Date(apiFile.uploadedAt),
      description: apiFile.description,
      folderId: folderPath || undefined, // Use folder path as folderId
    };
  }

  /**
   * Convert API folder to local Folder format
   */
  static apiFolderToFolder(apiFolder: MediaAPIFolder): Folder {
    return {
      id: apiFolder.fileKey, // Use fileKey as ID
      name: apiFolder.name,
      parentId: apiFolder.parentPath || undefined,
      createdAt: new Date(apiFolder.createdAt),
    };
  }

  /**
   * Convert local folder path to API bucket path
   */
  static folderPathToBucketPath(folderId?: string): string {
    return folderId || '';
  }

  /**
   * Convert local folder structure to API parent path
   */
  static folderIdToParentPath(folderId?: string): string {
    return folderId || '';
  }

  /**
   * Generate file key for new file upload
   */
  static generateFileKey(fileName: string, folderPath?: string): string {
    if (folderPath) {
      return `${folderPath}/${fileName}`;
    }
    return fileName;
  }
  
  /**
   * Check if a file is an image based on its URL or filename
   */
  static isImageFile(file: StoredFile): boolean {
    // Check by MIME type if available
    if (file.type && file.type.startsWith('image/')) {
      return true;
    }
    
    // Fallback: check by file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
    return imageExtensions.includes(extension || '');
  }

  /**
   * Get the preview URL for a file (returns the S3 URL for images)
   */
  static getPreviewUrl(file: StoredFile): string {
    return file.url || file.id; // Use URL if available, otherwise fall back to id (which should be the S3 URL)
  }
}
