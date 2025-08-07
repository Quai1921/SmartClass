/**
 * Debug Page Loading Utility
 * 
 * This utility helps track how pages are being loaded and processed
 */

export const debugPageLoading = {
  // Track project data before import
  trackProjectData: (projectData: any) => {

    
    if (projectData.pages && projectData.pages.length > 0) {

      projectData.pages.forEach((page: any, index: number) => {

      });
    }
    

  },

  // Track course object after import
  trackCourseObject: (course: any) => {

    
    if (course?.pages && course.pages.length > 0) {

      course.pages.forEach((page: any, index: number) => {

      });
    } else {

    }
    

  },

  // Track page navigation state
  trackPageNavigation: (pages: any[], currentPage: any) => {

    
    if (pages && pages.length > 0) {

      pages.forEach((page: any, index: number) => {

      });
    }
    

  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugPageLoading = debugPageLoading;
} 