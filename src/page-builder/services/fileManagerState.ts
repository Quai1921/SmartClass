/**
 * Global file manager state for tracking server files
 * This helps the export system identify which files came from the server/bucket
 */

interface FileManagerData {
  bucketPath: string;
  serverUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  lastModified: string;
  type: 'image' | 'audio' | 'video' | 'document';
  originalUrl?: string;
}

interface FileManagerState {
  [key: string]: FileManagerData; // key can be blob URL or element ID
}

class FileManagerStateService {
  private static instance: FileManagerStateService;
  private state: FileManagerState = {};

  static getInstance(): FileManagerStateService {
    if (!FileManagerStateService.instance) {
      FileManagerStateService.instance = new FileManagerStateService();
    }
    return FileManagerStateService.instance;
  }

  // Register a file from the server file manager
  registerServerFile(blobUrl: string, elementId: string, fileData: FileManagerData): void {
    
    // Store by both blob URL and element ID for flexibility
    this.state[blobUrl] = fileData;
    this.state[elementId] = fileData;
    
    // Also expose on window for legacy compatibility
    if (!window.__fileManagerState__) {
      window.__fileManagerState__ = {};
    }
    window.__fileManagerState__[blobUrl] = fileData;
    window.__fileManagerState__[elementId] = fileData;
  }

  // Get file data by blob URL or element ID
  getFileData(identifier: string): FileManagerData | null {
    return this.state[identifier] || null;
  }

  // Remove file data
  removeFileData(identifier: string): void {
    delete this.state[identifier];
    if (window.__fileManagerState__) {
      delete window.__fileManagerState__[identifier];
    }
  }

  // Get all registered files
  getAllFiles(): FileManagerState {
    return { ...this.state };
  }

  // Clear all state
  clearAll(): void {
    this.state = {};
    if (window.__fileManagerState__) {
      window.__fileManagerState__ = {};
    }
  }

  // Debug function
  debugState(): void {
  }
}

// Export singleton instance
export const fileManagerState = FileManagerStateService.getInstance();

// Type declarations for window
declare global {
  interface Window {
    __fileManagerState__?: FileManagerState;
  }
}

export type { FileManagerData, FileManagerState };
