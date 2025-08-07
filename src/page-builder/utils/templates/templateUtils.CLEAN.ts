import type { Element } from '../../types';
import { createElement } from '../elementFactory';
import type { ContainerTemplate } from './types';

/**
 * Function to create elements from template with responsive styling
 * This preserves all the responsive behavior and styling logic
 */
export function createElementsFromTemplate(
  template: ContainerTemplate,
  parentContainerId: string,
  addElement: (element: Element) => void
): void {


  // Create child containers based on template structure with responsive styling
  template.structure.forEach((childTemplate, index) => {
    // Apply responsive styling based on layout type and parent layout
    let responsiveProperties = { ...childTemplate.properties };
    
    const parentLayoutType = template.containerProperties?.layout || 'column';
    const templateLayoutType = template.layoutType;
    
    // Apply responsive properties based on parent layout and template type
    if (parentLayoutType === 'row') {
      // For row layouts (multi-column), ensure proper flex behavior
      if (childTemplate.properties.widthUnit === '%') {
        // Keep percentage widths but add responsive properties
        responsiveProperties = {
          ...responsiveProperties,
          width: childTemplate.properties.width, // Keep original percentage (50%, 33.33%, etc.)
          widthUnit: '%',
          minWidth: Math.max(150, Math.floor(800 / template.structure.length) - 32), // Dynamic min width based on column count
          height: responsiveProperties.height || responsiveProperties.minHeight || 120,
          heightUnit: 'px',
          padding: 16, // Internal padding for content
          backgroundColor: responsiveProperties.backgroundColor || 'transparent',
          borderRadius: responsiveProperties.borderRadius || 8,
          // Apply any additional layout properties
          layout: responsiveProperties.layout || 'column',
          // Add flex properties via style
          style: {
            ...responsiveProperties.style,
            flexGrow: 1, // Allow growth to fill available space
            flexShrink: 1, // Allow shrinking when space is limited  
            flexBasis: `${childTemplate.properties.width}%`, // Base size from percentage
          }
        };
      } else if (childTemplate.properties.widthUnit === 'px') {
        // For fixed pixel widths, ensure they're reasonable
        responsiveProperties = {
          ...responsiveProperties,
          minWidth: 150,
          maxWidth: 400,
          height: responsiveProperties.height || responsiveProperties.minHeight || 120,
          heightUnit: 'px',
          padding: 16,
          style: {
            ...responsiveProperties.style,
            flexGrow: 0, // Don't grow beyond fixed width
            flexShrink: 0, // Don't shrink below fixed width
            flexBasis: `${responsiveProperties.width}px`
          }
        };
      }
    } else {
      // For column layouts, make children full width
      responsiveProperties = {
        ...responsiveProperties,
        width: 100,
        widthUnit: '%',
        minHeight: responsiveProperties.minHeight || 120,
        height: responsiveProperties.height || responsiveProperties.minHeight || 120,
        heightUnit: 'px',
        padding: 16,
        backgroundColor: responsiveProperties.backgroundColor || 'transparent',
        layout: responsiveProperties.layout || 'column',
        // For column layout, children should take full width
        style: {
          ...responsiveProperties.style,
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: 'auto'
        }
      };
    }

    // Log detailed information for debugging

    const childElement = createElement(
      childTemplate.type,
      {
        ...responsiveProperties,
        // Ensure proper ordering
        order: childTemplate.order || index + 1
      },
      parentContainerId
    );

    addElement(childElement);
  });
}

/**
 * Hook to get container templates - can be extended for additional functionality
 */
export function useContainerTemplates() {
  // This can be extended with additional template management logic
  return {
    createElementsFromTemplate,
  };
}
