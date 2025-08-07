/**
 * Module Page Parser
 * Handles parsing module content and assigning page numbers to containers
 */

export interface ParsedModulePage {
  pageNumber: number;
  elements: any[];
  containerId: string;
  containerName: string;
}

export interface ModulePageInfo {
  totalPages: number;
  pages: ParsedModulePage[];
  processedElements: any[];
}

/**
 * Parse module content and assign page numbers to top-level containers
 */
export const parseModulePages = (moduleContent: string): ModulePageInfo => {
  try {


    // Parse the module content
    const elements = JSON.parse(moduleContent);


    // Find top-level containers (no parentId)
    const topLevelContainers = elements.filter((el: any) =>
      !el.parentId && el.type === 'container'
    );



    if (topLevelContainers.length === 0) {


      // If no containers, treat the entire module as page 1
      const processedElements = elements.map((el: any) => ({
        ...el,
        properties: {
          ...el.properties,
          className: `${el.properties?.className || ''} parent-p-1`.trim()
        }
      }));

      return {
        totalPages: 1,
        pages: [{
          pageNumber: 1,
          elements: processedElements,
          containerId: 'root',
          containerName: 'Root Page'
        }],
        processedElements
      };
    }

    // Process each top-level container as a page
    const pages: ParsedModulePage[] = [];
    const processedElements: any[] = [];

    topLevelContainers.forEach((container: any, index: number) => {
      const pageNumber = index + 1;

      // Add page class to the container
      const processedContainer = {
        ...container,
        properties: {
          ...container.properties,
          className: `${container.properties?.className || ''} parent-p-${pageNumber}`.trim()
        }
      };

      // Find all elements that belong to this page (container and its children)
      const pageElements = elements.filter((el: any) =>
        el.id === container.id || el.parentId === container.id
      );

      // Process all elements in this page
      const processedPageElements = pageElements.map((el: any) => {
        if (el.id === container.id) {
          return processedContainer;
        }
        return el;
      });

      pages.push({
        pageNumber,
        elements: processedPageElements,
        containerId: container.id,
        containerName: container.name || `Page ${pageNumber}`
      });

      // Add processed elements to the main array
      processedElements.push(...processedPageElements);
    });

    // Add any remaining elements that don't belong to any container
    const remainingElements = elements.filter((el: any) =>
      !el.parentId && el.type !== 'container' &&
      !topLevelContainers.some(container => container.id === el.id)
    );

    if (remainingElements.length > 0) {

      processedElements.push(...remainingElements);
    }



    return {
      totalPages: pages.length,
      pages,
      processedElements
    };

  } catch (error) {
    // console.error('❌ [PAGE PARSER] Error parsing module pages:', error);
    throw new Error('Failed to parse module pages');
  }
}; 