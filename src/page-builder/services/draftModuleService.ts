import type { Module } from '../../actions/modules/modules';

export interface DraftModule {
  id: string;
  courseId: string;
  type: 'ACADEMIC' | 'EVALUATIVE';
  title: string;
  content: string;
  order?: number;
  status: 'DRAFT'; // Always DRAFT for drafts
  createdAt: string;
  updatedAt: string;
  isDraft: true; // Flag to identify draft modules
  estimatedTime?: number;
}

export class DraftModuleService {
  private static readonly DRAFTS_STORAGE_KEY = 'draft_modules';

  /**
   * Get all draft modules
   */
  static getAllDrafts(): DraftModule[] {
    try {
      const stored = localStorage.getItem(this.DRAFTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // console.error('Error getting draft modules:', error);
      return [];
    }
  }

  /**
   * Get draft modules for a specific course
   */
  static getDraftsByCourse(courseId: string): DraftModule[] {
    try {
      const allDrafts = this.getAllDrafts();
      return allDrafts.filter(draft => draft.courseId === courseId);
    } catch (error) {
      // console.error('Error getting draft modules for course:', error);
      return [];
    }
  }

  /**
   * Save a draft module
   */
  static saveDraft(moduleData: {
    courseId: string;
    type: 'ACADEMIC' | 'EVALUATIVE';
    title: string;
    content: string;
    order?: number;
    estimatedTime?: number;
  }): DraftModule {
    try {
      const existingDrafts = this.getAllDrafts();
      const now = new Date().toISOString();

      const draft: DraftModule = {
        id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        courseId: moduleData.courseId,
        type: moduleData.type,
        title: moduleData.title,
        content: moduleData.content,
        order: moduleData.order,
        status: 'DRAFT',
        createdAt: now,
        updatedAt: now,
        isDraft: true,
        estimatedTime: moduleData.estimatedTime,
      };

      const updatedDrafts = [...existingDrafts, draft];
      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));

      return draft;
    } catch (error) {
      // console.error('Error saving draft module:', error);
      throw error;
    }
  }

  /**
   * Update an existing draft module
   */
  static updateDraft(draftId: string, updates: Partial<Omit<DraftModule, 'id' | 'isDraft' | 'status' | 'createdAt'>>): DraftModule | null {
    try {
      const drafts = this.getAllDrafts();
      const draftIndex = drafts.findIndex(draft => draft.id === draftId);

      if (draftIndex === -1) {
        return null;
      }

      const updatedDraft = {
        ...drafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      drafts[draftIndex] = updatedDraft;
      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(drafts));

      return updatedDraft;
    } catch (error) {
      // console.error('Error updating draft module:', error);
      return null;
    }
  }

  /**
   * Delete a draft module
   */
  static deleteDraft(draftId: string): boolean {
    try {
      const drafts = this.getAllDrafts();
      const filteredDrafts = drafts.filter(draft => draft.id !== draftId);

      if (filteredDrafts.length === drafts.length) {
        return false; // Draft not found
      }

      localStorage.setItem(this.DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
      return true;
    } catch (error) {
      // console.error('Error deleting draft module:', error);
      return false;
    }
  }

  /**
   * Get a specific draft module by ID
   */
  static getDraft(draftId: string): DraftModule | null {
    try {
      const drafts = this.getAllDrafts();
      return drafts.find(draft => draft.id === draftId) || null;
    } catch (error) {
      // console.error('Error getting draft module:', error);
      return null;
    }
  }

  /**
   * Convert a draft module to a regular module (for API submission)
   */
  static draftToModule(draft: DraftModule): Omit<Module, 'id' | 'createdAt'> {
    return {
      courseId: draft.courseId,
      type: draft.type,
      title: draft.title,
      content: draft.content,
      order: draft.order,
      status: 'DRAFT',
      estimatedTime: draft.estimatedTime,
    };
  }

  /**
   * Clear all draft modules (useful for testing or reset)
   */
  static clearAllDrafts(): void {
    try {
      localStorage.removeItem(this.DRAFTS_STORAGE_KEY);
    } catch (error) {
      // console.error('Error clearing draft modules:', error);
    }
  }

  /**
   * Get draft count for a specific course
   */
  static getDraftCount(courseId: string): number {
    try {
      return this.getDraftsByCourse(courseId).length;
    } catch (error) {
      // console.error('Error getting draft count:', error);
      return 0;
    }
  }
}
