import type { Course } from '../../actions/courses/get-courses';
import type { Element } from '../types';

export interface DraftCourse {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject?: string;
  group?: string;
  elements: Element[];
  banner?: string;
  status: 'DRAFT'; // Always DRAFT for drafts
  createdAt: string;
  updatedAt: string;
  isDraft: true; // Flag to identify draft courses
}

export class DraftCourseService {
  private static readonly DRAFTS_STORAGE_KEY = 'draft_courses';

  /**
   * Get all draft courses
   */
  static getAllDrafts(): DraftCourse[] {
    try {
      const stored = localStorage.getItem(this.DRAFTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // console.error('Error getting draft courses:', error);
      return [];
    }
  }

  /**
   * Save a draft course
   */
  static saveDraft(courseData: {
    title: string;
    description: string;
    grade: number;
    subject?: string;
    group?: string;
    elements: Element[];
    banner?: string;
  }): DraftCourse {
    try {
      const existingDrafts = this.getAllDrafts();
      const now = new Date().toISOString();

      const draftCourse: DraftCourse = {
        id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: courseData.title,
        description: courseData.description,
        grade: courseData.grade,
        subject: courseData.subject,
        group: courseData.group,
        elements: courseData.elements,
        banner: courseData.banner,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        isDraft: true,
      };

      existingDrafts.push(draftCourse);
      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(existingDrafts));
      
      return draftCourse;
    } catch (error) {
      // console.error('Error saving draft course:', error);
      throw error;
    }
  }

  /**
   * Update an existing draft course
   */
  static updateDraft(draftId: string, updates: Partial<Omit<DraftCourse, 'id' | 'isDraft' | 'status' | 'createdAt'>>): DraftCourse | null {
    try {
      const existingDrafts = this.getAllDrafts();
      const draftIndex = existingDrafts.findIndex(draft => draft.id === draftId);

      if (draftIndex === -1) {
        // console.error('Draft not found:', draftId);
        return null;
      }

      const updatedDraft: DraftCourse = {
        ...existingDrafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      existingDrafts[draftIndex] = updatedDraft;
      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(existingDrafts));
      
      return updatedDraft;
    } catch (error) {
      // console.error('Error updating draft course:', error);
      return null;
    }
  }

  /**
   * Get a specific draft course
   */
  static getDraft(draftId: string): DraftCourse | null {
    try {
      const drafts = this.getAllDrafts();
      return drafts.find(draft => draft.id === draftId) || null;
    } catch (error) {
      // console.error('Error getting draft course:', error);
      return null;
    }
  }

  /**
   * Delete a draft course
   */
  static deleteDraft(draftId: string): boolean {
    try {
      const existingDrafts = this.getAllDrafts();
      const filteredDrafts = existingDrafts.filter(draft => draft.id !== draftId);
      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
      return true;
    } catch (error) {
      // console.error('Error deleting draft course:', error);
      return false;
    }
  }

  /**
   * Convert draft to regular course format for display
   */
  static convertDraftToCourse(draft: DraftCourse): Course {
    return {
      id: draft.id,
      title: draft.title,
      description: draft.description,
      banner: draft.banner || '',
      tutorName: '', // Will be filled from auth context
      grade: draft.grade.toString(),
      subject: draft.subject || '',
      group: draft.group || '',
      status: 'DRAFT',
      createdAt: draft.createdAt,
      // Add any other required Course properties with default values
      modules: [],
    };
  }

  /**
   * Clear all draft courses (for testing/debugging)
   */
  static clearAllDrafts(): void {
    try {
      localStorage.removeItem(this.DRAFTS_STORAGE_KEY);
    } catch (error) {
      // console.error('Error clearing draft courses:', error);
    }
  }
}
