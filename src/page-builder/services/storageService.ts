import { StorageAdapter, type SavedProject } from '../../config/adapters/storage-adapter';
import type { Course, Element } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class PageBuilderStorageService {
  private static readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private static autoSaveTimer: number | null = null;

  /**
   * Convert Course to SavedProject
   */
  static courseToProject(course: Course, elements: Element[]): SavedProject {
    // For backward compatibility, we still save elements in the SavedProject format
    // but we extract them from the current page
    const allElements = course.pages?.flatMap(page => page.elements) || elements || [];
    
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      type: course.type,
      elements: allElements, // Keep backward compatibility for now
      thumbnail: this.generateThumbnail(allElements),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      status: course.status,
      version: 1
    };
  }

  /**
   * Convert SavedProject to Course
   */
  static projectToCourse(project: SavedProject): Course {
    // Handle both old format (elements) and new format (pages)
    const pages = (project as any).pages || [{
      id: crypto.randomUUID(),
      title: 'Página 1',
      elements: project.elements || [],
      order: 0,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }];

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      type: project.type,
      pages: pages,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      status: project.status
    };
  }

  /**
   * Save current project
   */
  static saveProject(course: Course, elements: Element[], options: { silent?: boolean } = {}) {
    try {
      const project = this.courseToProject(course, elements);
      StorageAdapter.saveProject(project);
      StorageAdapter.setCurrentProject(project);
      
      if (!options.silent) {

      }
      
      return project;
    } catch (error) {
      // console.error('Failed to save project:', error);
      throw error;
    }
  }

  /**
   * Load project by ID
   */
  static loadProject(id: string): { course: Course; elements: Element[] } | null {
    try {
      const project = StorageAdapter.getProject(id);
      if (!project) return null;

      const course = this.projectToCourse(project);
      return {
        course,
        elements: project.elements
      };
    } catch (error) {
      // console.error('Failed to load project:', error);
      return null;
    }
  }

  /**
   * Load the last current project
   */
  static loadCurrentProject(): { course: Course; elements: Element[] } | null {
    try {
      const project = StorageAdapter.getCurrentProject();
      if (!project) return null;

      const course = this.projectToCourse(project);
      return {
        course,
        elements: project.elements
      };
    } catch (error) {
      // console.error('Failed to load current project:', error);
      return null;
    }
  }

  /**
   * Create a new project
   */
  static createNewProject(title: string = 'Nuevo Curso', type: 'Academico' | 'Evaluativo' = 'Academico'): Course {
    const course: Course = {
      id: uuidv4(),
      title,
      description: '',
      type,
      pages: [{
        id: crypto.randomUUID(),
        title: 'Página 1',
        elements: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'DRAFT'
    };

    return course;
  }

  /**
   * Get all saved projects
   */
  static getAllProjects(): SavedProject[] {
    return StorageAdapter.getAllProjects();
  }

  /**
   * Delete a project
   */
  static deleteProject(id: string) {
    try {

      StorageAdapter.deleteProject(id);

    } catch (error) {
      // console.error('❌ PageBuilderStorageService: Failed to delete project:', error);
      throw error;
    }
  }

  /**
   * Clean up orphaned projects that don't match any existing courses
   */
  static cleanupOrphanedProjects(validCourseIds: string[]) {
    try {
      const allProjects = this.getAllProjects();
      const orphanedProjects = allProjects.filter(project => !validCourseIds.includes(project.id));
      
      if (orphanedProjects.length > 0) {

        orphanedProjects.forEach(project => {
          this.deleteProject(project.id);
        });

        return orphanedProjects.length;
      } else {

        return 0;
      }
    } catch (error) {
      // console.error('❌ Failed to cleanup orphaned projects:', error);
      return 0;
    }
  }

  /**
   * Generate a simple thumbnail representation
   */
  private static generateThumbnail(elements: Element[]): string {
    const elementTypes = elements.map(el => el.type);
    const summary = elementTypes.slice(0, 3).join(',');
    return summary || 'empty';
  }

  /**
   * Start auto-save functionality
   */
  static startAutoSave(
    getCourse: () => Course,
    getElements: () => Element[]
  ) {
    if (!StorageAdapter.isAutoSaveEnabled()) return;

    this.stopAutoSave(); // Clear any existing timer

    this.autoSaveTimer = setInterval(() => {
      try {
        const course = getCourse();
        const elements = getElements();
        
        if (course && elements) {
          this.saveProject(course, elements, { silent: true });
        }
      } catch (error) {
        // console.error('Auto-save failed:', error);
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop auto-save
   */
  static stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Manual save with user feedback
   */
  static async saveWithFeedback(
    course: Course, 
    elements: Element[],
    showNotification?: (message: string, type: 'success' | 'error') => void
  ) {
    try {
      this.saveProject(course, elements);
      
      if (showNotification) {
        showNotification('✅ Proyecto guardado exitosamente', 'success');
      }
    } catch (error) {
      // console.error('Save failed:', error);
      
      if (showNotification) {
        showNotification('❌ Error al guardar el proyecto', 'error');
      }
    }
  }

  /**
   * Export project as JSON
   */
  static exportProject(course: Course, elements: Element[]): string {
    const project = this.courseToProject(course, elements);
    return JSON.stringify(project, null, 2);
  }

  /**
   * Import project from JSON
   */
  static importProject(jsonData: string): { course: Course; elements: Element[] } | null {
    try {
      const project: SavedProject = JSON.parse(jsonData);
      
      // Debug tracking

      
      if ((project as any).pages && (project as any).pages.length > 0) {

        // (project as any).pages.forEach((page: any, index: number) => {
        //   // console.log(`   Page ${index + 1}: ${page.title} (${page.elements?.length || 0} elements)`);
        // });
      }
      
      // Validate project structure
      if (!project.id || !project.title || !Array.isArray(project.elements)) {
        throw new Error('Invalid project structure');
      }

      const course = this.projectToCourse(project);
      
      // Debug tracking

      
      if (course?.pages && course.pages.length > 0) {

        // course.pages.forEach((page: any, index: number) => {
        //   // console.log(`   Page ${index + 1}: ${page.title} (${page.elements?.length || 0} elements)`);
        // });
      } else {

      }
      
 
      
      return {
        course,
        elements: project.elements
      };
    } catch (error) {
      // console.error('Failed to import project:', error);
      return null;
    }
  }
}
