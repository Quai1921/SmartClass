import type { Course } from '../../actions/courses/get-courses';
import type { Element } from '../types';
import { PageBuilderStorageService } from './storageService';

export interface CoursePage {
  id: string;
  courseId: string;
  title: string;
  elements: Element[];
  createdAt: string;
  updatedAt: string;
}

export class CoursePageService {
  private static readonly PAGES_STORAGE_KEY = 'course_pages';

  /**
   * Get all pages for a course
   */
  static getCoursePages(courseId: string): CoursePage[] {
    try {
      const allPages = this.getAllPages();
      return allPages.filter(page => page.courseId === courseId);
    } catch (error) {
      // console.error('Error getting course pages:', error);
      return [];
    }
  }

  /**
   * Create a new page for a course
   */
  static createPage(courseId: string, title: string): CoursePage {
    const newPage: CoursePage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      courseId,
      title,
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.savePage(newPage);
    return newPage;
  }

  /**
   * Save a page
   */
  static savePage(page: CoursePage): void {
    try {
      const allPages = this.getAllPages();
      const existingIndex = allPages.findIndex(p => p.id === page.id);
      
      const updatedPage = {
        ...page,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        allPages[existingIndex] = updatedPage;
      } else {
        allPages.push(updatedPage);
      }

      localStorage.setItem(this.PAGES_STORAGE_KEY, JSON.stringify(allPages));
    } catch (error) {
      // console.error('Error saving page:', error);
    }
  }

  /**
   * Get a specific page
   */
  static getPage(pageId: string): CoursePage | null {
    try {
      const allPages = this.getAllPages();
      return allPages.find(page => page.id === pageId) || null;
    } catch (error) {
      // console.error('Error getting page:', error);
      return null;
    }
  }

  /**
   * Delete a page
   */
  static deletePage(pageId: string): boolean {
    try {
      const allPages = this.getAllPages();
      const filteredPages = allPages.filter(page => page.id !== pageId);
      localStorage.setItem(this.PAGES_STORAGE_KEY, JSON.stringify(filteredPages));
      return true;
    } catch (error) {
      // console.error('Error deleting page:', error);
      return false;
    }
  }

  /**
   * Save current page builder state to a course page
   */
  static saveCurrentBuilderState(courseId: string, pageId: string, elements: Element[]): void {
    const page = this.getPage(pageId);
    if (page && page.courseId === courseId) {
      const updatedPage: CoursePage = {
        ...page,
        elements,
        updatedAt: new Date().toISOString(),
      };
      this.savePage(updatedPage);
    }
  }

  /**
   * Load a course page into the page builder
   */
  static loadPageToBuilder(pageId: string): { page: CoursePage; elements: Element[] } | null {
    const page = this.getPage(pageId);
    if (page) {
      return {
        page,
        elements: page.elements,
      };
    }
    return null;
  }

  /**
   * Get all pages (private utility)
   */
  private static getAllPages(): CoursePage[] {
    try {
      const stored = localStorage.getItem(this.PAGES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // console.error('Error parsing stored pages:', error);
      return [];
    }
  }

  /**
   * Export all pages for a course
   */
  static exportCoursePages(courseId: string): CoursePage[] {
    return this.getCoursePages(courseId);
  }

  /**
   * Import pages for a course
   */
  static importCoursePages(pages: CoursePage[]): void {
    pages.forEach(page => this.savePage(page));
  }
}
