import { FileSourceDetector, type FileExportData } from './fileSourceDetector';
import { MediaProcessor } from './mediaProcessor';
import { DOMAnalyzer } from './domAnalyzer';
import { ExportAnalyzer } from './exportAnalyzer';
import { fileManagerState } from './fileManagerState';

/**
 * Core export orchestrator that coordinates all export functionality
 * Handles the main export workflow while delegating to specialized services
 */

export class ExportOrchestrator {
  
  // Main function to determine file source and get appropriate export data
  static async getFileExportData(src: string, type: 'image' | 'audio' | 'video', elementId: string): Promise<FileExportData> {
    
    // Check if this is a server/bucket file by examining the URL structure
    if (FileSourceDetector.isServerFile(src)) {
      return await FileSourceDetector.getServerFileData(src, type);
    }
    
    // Check if we can find file manager metadata for this file
    const fileManagerData = await FileSourceDetector.getFileManagerData(src, elementId);
    if (fileManagerData) {
      return fileManagerData;
    }
    
    // Fallback to base64 embedding for local/blob files
    const mediaInfo = await MediaProcessor.extractMediaInfo(src, type);
    
    if (mediaInfo.base64) {
      return {
        type: 'base64-embedded',
        base64: mediaInfo.base64,
        mimeType: mediaInfo.mimeType,
        size: mediaInfo.size,
        reason: 'local-upload-or-blob',
        originalSrc: src
      };
    }
    
    // Last resort - try alternative extraction methods
    const alternativeBase64 = type === 'image' 
      ? await MediaProcessor.tryAlternativeImageExtraction(src, elementId)
      : await MediaProcessor.tryAlternativeMediaExtraction(src, type);
      
    if (alternativeBase64) {
      return {
        type: 'base64-embedded',
        base64: alternativeBase64,
        reason: 'alternative-extraction',
        originalSrc: src
      };
    }
    
    // Complete fallback
    return {
      type: 'reference-only',
      originalSrc: src,
      error: 'Could not extract or reference file',
      note: 'File may need to be re-uploaded or selected from file manager'
    };
  }

  // Function to process media files in the project - Simplified Version
  static async processMediaFiles(projectData: any): Promise<any> {
    const processedElements: any[] = [];


    for (const element of projectData.elements || []) {
      const processedElement = { ...element };
      
      // Add container ID in the required format: id:container-id
      if (element.type === 'container' || element.parentId) {
        processedElement.containerId = `id:${element.id}`;
      }
      
      
      // For image elements, keep the original src
      if (element.type === 'image' && element.properties?.src) {
        processedElement.properties = {
          ...processedElement.properties,
          src: element.properties.src // Keep original URL
        };
      }
      
      // For background images, extract URL and keep it simple
      if (element.properties?.backgroundImage) {
        
        // Extract URL from backgroundImage (remove 'url(' and ')')
        let backgroundUrl = element.properties.backgroundImage;
        if (backgroundUrl.startsWith('url(')) {
          backgroundUrl = backgroundUrl.slice(4, -1); // Remove 'url(' and ')'
          backgroundUrl = backgroundUrl.replace(/['"]/g, ''); // Remove quotes
        }
        
        processedElement.properties = {
          ...processedElement.properties,
          backgroundImageUrl: backgroundUrl, // Add clean URL
          backgroundImage: element.properties.backgroundImage, // Keep original format too
          backgroundSize: element.properties.backgroundSize || 'cover',
          backgroundPosition: element.properties.backgroundPosition || 'center',
          backgroundRepeat: element.properties.backgroundRepeat || 'no-repeat'
        };
        
        // Add container ID for elements with background images
        processedElement.containerId = `id:${element.id}`;
      }
      
      // For audio and video elements, keep original URLs
      if (element.type === 'audio' && element.properties?.src) {
        processedElement.properties = {
          ...processedElement.properties,
          src: element.properties.src // Keep original URL
        };
      }
      
      if (element.type === 'video' && element.properties?.src) {
        processedElement.properties = {
          ...processedElement.properties,
          src: element.properties.src // Keep original URL
        };
      }
      
      processedElements.push(processedElement);
    }

    
    return {
      ...projectData,
      elements: processedElements,
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        version: '3.0.0-simplified',
        elementCount: processedElements.length,
        hasBackgroundImages: processedElements.some(el => el.properties?.backgroundImageUrl),
        backgroundImageCount: processedElements.filter(el => el.properties?.backgroundImageUrl).length,
        containerCount: processedElements.filter(el => el.containerId).length
      }
    };
  }

  // Prepare export with simplified processing - no complex media analysis
  static async prepareExport(projectData: any): Promise<any> {
    
    // Simplified export with direct URL processing
    const enhancedProject = await ExportOrchestrator.processMediaFiles(projectData);
    
    return enhancedProject;
  }

  // Generate export success summary for console and user - Simplified Version
  static logExportSuccess(exportPreviewData: any): void {
    const elementCount = exportPreviewData.elements?.length || 0;
    const backgroundImageCount = exportPreviewData.exportMetadata?.backgroundImageCount || 0;
    const containerCount = exportPreviewData.exportMetadata?.containerCount || 0;
    
    // Log simplified project structure for debugging
  }

  // Generate user notification message - Simplified Version
  static generateUserNotification(exportPreviewData: any): string {
    const elementCount = exportPreviewData.elements?.length || 0;
    const backgroundImageCount = exportPreviewData.exportMetadata?.backgroundImageCount || 0;
    const containerCount = exportPreviewData.exportMetadata?.containerCount || 0;
    
    let message = `¡Exportación completada exitosamente! 🎉\n\n`;
    message += `📊 Resumen:\n`;
    message += `• ${elementCount} elementos procesados\n`;
    message += `• ${backgroundImageCount} imágenes de fondo encontradas\n`;
    message += `• ${containerCount} contenedores con IDs\n\n`;
    message += `Las URLs de imágenes de fondo se han mantenido tal como están y los contenedores incluyen IDs en formato "id:-container-id-".\n\n`;
    message += `El archivo JSON está listo para usar. 🚀`;
    
    return message;
  }

  // Validate export before processing
  static validateExport(projectData: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    return ExportAnalyzer.validateExportData(projectData);
  }
}
