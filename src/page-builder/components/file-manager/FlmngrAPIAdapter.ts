/**
 * Flmngr API Adapter
 * Bridges Flmngr file manager with our existing media API
 */

import { MediaAPIService } from './services/mediaAPI';

export class FlmngrAPIAdapter {
  /**
   * Handle Flmngr API requests and translate them to our media API
   */
  static async handleRequest(request: any): Promise<any> {

    try {
      switch (request.action) {
        case 'dirList':
          return await this.handleDirectoryList(request);
        
        case 'dirCreate':
          return await this.handleDirectoryCreate(request);
        
        case 'dirDelete':
          return await this.handleDirectoryDelete(request);
        
        case 'fileUpload':
          return await this.handleFileUpload(request);
        
        case 'fileDelete':
          return await this.handleFileDelete(request);
        
        case 'fileRename':
          return await this.handleFileRename(request);
        
        default:
          // console.warn('🚨 Unhandled Flmngr action:', request.action);
          return {
            id: request.id,
            message: "OK",
            data: {}
          };
      }
    } catch (error) {
      // console.error('❌ Flmngr API error:', error);
      return {
        id: request.id,
        message: "ERROR",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * List files and folders
   */
  private static async handleDirectoryList(request: any) {
    try {
      const path = request.path || '';
      const result = await MediaAPIService.getFilesAndFolders(path);
      
      // Convert our API format to Flmngr format
      const flmngrFiles = result.files.map(file => ({
        name: file.name,
        size: file.size,
        type: 'file',
        ext: file.name.split('.').pop()?.toLowerCase() || '',
        url: file.url,
        lastModified: Date.now() // Use current time since we don't have lastModified
      }));

      const flmngrFolders = result.folders.map(folder => ({
        name: folder.name,
        type: 'dir',
        lastModified: Date.now() // Use current time since we don't have lastModified
      }));

      return {
        id: request.id,
        message: "OK",
        data: {
          files: [...flmngrFolders, ...flmngrFiles]
        }
      };
    } catch (error) {
      throw new Error(`Failed to list directory: ${error}`);
    }
  }

  /**
   * Create directory
   */
  private static async handleDirectoryCreate(request: any) {
    try {
      const folderName = request.name;
      const parentPath = request.path || '';
      
      // Use your existing API to create folder
      // You might need to adapt this based on your API structure
      
      return {
        id: request.id,
        message: "OK"
      };
    } catch (error) {
      throw new Error(`Failed to create directory: ${error}`);
    }
  }

  /**
   * Delete directory
   */
  private static async handleDirectoryDelete(request: any) {
    try {
      const folderPath = request.path;
      
      return {
        id: request.id,
        message: "OK"
      };
    } catch (error) {
      throw new Error(`Failed to delete directory: ${error}`);
    }
  }

  /**
   * Upload file
   */
  private static async handleFileUpload(request: any) {
    try {
      // Handle file upload using your existing API
      
      return {
        id: request.id,
        message: "OK"
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Delete file
   */
  private static async handleFileDelete(request: any) {
    try {
      const filePath = request.path;
      
      return {
        id: request.id,
        message: "OK"
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  /**
   * Rename file
   */
  private static async handleFileRename(request: any) {
    try {
      const oldPath = request.pathOld;
      const newPath = request.pathNew;
      
      return {
        id: request.id,
        message: "OK"
      };
    } catch (error) {
      throw new Error(`Failed to rename file: ${error}`);
    }
  }
}
