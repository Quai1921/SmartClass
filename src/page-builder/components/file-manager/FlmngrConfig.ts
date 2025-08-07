import { MediaAPIService } from './services/mediaAPI';

/**
 * Flmngr Configuration for SmartClass API Integration
 */

export interface FlmngrConfig {
  apiKey: string;
  urlFileManager: string;
  urlFiles: string;
  theme?: 'light' | 'dark';
  language?: string;
}

/**
 * Flmngr API Handler - Routes Flmngr requests to our SmartClass API
 */
export class FlmngrHandler {
  
  /**
   * Handle all Flmngr API requests and route them to our MediaAPI
   */
  static async handleRequest(request: any): Promise<any> {
    
    try {
      const { action, files, dirs } = request;
      
      switch (action) {
        case 'dirList':
          return await this.handleDirectoryList(request);
          
        case 'dirCreate':
          return await this.handleDirectoryCreate(request);
          
        case 'dirDelete':
          return await this.handleDirectoryDelete(request);
          
        case 'dirRename':
          return await this.handleDirectoryRename(request);
          
        case 'fileUpload':
          return await this.handleFileUpload(request);
          
        case 'fileDelete':
          return await this.handleFileDelete(request);
          
        case 'fileRename':
          return await this.handleFileRename(request);
          
        case 'fileMove':
          return await this.handleFileMove(request);
          
        default:
          // console.warn('⚠️ Unknown Flmngr action:', action);
          return this.createSuccessResponse([]);
      }
    } catch (error) {
      // console.error('❌ Flmngr API error:', error);
      return this.createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * List directory contents
   */
  private static async handleDirectoryList(request: any): Promise<any> {
    const path = request.path || '';
    
    const result = await MediaAPIService.getFilesAndFolders(path);
    
    // Convert our API format to Flmngr format
    const flmngrItems = [
      // Add folders
      ...result.folders.map(folder => ({
        p: folder.fileKey, // path
        s: -1, // size (-1 for folders)
        t: Math.floor(new Date(folder.createdAt).getTime() / 1000), // timestamp
        w: 0, // width (0 for folders)
        h: 0, // height (0 for folders)
      })),
      // Add files
      ...result.files.map(file => ({
        p: file.fileKey, // path
        s: file.size, // size
        t: Math.floor(new Date(file.uploadedAt).getTime() / 1000), // timestamp
        w: this.getImageWidth(file), // width (for images)
        h: this.getImageHeight(file), // height (for images)
      }))
    ];
    
    return this.createSuccessResponse(flmngrItems);
  }

  /**
   * Create directory
   */
  private static async handleDirectoryCreate(request: any): Promise<any> {
    const { path, name } = request;
    
    const result = await MediaAPIService.createFolder(name, path || '');
    return this.createSuccessResponse([]);
  }

  /**
   * Delete directory
   */
  private static async handleDirectoryDelete(request: any): Promise<any> {
    const { dirs } = request;
    
    for (const dir of dirs || []) {
      await MediaAPIService.deleteFile(dir);
    }
    
    return this.createSuccessResponse([]);
  }

  /**
   * Rename directory
   */
  private static async handleDirectoryRename(request: any): Promise<any> {
    const { dirs } = request;
    
    // For now, we'll implement this as a move operation
    // You might need to add a rename endpoint to your API
    
    return this.createSuccessResponse([]);
  }

  /**
   * Upload files
   */
  private static async handleFileUpload(request: any): Promise<any> {
    const { path, files } = request;
    
    const uploadedFiles: any[] = [];
    
    for (const file of files || []) {
      try {
        const result = await MediaAPIService.uploadFile(file, path || '');
        uploadedFiles.push({
          p: result.fileKey, // path
          s: result.size, // size
          t: Math.floor(new Date(result.uploadedAt).getTime() / 1000), // timestamp
          w: this.getImageWidth(result), // width
          h: this.getImageHeight(result), // height
        });
      } catch (error) {
        // console.error('❌ Failed to upload file:', file.name, error);
      }
    }
    
    return this.createSuccessResponse(uploadedFiles);
  }

  /**
   * Delete files
   */
  private static async handleFileDelete(request: any): Promise<any> {
    const { files } = request;
    
    for (const fileKey of files || []) {
      await MediaAPIService.deleteFile(fileKey);
    }
    
    return this.createSuccessResponse([]);
  }

  /**
   * Rename files
   */
  private static async handleFileRename(request: any): Promise<any> {
    const { files } = request;
    
    // Implement file rename logic using your API
    // This might require adding a rename endpoint to your MediaAPIService
    
    return this.createSuccessResponse([]);
  }

  /**
   * Move files
   */
  private static async handleFileMove(request: any): Promise<any> {
    const { files, dirTo } = request;
    
    for (const fileKey of files || []) {
      await MediaAPIService.moveFile(fileKey, dirTo);
    }
    
    return this.createSuccessResponse([]);
  }

  /**
   * Get image width (placeholder - you might want to enhance this)
   */
  private static getImageWidth(file: any): number {
    // For now, return 0. You could enhance this to get actual image dimensions
    return 0;
  }

  /**
   * Get image height (placeholder - you might want to enhance this)
   */
  private static getImageHeight(file: any): number {
    // For now, return 0. You could enhance this to get actual image dimensions
    return 0;
  }

  /**
   * Create success response in Flmngr format
   */
  private static createSuccessResponse(data: any[]): any {
    return {
      files: data,
      error: null
    };
  }

  /**
   * Create error response in Flmngr format
   */
  private static createErrorResponse(message: string): any {
    return {
      files: [],
      error: message
    };
  }
}

/**
 * Default Flmngr configuration for SmartClass
 */
export const defaultFlmngrConfig: FlmngrConfig = {
  apiKey: 'FLMN24RR1234123412341234',
  urlFileManager: '/api/flmngr', // This will be handled by our handler
  urlFiles: '/api/files', // Base URL for serving files
  theme: 'dark',
  language: 'es', // Spanish
};
