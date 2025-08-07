import { fileManagerState } from '../services/fileManagerState';

/**
 * File source detection utilities for export functionality
 * Determines whether files come from server, file manager, or local sources
 */

export interface FileExportData {
  type: 'server-reference' | 'base64-embedded' | 'reference-only';
  bucketPath?: string;
  serverUrl?: string;
  originalSrc: string;
  fileType?: 'image' | 'audio' | 'video' | 'document';
  metadata?: {
    filename: string;
    mimeType: string;
    size: number;
    lastModified: string;
  };
  base64?: string;
  mimeType?: string;
  size?: number;
  reason?: string;
  error?: string;
  note?: string;
  source?: string;
}

export class FileSourceDetector {
  
  // Check if a URL is from the server/bucket
  static isServerFile(src: string): boolean {
    const serverPatterns = [
      /^https?:\/\/.*\/api\/files\//,           // API file endpoint
      /^https?:\/\/.*\/uploads\//,              // Direct uploads path
      /^https?:\/\/.*\.s3\..*\.amazonaws\.com/, // AWS S3
      /^https?:\/\/.*\.googleapis\.com/,        // Google Cloud Storage
      /^https?:\/\/.*\.blob\.core\.windows\.net/, // Azure Blob Storage
    ];
    
    return serverPatterns.some(pattern => pattern.test(src));
  }

  // Get file manager data for a file
  static async getFileManagerData(src: string, elementId: string): Promise<FileExportData | null> {
    try {
      // Check the file manager state service
      const fileData = fileManagerState.getFileData(src) || fileManagerState.getFileData(elementId);
      
      if (fileData && fileData.bucketPath) {
        return {
          type: 'server-reference',
          bucketPath: fileData.bucketPath,
          serverUrl: fileData.serverUrl || FileSourceDetector.getDefaultServerUrl(),
          originalSrc: src,
          fileType: fileData.type,
          metadata: {
            filename: fileData.filename,
            mimeType: fileData.mimeType,
            size: fileData.size,
            lastModified: fileData.lastModified
          },
          source: 'file-manager'
        };
      }
      
      // Fallback to legacy window state
      const legacyFileManagerState = (window as any).__fileManagerState__ || {};
      const legacyFileData = legacyFileManagerState[src] || legacyFileManagerState[elementId];
      
      if (legacyFileData && legacyFileData.bucketPath) {
        return {
          type: 'server-reference',
          bucketPath: legacyFileData.bucketPath,
          serverUrl: legacyFileData.serverUrl || FileSourceDetector.getDefaultServerUrl(),
          originalSrc: src,
          fileType: legacyFileData.type,
          metadata: {
            filename: legacyFileData.filename,
            mimeType: legacyFileData.mimeType,
            size: legacyFileData.size,
            lastModified: legacyFileData.lastModified || new Date().toISOString()
          },
          source: 'file-manager-legacy'
        };
      }
      
      return null;
    } catch (error) {
      // console.error('Error getting file manager data:', error);
      return null;
    }
  }

  // Extract server file data
  static async getServerFileData(src: string, type: 'image' | 'audio' | 'video'): Promise<FileExportData> {
    try {
      // Extract bucket path from URL
      const bucketPath = FileSourceDetector.extractBucketPath(src);
      
      // Get file metadata if available
      const metadata = await FileSourceDetector.getFileMetadata(src);
      
      return {
        type: 'server-reference',
        bucketPath,
        serverUrl: FileSourceDetector.getServerBaseUrl(src),
        originalSrc: src,
        fileType: type,
        metadata: {
          filename: FileSourceDetector.extractFilename(src),
          mimeType: metadata?.mimeType || `${type}/*`,
          size: metadata?.size || 0,
          lastModified: metadata?.lastModified || new Date().toISOString()
        }
      };
    } catch (error) {
      // console.error('Error extracting server file data:', error);
      return {
        type: 'reference-only',
        originalSrc: src,
        error: 'Failed to extract server file data'
      };
    }
  }

  // Helper functions for server file handling
  static extractBucketPath(url: string): string {
    try {
      const urlObj = new URL(url);
      // Extract path after /api/files/ or /uploads/
      const pathMatch = urlObj.pathname.match(/\/(api\/files|uploads)\/(.+)$/);
      return pathMatch ? `/${pathMatch[2]}` : urlObj.pathname;
    } catch {
      return url;
    }
  }

  static extractFilename(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || 'unknown';
    } catch {
      return url.split('/').pop() || 'unknown';
    }
  }

  static getServerBaseUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch {
      return '';
    }
  }

  static getDefaultServerUrl(): string {
    return window.location.origin;
  }

  static async getFileMetadata(url: string) {
    try {
      // Try to get metadata via HEAD request
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return {
          mimeType: response.headers.get('content-type'),
          size: parseInt(response.headers.get('content-length') || '0'),
          lastModified: response.headers.get('last-modified')
        };
      }
    } catch (error) {
      // console.warn('Could not fetch file metadata:', error);
    }
    return null;
  }
}
