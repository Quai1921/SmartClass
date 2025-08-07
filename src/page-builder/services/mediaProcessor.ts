/**
 * Media processing utilities for converting blobs, data URLs, and files to base64
 * Handles images, audio, and video with fallback mechanisms
 */

export interface MediaInfo {
  type: 'image' | 'audio' | 'video';
  isBlob?: boolean;
  isDataUrl?: boolean;
  isUrl?: boolean;
  mimeType?: string;
  size?: number;
  base64?: string;
  originalSrc?: string;
  originalDataUrl?: string;
  url?: string;
  error?: string;
  note?: string;
  placeholder?: boolean;
  troubleshooting?: {
    issue: string;
    solution: string;
    steps: string[];
  };
  fallbackMethod?: string;
}

export class MediaProcessor {
  
  // Main function to extract media information
  static async extractMediaInfo(src: string, type: 'image' | 'audio' | 'video'): Promise<MediaInfo> {
    try {
      // Check if it's a blob URL, data URL, or regular URL
      if (src.startsWith('blob:')) {
        return await MediaProcessor.processBlobUrl(src, type);
      } else if (src.startsWith('data:')) {
        return MediaProcessor.processDataUrl(src, type);
      } else {
        return MediaProcessor.processExternalUrl(src, type);
      }
    } catch (error: any) {
      // console.error(`❌ Error processing ${type} file:`, error);
      return {
        type,
        error: error.message,
        originalSrc: src
      };
    }
  }

  // Process blob URLs with enhanced retry mechanism
  static async processBlobUrl(src: string, type: 'image' | 'audio' | 'video'): Promise<MediaInfo> {
    try {
      // Try enhanced blob conversion with retries
      const base64 = await MediaProcessor.enhancedBlobToBase64(src);
      
      if (base64) {
        // Get blob info for metadata
        const response = await fetch(src);
        const blob = await response.blob();
        
        return {
          type,
          isBlob: true,
          mimeType: blob.type,
          size: blob.size,
          base64
        };
      } else {
        throw new Error('Enhanced blob conversion failed');
      }
    } catch (fetchError: any) {
      // console.warn(`⚠️ Failed to fetch blob URL: ${fetchError.message}`);
      
      // Try fallback method for images: find the img element and use canvas
      if (type === 'image') {
        try {
          const imgElements = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
          const matchingImg = imgElements.find(img => img.src === src);
          
          if (matchingImg && matchingImg.complete) {
            const base64 = await MediaProcessor.imageToBase64ViaCanvas(matchingImg);
            return {
              type,
              isBlob: true,
              fallbackMethod: 'canvas',
              base64
            };
          }
        } catch (canvasError) {
          // console.warn(`⚠️ Canvas fallback also failed: ${canvasError}`);
        }
      }
      
      // Return info about the failed blob URL but don't fail completely
      return {
        type,
        isBlob: true,
        error: `Failed to fetch blob: ${fetchError.message}`,
        originalSrc: src,
        note: 'Blob URL may have expired or been revoked',
        placeholder: true,
        base64: type === 'image' ? 
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' : 
          '',
        troubleshooting: {
          issue: 'Blob URLs expire when the page is refreshed or after some time',
          solution: 'To properly export media files, please:',
          steps: [
            '1. Refresh the page to reload fresh blob URLs',
            '2. Re-add your media files from the file manager',
            '3. Export immediately after adding media',
            '4. Consider using data URLs or external URLs instead of blob URLs'
          ]
        }
      };
    }
  }

  // Process data URLs
  static processDataUrl(src: string, type: 'image' | 'audio' | 'video'): MediaInfo {
    // Already a data URL
    const [header, data] = src.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || `${type}/*`;

    
    return {
      type,
      isDataUrl: true,
      mimeType,
      base64: data,
      originalDataUrl: src
    };
  }

  // Process external URLs
  static processExternalUrl(src: string, type: 'image' | 'audio' | 'video'): MediaInfo {
    // External URL - just save the reference
    return {
      type,
      isUrl: true,
      url: src,
      note: 'External URL - file not embedded'
    };
  }

  // Enhanced blob to base64 with retry mechanism
  static async enhancedBlobToBase64(src: string, retries: number = 3): Promise<string | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const base64 = await MediaProcessor.blobToBase64(blob);
        
        return base64;
      } catch (error) {
        // console.warn(`⚠️ Attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }
      }
    }
    
    // console.error(`❌ All ${retries} attempts failed for blob: ${src}`);
    return null;
  }

  // Alternative extraction methods when blob URLs fail
  static async tryAlternativeImageExtraction(src: string, elementId: string): Promise<string | null> {
    try {
      // Method 1: Find the DOM element and use canvas
      const imgElements = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
      const matchingImg = imgElements.find(img => img.src === src || img.getAttribute('data-element-id') === elementId);
      
      if (matchingImg && matchingImg.complete && matchingImg.naturalWidth > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = matchingImg.naturalWidth;
        canvas.height = matchingImg.naturalHeight;
        
        // Enable CORS for cross-origin images
        ctx.drawImage(matchingImg, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];
        
        return base64;
      }
      
      // Method 2: Try to recreate the blob from file input if available
      const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
      for (const input of fileInputs) {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          if (URL.createObjectURL(file) === src) {
            const base64 = await MediaProcessor.fileToBase64(file);
            return base64;
          }
        }
      }
      return null;
    } catch (error) {
      // console.error(`❌ Alternative image extraction failed:`, error);
      return null;
    }
  }

  static async tryAlternativeMediaExtraction(src: string, type: 'audio' | 'video'): Promise<string | null> {
    try {
      // Method 1: Find DOM element by src
      const mediaElements = Array.from(document.querySelectorAll(type)) as HTMLMediaElement[];
      const matchingElement = mediaElements.find(element => element.src === src);
      
      if (matchingElement) {
        // For media elements, we can try to get the blob again
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          const base64 = await MediaProcessor.blobToBase64(blob);
          return base64;
        } catch (fetchError) {
        }
      }
      
      // Method 2: Check file inputs
      const fileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
      for (const input of fileInputs) {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          if (URL.createObjectURL(file) === src) {
            const base64 = await MediaProcessor.fileToBase64(file);
            return base64;
          }
        }
      }
      
      return null;
    } catch (error) {
      // console.error(`❌ Alternative ${type} extraction failed:`, error);
      return null;
    }
  }

  // Helper function to convert File to base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Helper function to convert image to base64 via canvas (fallback method)
  static imageToBase64ViaCanvas(imgElement: HTMLImageElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = imgElement.naturalWidth || imgElement.width;
        canvas.height = imgElement.naturalHeight || imgElement.height;
        
        ctx.drawImage(imgElement, 0, 0);
        const base64 = canvas.toDataURL().split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Helper function to convert blob to base64
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
