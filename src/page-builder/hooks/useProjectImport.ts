import { fileManagerState } from '../services/fileManagerState';

/**
 * Import function for handling enhanced export format
 * Supports both server references and base64 embedded files
 */
export const useProjectImport = () => {
  
  // Main import function
  const importProject = async (projectData: any) => {
    
    try {
      // Validate project data
      if (!projectData || !projectData.elements) {
        throw new Error('Invalid project data: missing elements');
      }
      
      // Process media files and restore URLs
      const restoredElements = await restoreMediaFiles(projectData.elements, projectData.mediaFiles || {});
      
      // Update elements with restored URLs
      const processedProject = {
        ...projectData,
        elements: restoredElements
      };
      
      return processedProject;
      
    } catch (error) {
      // console.error('❌ Project import failed:', error);
      throw error;
    }
  };

  // Restore media files from export data
  const restoreMediaFiles = async (elements: any[], mediaFiles: { [key: string]: any }) => {
    const restoredElements: any[] = [];
    
    for (const element of elements) {
      const restoredElement = { ...element };
      
      // Restore main media sources
      if (element.type === 'image' && element.properties?.originalSrc) {
        const mediaKey = `image_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, element.type);
          restoredElement.properties = {
            ...restoredElement.properties,
            src: restoredUrl
          };
        }
      }
      
      if (element.type === 'audio' && element.properties?.originalSrc) {
        const mediaKey = `audio_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, element.type);
          restoredElement.properties = {
            ...restoredElement.properties,
            src: restoredUrl
          };
        }
      }
      
      if (element.type === 'video' && element.properties?.originalSrc) {
        const mediaKey = `video_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, element.type);
          restoredElement.properties = {
            ...restoredElement.properties,
            src: restoredUrl
          };
        }
      }
      
      // Restore background media
      if (element.properties?.originalBackgroundImage) {
        const mediaKey = `bg_image_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, 'image');
          restoredElement.properties = {
            ...restoredElement.properties,
            backgroundImage: restoredUrl
          };
        }
      }
      
      if (element.properties?.originalBackgroundVideo) {
        const mediaKey = `bg_video_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, 'video');
          restoredElement.properties = {
            ...restoredElement.properties,
            backgroundVideo: restoredUrl
          };
        }
      }
      
      if (element.properties?.originalBackgroundAudio) {
        const mediaKey = `bg_audio_${element.id}`;
        const exportData = mediaFiles[mediaKey];
        
        if (exportData) {
          const restoredUrl = await restoreMediaUrl(exportData, 'audio');
          restoredElement.properties = {
            ...restoredElement.properties,
            backgroundAudio: restoredUrl
          };
        }
      }
      
      restoredElements.push(restoredElement);
    }
    
    return restoredElements;
  };

  // Restore a single media URL from export data
  const restoreMediaUrl = async (exportData: any, mediaType: string): Promise<string> => {
    try {
      switch (exportData.type) {
        case 'server-reference':
          return await restoreServerReference(exportData);
          
        case 'base64-embedded':
          return await restoreBase64Data(exportData, mediaType);
          
        case 'reference-only':
          // console.warn('⚠️ Reference-only media, using original URL:', exportData.originalSrc);
          return exportData.originalSrc || '';
          
        default:
          // Legacy format - assume it's base64
          if (typeof exportData === 'string') {
            return `data:${mediaType}/*;base64,${exportData}`;
          }
          
          // console.warn('⚠️ Unknown export data format:', exportData);
          return exportData.originalSrc || '';
      }
    } catch (error) {
      // console.error('❌ Failed to restore media URL:', error);
      return exportData.originalSrc || '';
    }
  };

  // Restore server reference to working URL
  const restoreServerReference = async (exportData: any): Promise<string> => {
    try {
      const { bucketPath, serverUrl, metadata } = exportData;
      
      // Construct the server URL
      const fullUrl = `${serverUrl}/api/files${bucketPath}`;
      
      // Verify the file is accessible
      try {
        const response = await fetch(fullUrl, { method: 'HEAD' });
        if (response.ok) {
          // Register with file manager state for future exports
          fileManagerState.registerServerFile(fullUrl, `restored_${Date.now()}`, {
            bucketPath,
            serverUrl,
            filename: metadata.filename,
            mimeType: metadata.mimeType,
            size: metadata.size,
            lastModified: metadata.lastModified,
            type: exportData.fileType
          });
          
          return fullUrl;
        } else {
          // console.warn(`⚠️ Server file not accessible: ${response.status} ${response.statusText}`);
          // Try alternative URL formats or fallback to base64 if available
          return await tryAlternativeServerUrl(exportData);
        }
      } catch (networkError) {
        // console.warn('⚠️ Network error accessing server file:', networkError);
        return await tryAlternativeServerUrl(exportData);
      }
    } catch (error) {
      // console.error('❌ Failed to restore server reference:', error);
      throw error;
    }
  };

  // Try alternative server URL formats
  const tryAlternativeServerUrl = async (exportData: any): Promise<string> => {
    const { bucketPath, serverUrl } = exportData;
    
    // Try different URL patterns
    const alternatives = [
      `${serverUrl}/uploads${bucketPath}`,
      `${serverUrl}/files${bucketPath}`,
      `${serverUrl}${bucketPath}`,
      `${window.location.origin}/api/files${bucketPath}`,
      `${window.location.origin}/uploads${bucketPath}`
    ];
    
    for (const altUrl of alternatives) {
      try {
        const response = await fetch(altUrl, { method: 'HEAD' });
        if (response.ok) {
          return altUrl;
        }
      } catch {
        // Continue to next alternative
      }
    }
    
    // console.warn('⚠️ No working server URLs found, file may be missing');
    return `${serverUrl}/api/files${bucketPath}`; // Return original even if not working
  };

  // Restore base64 data to blob URL
  const restoreBase64Data = async (exportData: any, mediaType: string): Promise<string> => {
    try {
      const { base64, mimeType } = exportData;
      
      if (!base64) {
        throw new Error('No base64 data available');
      }
      
      // Convert base64 to blob
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { 
        type: mimeType || `${mediaType}/*` 
      });
      
      const blobUrl = URL.createObjectURL(blob);
      
      return blobUrl;
      
    } catch (error) {
      // console.error('❌ Failed to restore base64 data:', error);
      // Fallback to data URL
      const { base64, mimeType } = exportData;
      if (base64) {
        return `data:${mimeType || `${mediaType}/*`};base64,${base64}`;
      }
      throw error;
    }
  };

  // Utility function to get project statistics after import
  const getImportStatistics = (projectData: any) => {
    const mediaFiles = projectData.mediaFiles || {};
    const stats = {
      totalElements: projectData.elements?.length || 0,
      totalMediaFiles: Object.keys(mediaFiles).length,
      serverReferences: 0,
      base64Embedded: 0,
      referenceOnly: 0,
      importVersion: projectData.exportMetadata?.version || 'unknown'
    };

    Object.values(mediaFiles).forEach((exportData: any) => {
      if (typeof exportData === 'object') {
        switch (exportData.type) {
          case 'server-reference':
            stats.serverReferences++;
            break;
          case 'base64-embedded':
            stats.base64Embedded++;
            break;
          case 'reference-only':
            stats.referenceOnly++;
            break;
        }
      } else {
        stats.base64Embedded++; // Legacy format
      }
    });

    return stats;
  };

  return {
    importProject,
    getImportStatistics,
    restoreMediaUrl,
    restoreServerReference,
    restoreBase64Data
  };
};
