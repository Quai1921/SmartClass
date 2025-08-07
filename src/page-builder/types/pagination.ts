/**
 * Pagination Types for Page Builder
 * Step 1: Define core data structures for multi-page content
 */

import type { Element } from '../types';

export interface PageData {
  id: string;
  title: string;
  elements: Element[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedContent {
  pages: Record<string, PageData>;
  currentPageId: string;
  totalPages: number;
  metadata?: {
    version: string;
    lastModified: string;
    totalElements: number;
  };
}

export interface PageOperations {
  // Page CRUD operations
  createPage: (title?: string) => string; // returns new page ID
  deletePage: (pageId: string) => boolean;
  updatePage: (pageId: string, updates: Partial<PageData>) => boolean;
  reorderPages: (pageIds: string[]) => boolean;
  
  // Navigation operations
  switchToPage: (pageId: string) => boolean;
  nextPage: () => boolean;
  prevPage: () => boolean;
  
  // Element operations per page
  addElementToPage: (pageId: string, element: Element) => boolean;
  removeElementFromPage: (pageId: string, elementId: string) => boolean;
  updateElementInPage: (pageId: string, elementId: string, updates: Partial<Element>) => boolean;
  moveElementBetweenPages: (elementId: string, fromPageId: string, toPageId: string) => boolean;
}

export interface PaginationState {
  content: PaginatedContent;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

// Helper type for legacy compatibility
export interface LegacyProject {
  course?: any;
  elements: Element[];
}

// Migration utilities type
export interface MigrationUtils {
  fromLegacy: (legacyProject: LegacyProject) => PaginatedContent;
  toLegacy: (paginatedContent: PaginatedContent) => LegacyProject;
  validate: (content: PaginatedContent) => { isValid: boolean; errors: string[] };
}
