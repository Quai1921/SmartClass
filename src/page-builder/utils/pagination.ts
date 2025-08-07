/**
 * Pagination Utilities
 * Step 2: Core utilities for managing paginated content
 */

import type { 
  PageData, 
  PaginatedContent, 
  LegacyProject, 
  MigrationUtils 
} from '../types/pagination';

export class PaginationUtils implements MigrationUtils {
  
  /**
   * Convert legacy single-page project to paginated structure
   */
  fromLegacy(legacyProject: LegacyProject): PaginatedContent {
    const pageId = "1";
    const page: PageData = {
      id: pageId,
      title: "Page 1",
      elements: legacyProject.elements || [],
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      pages: { [pageId]: page },
      currentPageId: pageId,
      totalPages: 1,
      metadata: {
        version: "1.0.0",
        lastModified: new Date().toISOString(),
        totalElements: page.elements.length
      }
    };
  }

  /**
   * Convert paginated content back to legacy format (for backward compatibility)
   */
  toLegacy(paginatedContent: PaginatedContent): LegacyProject {
    const currentPage = paginatedContent.pages[paginatedContent.currentPageId];
    return {
      elements: currentPage?.elements || []
    };
  }

  /**
   * Validate paginated content structure
   */
  validate(content: PaginatedContent): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if current page exists
    if (!content.pages[content.currentPageId]) {
      errors.push(`Current page ID "${content.currentPageId}" does not exist`);
    }

    // Check if totalPages matches actual pages
    const actualPageCount = Object.keys(content.pages).length;
    if (content.totalPages !== actualPageCount) {
      errors.push(`Total pages mismatch: expected ${content.totalPages}, found ${actualPageCount}`);
    }

    // Validate each page
    Object.entries(content.pages).forEach(([pageId, page]) => {
      if (!page.id || page.id !== pageId) {
        errors.push(`Page ID mismatch in page ${pageId}`);
      }
      if (!page.title || page.title.trim() === '') {
        errors.push(`Page ${pageId} has empty title`);
      }
      if (!Array.isArray(page.elements)) {
        errors.push(`Page ${pageId} has invalid elements array`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a new empty page
   */
  static createEmptyPage(id: string, title: string, order: number): PageData {
    return {
      id,
      title,
      elements: [],
      order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate next available page ID
   */
  static getNextPageId(content: PaginatedContent): string {
    const existingIds = Object.keys(content.pages).map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return (maxId + 1).toString();
  }

  /**
   * Update metadata after content changes
   */
  static updateMetadata(content: PaginatedContent): PaginatedContent {
    const totalElements = Object.values(content.pages).reduce(
      (sum, page) => sum + page.elements.length, 
      0
    );

    return {
      ...content,
      metadata: {
        ...content.metadata,
        version: content.metadata?.version || "1.0.0",
        lastModified: new Date().toISOString(),
        totalElements
      }
    };
  }

  /**
   * Clone a page with new ID
   */
  static clonePage(page: PageData, newId: string, newTitle?: string): PageData {
    return {
      ...page,
      id: newId,
      title: newTitle || `${page.title} (Copy)`,
      elements: page.elements.map(element => ({
        ...element,
        id: `${element.id}_${newId}` // Ensure unique element IDs
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Factory function to create initial paginated content
 */
export function createInitialPaginatedContent(): PaginatedContent {
  const utils = new PaginationUtils();
  return utils.fromLegacy({ elements: [] });
}

/**
 * Helper to get ordered pages array
 */
export function getOrderedPages(content: PaginatedContent): PageData[] {
  return Object.values(content.pages).sort((a, b) => a.order - b.order);
}
