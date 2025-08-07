import { useState } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { ExportOrchestrator } from '../services/exportOrchestrator';

/**
 * Simplified export hook that orchestrates the export process
 * All complex logic has been moved to dedicated service modules
 */
export const useExport = () => {
  const { course, exportProject } = useBuilder();
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [exportPreviewData, setExportPreviewData] = useState<any>(null);

  /**
   * Enhanced export function that processes all media files (images, audio, video)
   * and embeds them as base64 data or server references in the JSON export.
   * First shows a preview modal, then proceeds with export if confirmed.
   */
  const handleExport = async () => {
    try {
      // Get the basic project data
      const jsonData = exportProject();
      const projectData = JSON.parse(jsonData);
      
      // Validate export data before processing
      const validation = ExportOrchestrator.validateExport(projectData);
      if (!validation.isValid) {
        // console.error('Export validation failed:', validation.errors);
        alert(`Error de validación: ${validation.errors.join(', ')}`);
        return;
      }
      
      if (validation.warnings.length > 0) {
        // console.warn('Export warnings:', validation.warnings);
      }
      
      // Prepare enhanced export with comprehensive media processing
      const enhancedProject = await ExportOrchestrator.prepareExport(projectData);
      
      // Show the export preview modal
      setExportPreviewData(enhancedProject);
      setShowExportPreview(true);
      
    } catch (error) {
      // console.error('Export preparation failed:', error);
      alert('Error al preparar la exportación. Ver consola para más detalles.');
    }
  };

  /**
   * Function to handle the actual download after preview confirmation
   */
  const handleConfirmExport = async () => {
    try {
      if (!exportPreviewData) return;
      
      // Create and download the JSON file
      const blob = new Blob([JSON.stringify(exportPreviewData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course?.title || 'proyecto'}-enhanced.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Close the preview modal
      setShowExportPreview(false);
      
      // Log success information
      ExportOrchestrator.logExportSuccess(exportPreviewData);
      
      // Show user-friendly notification
      const notification = ExportOrchestrator.generateUserNotification(exportPreviewData);
      alert(notification);
      
      // Clear preview data
      setExportPreviewData(null);
      
    } catch (error) {
      // console.error('Export failed:', error);
      alert('Error al exportar el proyecto. Ver consola para más detalles.');
    }
  };

  /**
   * Function to handle export cancellation
   */
  const handleCancelExport = () => {
    setShowExportPreview(false);
    setExportPreviewData(null);
  };

  return {
    showExportPreview,
    exportPreviewData,
    handleExport,
    handleConfirmExport,
    handleCancelExport
  };
};
