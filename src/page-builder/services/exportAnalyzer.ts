import type { FileExportData } from './fileSourceDetector';

/**
 * Export statistics and analysis utilities
 * Provides insights into export data composition and file handling
 */

export interface ExportStats {
  serverReferences: number;
  base64Embedded: number;
  referenceOnly: number;
  totalSize: number;
  bucketPaths: string[];
  errors: number;
}

export interface ExportSummary {
  elements: number;
  mediaFiles: number;
  images: number;
  audio: number;
  videos: number;
  stats: ExportStats;
}

export class ExportAnalyzer {
  
  // Analyze export data to provide statistics
  static analyzeExportData(mediaFiles: { [key: string]: any }): ExportStats {
    const stats: ExportStats = {
      serverReferences: 0,
      base64Embedded: 0,
      referenceOnly: 0,
      totalSize: 0,
      bucketPaths: [],
      errors: 0
    };

    Object.values(mediaFiles).forEach((exportData: any) => {
      switch (exportData.type) {
        case 'server-reference':
          stats.serverReferences++;
          if (exportData.bucketPath) {
            stats.bucketPaths.push(exportData.bucketPath);
          }
          if (exportData.metadata?.size) {
            stats.totalSize += exportData.metadata.size;
          }
          break;
        case 'base64-embedded':
          stats.base64Embedded++;
          if (exportData.base64) {
            stats.totalSize += (exportData.base64.length * 3) / 4; // Approximate original size
          }
          break;
        case 'reference-only':
          stats.referenceOnly++;
          if (exportData.error) {
            stats.errors++;
          }
          break;
      }
    });

    return stats;
  }

  // Get comprehensive export summary
  static getExportSummary(projectData: any): ExportSummary {
    const mediaFiles = projectData.mediaFiles || {};
    const elements = projectData.elements || [];
    
    // Count different types of media
    const mediaCounts = {
      images: Object.keys(mediaFiles).filter(k => k.includes('image')).length,
      audio: Object.keys(mediaFiles).filter(k => k.includes('audio')).length,
      videos: Object.keys(mediaFiles).filter(k => k.includes('video')).length
    };

    const stats = ExportAnalyzer.analyzeExportData(mediaFiles);

    return {
      elements: elements.length,
      mediaFiles: Object.keys(mediaFiles).length,
      images: mediaCounts.images,
      audio: mediaCounts.audio,
      videos: mediaCounts.videos,
      stats
    };
  }

  // Log detailed export analysis
  static logExportAnalysis(projectData: any): void {
    const summary = ExportAnalyzer.getExportSummary(projectData);

    // Show warnings based on analysis
    if (summary.mediaFiles === 0 && summary.elements > 0) {
      // console.warn('⚠️ No media files were processed! This might be because:');
      // console.warn('1. Elements don\'t contain media properties (src, backgroundImage, etc.)');
      // console.warn('2. Media URLs are invalid or inaccessible');
      // console.warn('3. File manager integration is not properly configured');
      // console.warn('💡 Tip: Use file manager for server-hosted files or upload fresh media');
    }

    if (summary.stats.errors > 0) {
      // console.warn(`⚠️ ${summary.stats.errors} media files had errors during processing`);
    }

    if (summary.stats.referenceOnly > 0) {
      // console.warn(`⚠️ ${summary.stats.referenceOnly} files are reference-only (may not be accessible on other systems)`);
    }

    // Log success metrics
    if (summary.stats.serverReferences > 0) {
    }

    if (summary.stats.base64Embedded > 0) {
    }

    const totalSizeMB = (summary.stats.totalSize / (1024 * 1024)).toFixed(2);
  }

  // Generate user-friendly export notification
  static generateExportNotification(projectData: any): string {
    const summary = ExportAnalyzer.getExportSummary(projectData);
    
    if (summary.mediaFiles > 0) {
      const serverRefs = summary.stats.serverReferences;
      const embedded = summary.stats.base64Embedded;
      const errors = summary.stats.errors;
      
      let message = `✅ Proyecto exportado exitosamente!\n\n📊 Resumen:\n• ${summary.elements} elementos\n• ${summary.mediaFiles} archivos multimedia`;
      
      if (serverRefs > 0) {
        message += `\n• ${serverRefs} referencias de servidor`;
      }
      
      if (embedded > 0) {
        message += `\n• ${embedded} archivos embebidos`;
      }
      
      if (errors > 0) {
        message += `\n• ⚠️ ${errors} archivos con errores`;
      }
      
      const sizeMB = (summary.stats.totalSize / (1024 * 1024)).toFixed(1);
      if (summary.stats.totalSize > 0) {
        message += `\n• Tamaño total: ${sizeMB} MB`;
      }
      
      message += '\n\nEl archivo incluye todos los archivos multimedia procesados.';
      
      return message;
    } else {
      return `✅ Proyecto exportado exitosamente!\n\n📊 Resumen:\n• ${summary.elements} elementos\n• Sin archivos multimedia`;
    }
  }

  // Validate export data integrity
  static validateExportData(projectData: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (!projectData) {
      errors.push('Project data is null or undefined');
      return { isValid: false, errors, warnings };
    }

    if (!projectData.elements || !Array.isArray(projectData.elements)) {
      errors.push('Project data missing or invalid elements array');
    }

    if (!projectData.exportMetadata) {
      warnings.push('Export metadata is missing');
    }

    // Media files validation
    const mediaFiles = projectData.mediaFiles || {};
    const summary = ExportAnalyzer.getExportSummary(projectData);

    if (summary.stats.errors > 0) {
      warnings.push(`${summary.stats.errors} media files had processing errors`);
    }

    if (summary.stats.referenceOnly > 0) {
      warnings.push(`${summary.stats.referenceOnly} files are reference-only and may not be portable`);
    }

    // Size warnings
    if (summary.stats.totalSize > 50 * 1024 * 1024) { // 50MB
      warnings.push(`Export size is large (${(summary.stats.totalSize / (1024 * 1024)).toFixed(1)} MB)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
