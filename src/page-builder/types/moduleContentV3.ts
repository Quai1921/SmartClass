/**
 * Enhanced Module Content Structure V3
 * Improved pagination with direct element storage per page
 */

export interface ModuleContentV3 {
  version: 3;
  content: {
    pages: {
      [pageId: string]: {
        id: string;
        title: string;
        elements: any[]; // Direct element storage
        order: number;
        createdAt: string;
        updatedAt: string;
      };
    };
    currentPageId: string;
    totalPages: number;
    metadata: {
      moduleId: string;
      courseId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

/**
 * Migration utilities for seamless V2 → V3 upgrade
 */
export class ModuleContentMigrator {
  
  /**
   * Detect content version and migrate to V3
   */
  static migrateToV3(content: any, moduleId: string, courseId: string): ModuleContentV3 {
    // Already V3
    if (content?.version === 3) {
      return content as ModuleContentV3;
    }
    
    // V2 format - migrate
    if (content?.version === 2) {
      return this.migrateV2ToV3(content, moduleId, courseId);
    }
    
    // Legacy array format
    if (Array.isArray(content)) {
      return this.migrateLegacyToV3(content, moduleId, courseId);
    }
    
    // Empty or unknown - create default
    return this.createDefaultV3(moduleId, courseId);
  }

  /**
   * Migrate V2 enhanced format to V3
   */
  private static migrateV2ToV3(v2Content: any, moduleId: string, courseId: string): ModuleContentV3 {
    const pages: ModuleContentV3['content']['pages'] = {};
    
    // Process each page from V2
    if (v2Content.pages && v2Content.elements) {
      v2Content.pages.forEach((page: any) => {
        // Map elementIds to actual elements
        const pageElements = page.elementIds
          ?.map((id: string) => v2Content.elements.find((el: any) => el.id === id))
          ?.filter(Boolean) || [];
        
        pages[page.id] = {
          id: page.id,
          title: page.title,
          elements: pageElements,
          order: page.order || 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
    }
    
    // If no pages, create default with all elements
    if (Object.keys(pages).length === 0) {
      const defaultPageId = `${moduleId}-page-1`;
      pages[defaultPageId] = {
        id: defaultPageId,
        title: 'Page 1',
        elements: v2Content.elements || [],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    const pageIds = Object.keys(pages);
    const firstPageId = pageIds.sort((a, b) => pages[a].order - pages[b].order)[0];
    
    return {
      version: 3,
      content: {
        pages,
        currentPageId: firstPageId,
        totalPages: pageIds.length,
        metadata: {
          moduleId,
          courseId,
          createdAt: v2Content.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  }

  /**
   * Migrate legacy array format to V3
   */
  private static migrateLegacyToV3(elements: any[], moduleId: string, courseId: string): ModuleContentV3 {
    const defaultPageId = `${moduleId}-page-1`;
    
    return {
      version: 3,
      content: {
        pages: {
          [defaultPageId]: {
            id: defaultPageId,
            title: 'Page 1',
            elements: elements || [],
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        currentPageId: defaultPageId,
        totalPages: 1,
        metadata: {
          moduleId,
          courseId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  }

  /**
   * Create default empty V3 structure
   */
  private static createDefaultV3(moduleId: string, courseId: string): ModuleContentV3 {
    const defaultPageId = `${moduleId}-page-1`;
    
    return {
      version: 3,
      content: {
        pages: {
          [defaultPageId]: {
            id: defaultPageId,
            title: 'Page 1',
            elements: [],
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        currentPageId: defaultPageId,
        totalPages: 1,
        metadata: {
          moduleId,
          courseId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };
  }
}