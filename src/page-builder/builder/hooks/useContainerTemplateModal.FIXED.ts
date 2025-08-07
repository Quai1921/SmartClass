import { useState, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import { createElementsFromTemplate, type ContainerTemplate } from '../../utils/containerTemplates';
import { createElement } from '../../utils/elementFactory';

export const useContainerTemplateModal = (canvasWidth?: number) => {
  const [containerTemplateModalOpen, setContainerTemplateModalOpen] = useState(false);
  const [pendingDropTarget, setPendingDropTarget] = useState<string | undefined>(undefined);

  const { addElement } = useBuilder();
  
  const openContainerTemplateModal = useCallback((dropTarget?: string) => {
    setPendingDropTarget(dropTarget);
    setContainerTemplateModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setContainerTemplateModalOpen(false);
    setPendingDropTarget(undefined);
  }, []);

  const handleTemplateSelect = useCallback((template: ContainerTemplate) => {
    
    // Check actual Canvas DOM element dimensions for comparison
    const canvasElement = document.querySelector('[data-canvas]') as HTMLElement;
    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
    } else {
    }
    
    // Calculate responsive dimensions based on canvas width
    const isSimpleColumn = template.structure.length === 0;
    
    // Use actual Canvas DOM width for accurate positioning (THE FIX)
    let actualCanvasWidth = canvasWidth || 1920; // Fallback
    
    if (canvasElement) {
      // Use the actual DOM width for precise centering
      actualCanvasWidth = canvasElement.offsetWidth;
    } else {

    }
    
    // Simplified responsive width and height calculation
    let containerWidthPx: number;
    let containerHeight: number;
    
    if (isSimpleColumn) {
      // Simple column: use 60% of actual canvas width for better proportions
      containerWidthPx = Math.floor(actualCanvasWidth * 0.6);
      containerHeight = Math.floor(containerWidthPx * 9 / 16); // 16:9 aspect ratio
    } else {
      // Multi-layout templates
      const hasMultipleColumns = template.structure.length > 1;
      
      if (hasMultipleColumns) {
        // Multi-column layouts: use 80% of actual canvas width
        containerWidthPx = Math.floor(actualCanvasWidth * 0.8);
        containerHeight = Math.max(250, Math.floor(containerWidthPx * 0.4)); // Shorter for multiple columns
      } else {
        // Single content templates: use 70% of actual canvas width
        containerWidthPx = Math.floor(actualCanvasWidth * 0.7);
        containerHeight = Math.max(200, Math.floor(containerWidthPx * 0.5)); // Medium height
      }
    }
    
    // Determine layout properties based on template
    const layoutProperties = template.containerProperties || {};
    const isRowLayout = layoutProperties.layout === 'row';
    const hasMultipleChildren = template.structure.length > 1;
    
    // Simplified centering calculation using actual canvas width (THE MAIN FIX)
    const containerLeft = (actualCanvasWidth - containerWidthPx) / 2;

    // Create the main container with simplified responsive positioning and proper layout
    const containerPropsToApply = {
      // Use pixel-based dimensions for precise control
      width: containerWidthPx,
      height: containerHeight,
      widthUnit: 'px' as const,
      heightUnit: 'px' as const,
      position: 'absolute' as const,
      left: Math.round(containerLeft),
      top: isSimpleColumn ? 40 : 50,
      backgroundColor: isSimpleColumn ? '#f1f5f9' : '#f8fafc',
      padding: 0, // Remove internal padding to maximize content area
      // Apply template properties AFTER other properties so they take precedence
      ...layoutProperties,
      // Add flexbox properties for multi-child layouts
      ...(hasMultipleChildren && isRowLayout && {
        gap: layoutProperties.gap || 16,
        justifyContent: layoutProperties.justifyContent || 'space-between',
        alignItems: layoutProperties.alignItems || 'stretch'
      }),
      ...(hasMultipleChildren && !isRowLayout && {
        gap: layoutProperties.gap || 16,
        alignItems: layoutProperties.alignItems || 'stretch'
      })
    };
    

    

    const mainContainer = createElement('container', containerPropsToApply, pendingDropTarget);




    addElement(mainContainer);

    // Create child containers from template
    if (template.structure.length > 0) {
      createElementsFromTemplate(template, mainContainer.id, addElement);
    }

    // Close modal
    handleModalClose();
  }, [pendingDropTarget, addElement, handleModalClose, canvasWidth]);

  return {
    containerTemplateModalOpen,
    openContainerTemplateModal,
    handleModalClose,
    handleTemplateSelect,
  };
};
