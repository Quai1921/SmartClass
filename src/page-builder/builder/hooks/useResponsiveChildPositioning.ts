import { useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

/**
 * Hook for managing responsive child element positioning within containers
 * Converts child elements from pixel-based to percentage-based positioning
 */
export const useResponsiveChildPositioning = () => {
  const { elements, updateElement } = useBuilder();

  /**
   * Convert a single child element's position from pixels to percentages
   */
  const convertChildToPercentage = useCallback((
    childElement: any,
    containerWidth: number,
    containerHeight: number,
    options: {
      convertPosition?: boolean;
      convertDimensions?: boolean;
      preserveAspectRatio?: boolean;
    } = {}
  ) => {
    const {
      convertPosition = true,
      convertDimensions = false,
      preserveAspectRatio = true
    } = options;

    const currentLeft = childElement.properties.left || 0;
    const currentTop = childElement.properties.top || 0;
    const currentWidth = childElement.properties.width || 0;
    const currentHeight = childElement.properties.height || 0;

    // Skip if already using percentage units for position
    if (convertPosition && typeof currentLeft === 'string' && currentLeft.includes('%')) {
      return false;
    }

    const updates: any = {
      ...childElement.properties
    };

    // Convert position to percentages
    if (convertPosition) {
      const leftPercent = Math.min(95, Math.max(0, (Number(currentLeft) / containerWidth) * 100));
      const topPercent = Math.min(95, Math.max(0, (Number(currentTop) / containerHeight) * 100));
      
      updates.left = `${leftPercent.toFixed(1)}%`;
      updates.top = `${topPercent.toFixed(1)}%`;
      updates.positionUnit = 'percentage';
    }

    // Convert dimensions to percentages (optional)
    if (convertDimensions) {
      const widthPercent = Math.min(100, Math.max(5, (Number(currentWidth) / containerWidth) * 100));
      const heightPercent = Math.min(100, Math.max(5, (Number(currentHeight) / containerHeight) * 100));
      
      updates.width = `${widthPercent.toFixed(1)}%`;
      updates.height = `${heightPercent.toFixed(1)}%`;
      updates.dimensionUnit = 'percentage';
    }

    updateElement(childElement.id, { properties: updates });
    return true;
  }, [updateElement]);

  /**
   * Convert all child elements of a container to percentage positioning
   */
  const convertContainerChildrenToPercentage = useCallback((
    containerId: string,
    options: {
      convertPosition?: boolean;
      convertDimensions?: boolean;
      preserveAspectRatio?: boolean;
    } = {}
  ) => {
    // Find the container
    const container = elements.find(el => el.id === containerId);
    if (!container) {
      // console.error(`❌ Container ${containerId} not found`);
      return;
    }

    const containerWidth = Number(container.properties.width) || 400;
    const containerHeight = Number(container.properties.height) || 300;

    // Find all child elements
    const childElements = elements.filter(el => el.parentId === containerId);
    
    if (childElements.length === 0) {
      return;
    }


    let convertedCount = 0;
    childElements.forEach(child => {
      const converted = convertChildToPercentage(child, containerWidth, containerHeight, options);
      if (converted) convertedCount++;
    });

    return convertedCount;
  }, [elements, convertChildToPercentage]);

  /**
   * Convert child element back from percentage to pixels
   */
  const convertChildToPixels = useCallback((
    childElement: any,
    containerWidth: number,
    containerHeight: number
  ) => {
    const currentLeft = childElement.properties.left || 0;
    const currentTop = childElement.properties.top || 0;

    // Skip if not using percentage units
    if (typeof currentLeft !== 'string' || !currentLeft.includes('%')) {
      return false;
    }

    const leftPercent = parseFloat(currentLeft.replace('%', ''));
    const topPercent = parseFloat(String(currentTop).replace('%', ''));

    const leftPixels = Math.round((leftPercent / 100) * containerWidth);
    const topPixels = Math.round((topPercent / 100) * containerHeight);

    updateElement(childElement.id, {
      properties: {
        ...childElement.properties,
        left: leftPixels,
        top: topPixels,
        positionUnit: 'pixels'
      }
    });

    return true;
  }, [updateElement]);

  /**
   * Get containers that have child elements positioned with pixels
   */
  const getContainersWithPixelChildren = useCallback(() => {
    const containers = elements.filter(el => el.type === 'container' || el.type === 'simple-container');
    
    return containers.map(container => {
      const children = elements.filter(el => el.parentId === container.id);
      const pixelChildren = children.filter(child => {
        const left = child.properties.left;
        return typeof left !== 'string' || !(String(left).includes('%'));
      });
      
      return {
        container,
        totalChildren: children.length,
        pixelChildren: pixelChildren.length,
        hasPixelChildren: pixelChildren.length > 0
      };
    });
  }, [elements]);

  return {
    convertChildToPercentage,
    convertContainerChildrenToPercentage,
    convertChildToPixels,
    getContainersWithPixelChildren
  };
};
