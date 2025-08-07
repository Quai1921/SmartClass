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
    
    // STEP 1: Analyze all possible canvas measurements
    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(canvasElement);
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
    
    // Detect if panels are hidden by checking canvas width relative to viewport
    // When panels are hidden, canvas takes up much more screen real estate
    const viewportWidth = window.innerWidth;
    const canvasWidthRatio = actualCanvasWidth / viewportWidth;
    const arePanelsHidden = canvasWidthRatio > 0.8; // If canvas is >80% of viewport, panels are likely hidden
    
    if (isSimpleColumn) {
      // Simple column: Adaptive sizing based on panel visibility
      const basePercentage = arePanelsHidden ? 0.85 : 0.75; // Bigger when panels hidden
      containerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
      containerHeight = Math.floor(containerWidthPx * 9 / 16); // 16:9 aspect ratio
    } else {
      // Multi-layout templates
      const hasMultipleColumns = template.structure.length > 1;
      
      if (hasMultipleColumns) {
        // Multi-column layouts: Adaptive sizing based on panel visibility
        const basePercentage = arePanelsHidden ? 0.95 : 0.9; // Even bigger when panels hidden
        containerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
        containerHeight = Math.floor(containerWidthPx * 9 / 16); // 16:9 aspect ratio
      } else {
        // Single content templates: Adaptive sizing based on panel visibility
        const basePercentage = arePanelsHidden ? 0.9 : 0.85; // Bigger when panels hidden
        containerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
        containerHeight = Math.floor(containerWidthPx * 9 / 16); // 16:9 aspect ratio
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
