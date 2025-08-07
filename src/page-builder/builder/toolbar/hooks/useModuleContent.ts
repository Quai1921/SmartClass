import { useEffect, useRef, useCallback } from 'react';
import { getCourses } from '../../../../actions/courses/get-courses';
import { getModulesByCourse } from '../../../../actions/modules/modules';
import { v4 as uuidv4 } from 'uuid';
import type { ModuleContext } from './useToolbarState';
import { parseModulePages } from '../../../utils/modulePageParser';

interface UseModuleContentParams {
  moduleContext: ModuleContext;
  setModuleContext: (context: ModuleContext) => void;
  course: any;
  importProject: (data: string) => void;
  updateCourse: (course: any) => void;
  createNewProject: () => void;
}

/**
 * Hook to handle module context detection and content loading
 */
export const useModuleContent = ({
  moduleContext,
  setModuleContext,
  course,
  importProject,
  updateCourse,
  createNewProject
}: UseModuleContentParams) => {
  // Track previous moduleId to detect module switches
  const prevModuleIdRef = useRef<string | null>(null);
  // Track if content has been loaded for current module to prevent loops
  const loadedModuleRef = useRef<string | null>(null);
  
  // Create stable references to prevent dependency issues
  const stableImportProject = useCallback(importProject, []);
  const stableCreateNewProject = useCallback(createNewProject, []);
  
  // Detect module context from URL parameters (only if not already set)
  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const moduleId = urlParams.get('moduleId');
    const action = urlParams.get('action');
    const moduleType = urlParams.get('moduleType') as 'ACADEMIC' | 'EVALUATIVE' | null;
    const title = urlParams.get('title');
    const description = urlParams.get('description');
    
    // 🎯 AUTO-SELECT MODULE: If we have moduleId from URL, trigger the ModulesTab auto-selection
    // This uses the working module loading logic instead of trying to duplicate it
    if (courseId && moduleId) {
      
      // Create a module object that matches what ModulesTab expects
      const moduleToSelect = {
        id: moduleId,
        courseId: courseId,
        title: title || undefined, // ✅ FIXED: Don't use 'Loading...' fallback
        description: description || '',
        type: moduleType || 'ACADEMIC',
        isDraft: false, // We'll assume it's published unless we know otherwise
        status: 'PUBLISHED'
      };
      
      // Dispatch the auto-selection event that ModulesTab is listening for
      const autoSelectEvent = new CustomEvent('modulesTab:autoSelectModule', {
        detail: { module: moduleToSelect }
      });
      
      // Delay the event slightly to ensure ModulesTab is mounted
      setTimeout(() => {
        
        // First, switch to modules tab to ensure ModulesTab is mounted
        const tabSwitchEvent = new CustomEvent('switchToModulesTab');
        window.dispatchEvent(tabSwitchEvent);
        
        // Then, wait a bit more for the tab switch to complete and ModulesTab to mount
        setTimeout(() => {
          window.dispatchEvent(autoSelectEvent);
        }, 200); // Wait for tab switch to complete
        
      }, 500); // Initial delay to ensure everything is mounted
    }
    
    // Always update if we have URL params and no current context, or if the IDs don't match
    if (courseId && moduleId) {
      const needsUpdate = !moduleContext.moduleId || 
                         moduleContext.moduleId !== moduleId ||
                         moduleContext.courseId !== courseId;
      
      if (needsUpdate) {
        
        // If moduleId changed (switching between modules), reset the builder
        if (prevModuleIdRef.current !== null && 
            prevModuleIdRef.current !== moduleId && 
            moduleId !== null && 
            moduleId !== prevModuleIdRef.current) {
          stableCreateNewProject();
          loadedModuleRef.current = null; // Reset loaded state
        }
        
        // Update the reference only if moduleId is not null
        if (moduleId !== null) {
          prevModuleIdRef.current = moduleId;
        }
        
        // Set action to 'edit-module' if not provided in URL (coming from ModuleManagementPage)
        const finalAction = action || 'edit-module';
        
        setModuleContext({ 
          courseId, 
          moduleId, 
          action: finalAction, 
          moduleType, 
          title, 
          description 
        });
      } else {
      }
    } else {
    }
  }, [setModuleContext, stableCreateNewProject]); // Run when dependencies change or on mount

  // URL parameter detection - runs once on mount to handle direct navigation
  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const moduleId = urlParams.get('moduleId');
    
    
    if (courseId && moduleId) {
      
      // Create a module object that matches what ModulesTab expects
      const moduleToSelect = {
        id: moduleId,
        courseId: courseId,
        // ✅ FIXED: Don't set temporary loading title
        type: 'ACADEMIC' as const,
        isDraft: false,
        status: 'PUBLISHED' as const
      };
      
      // Dispatch events after a delay to ensure everything is mounted
      setTimeout(() => {
        const tabSwitchEvent = new CustomEvent('switchToModulesTab');
        window.dispatchEvent(tabSwitchEvent);
        
        setTimeout(() => {
          const autoSelectEvent = new CustomEvent('modulesTab:autoSelectModule', {
            detail: { module: moduleToSelect }
          });
          window.dispatchEvent(autoSelectEvent);
        }, 300);
      }, 1000);
    }
  }, []); // Run only once on mount

  // Watch for URL changes and update context accordingly
  useEffect(() => {
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get('courseId');
      const moduleId = urlParams.get('moduleId');
      const action = urlParams.get('action');
      
      // Update context if URL has changed
      if (courseId && moduleId && (
          moduleContext.courseId !== courseId || 
          moduleContext.moduleId !== moduleId
        )) {
        const finalAction = action || 'edit-module';
        setModuleContext({ 
          courseId, 
          moduleId, 
          action: finalAction, 
          moduleType: null, 
          title: null, 
          description: null 
        });
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleURLChange);
    
    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, [moduleContext.courseId, moduleContext.moduleId, setModuleContext]);

  // Load course data when we have a courseId
  useEffect(() => {
    const loadCourseData = async () => {
      if (moduleContext.courseId && !course?.id) {
        try {
          const coursesResponse = await getCourses();
          if (coursesResponse.success && coursesResponse.data) {
            const foundCourse = coursesResponse.data.find((c: any) => c.id === moduleContext.courseId);
            if (foundCourse) {
              updateCourse({
                id: foundCourse.id,
                title: foundCourse.title,
                description: foundCourse.description
              });
            } else {
              // console.warn('⚠️ Course not found:', moduleContext.courseId);
            }
          }
        } catch (error) {
          // console.error('❌ Error loading course:', error);
        }
      }
    };

    loadCourseData();
  }, [moduleContext.courseId, course?.id, updateCourse]);

  // Load module content when we have a moduleId (editing existing module)
  useEffect(() => {
    const loadModuleContent = async () => {
      // Simplified condition - load if we have courseId and moduleId, and it's not already loaded
      if (moduleContext.courseId && 
          moduleContext.moduleId && 
          loadedModuleRef.current !== moduleContext.moduleId) {
        
        // Special case: if action is 'new-module', skip loading existing content
        if (moduleContext.action === 'new-module') {
          return;
        }
        
        try {
          
          // Reset builder before loading new content
          stableCreateNewProject();
          
          const modulesResponse = await getModulesByCourse(moduleContext.courseId);
          if (modulesResponse.success && modulesResponse.data) {
            const foundModule = modulesResponse.data.find((m: any) => m.id === moduleContext.moduleId);
            if (foundModule) {
              if (foundModule.content) {
                try {
                  const moduleData = JSON.parse(foundModule.content);
                  
                  let elementsArray: any[] | null = null;
                  let isEnhancedFormat = false;
                  let pagesToLoad: any[] = [];
                  
                  // 🚀 V3 FORMAT DETECTION - Handle both old format (version === 3) and new clean format (has content.pages structure)
                  const detectedV3Format = (moduleData.version === 3 && moduleData.content) || 
                                          (moduleData.content && moduleData.content.pages);
                  
                  if (detectedV3Format) {
                    // 🚀 V3 FORMAT HANDLING - Same logic as useModuleSelection
                    
                    // Handle currentPageId for backward compatibility
                    const currentPageId = moduleData.content.currentPageId || 
                                        Object.keys(moduleData.content.pages)[0] || 
                                        'page-1';
                    
                    // 🔍 DEBUG: Check what's actually in the V3 database data
                    Object.values(moduleData.content.pages).forEach((page: any) => {
                    });
                    
                    const currentPage = moduleData.content.pages[currentPageId];
                    
                    // 🔧 FIX: For V3 format, load only current page elements
                    // The page switching will handle loading other pages
                    elementsArray = currentPage?.elements || [];
                    
                    // Flatten hierarchical elements if they have children
                    const flattenedElements: any[] = [];
                    if (elementsArray) {
                      elementsArray.forEach((element: any) => {
                        if (element) {
                          // Add the parent element (without children property to avoid conflicts)
                          const { children, ...parentElement } = element;
                          flattenedElements.push(parentElement);
                          
                          // Add all children as separate elements
                          if (Array.isArray(children)) {
                            children.forEach((child: any) => {
                              if (child) {
                                flattenedElements.push(child);
                              }
                            });
                          }
                        }
                      });
                    }
                    
                    elementsArray = flattenedElements;
                    
                    // Create pages array for course builder compatibility
                    pagesToLoad = Object.values(moduleData.content.pages)
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((page: any) => {
                        // Flatten page elements to ensure children are included
                        const flattenedPageElements: any[] = [];
                        (page.elements || []).forEach((element: any) => {
                          if (element) {
                            // Add parent element
                            const { children, ...parentElement } = element;
                            flattenedPageElements.push(parentElement);
                            
                            // Add children as separate elements
                            if (Array.isArray(children)) {
                              children.forEach((child: any) => {
                                if (child) {
                                  flattenedPageElements.push(child);
                                }
                              });
                            }
                          }
                        });
                        
                        return {
                          id: page.id,
                          title: page.title,
                          elements: flattenedPageElements, // Use flattened elements
                          order: page.order,
                          // Add V3-specific metadata for future use
                          isV3Page: true,
                          originalV3Id: page.id
                        };
                      });
                    
                    
                  } else if (moduleData.version === 2 && moduleData.elements && Array.isArray(moduleData.elements)) {
                    // V2 Enhanced format

                    elementsArray = moduleData.elements;
                    isEnhancedFormat = true;
                  } else if (moduleData.elements && Array.isArray(moduleData.elements)) {

                    elementsArray = moduleData.elements;
                  } else if (Array.isArray(moduleData)) {

                    elementsArray = moduleData;
                  }
                  if (elementsArray && elementsArray.length > 0) {

                    let pageInfo;
                    let processedElements;

                    if (detectedV3Format) {
                      // V3 format - use pagesToLoad that was already created above
                      processedElements = elementsArray; // Already processed and flattened
                      
                      // Create page info from V3 format
                      pageInfo = {
                        totalPages: pagesToLoad.length,
                        pages: pagesToLoad.map((page: any, index: number) => ({
                          pageNumber: index + 1,
                          elements: page.elements,
                          containerId: page.id,
                          containerName: page.title
                        })),
                        processedElements: elementsArray
                      };
                    } else if (isEnhancedFormat) {
                      // Use existing page information from enhanced format
                      processedElements = elementsArray; // Already processed
                      
                      // Create page info from enhanced format
                      pageInfo = {
                        totalPages: moduleData.totalPages || 1,
                        pages: (moduleData.pages || []).map((page: any, index: number) => ({
                          pageNumber: page.pageNumber || index + 1,
                          elements: page.elementIds ? 
                            elementsArray.filter((el: any) => page.elementIds.includes(el.id)) : 
                            elementsArray,
                          containerId: page.containerId || `page-${index + 1}`,
                          containerName: page.title || `Page ${index + 1}`
                        })),
                        processedElements: elementsArray
                      };
                    } else {
                      // Parse module content and assign page numbers (legacy format)
                      const moduleContentString = JSON.stringify(elementsArray);
                      pageInfo = parseModulePages(moduleContentString);
                      processedElements = pageInfo.processedElements;
                    }

                    // Create proper SavedProject structure for importProject
                    const projectData = {
                      id: moduleContext.courseId || foundModule.id || uuidv4(),
                      title: foundModule.title,
                      description: '', // Module doesn't have description property
                      type: (moduleContext.moduleType === 'ACADEMIC' ? 'Academico' : 'Evaluativo') as 'Academico' | 'Evaluativo',
                      elements: processedElements, // Use processed elements
                      thumbnail: '',
                      createdAt: foundModule.createdAt || new Date().toISOString(),
                      updatedAt: new Date().toISOString(), // Module doesn't have updatedAt property
                      status: 'DRAFT',
                      version: 1,
                      // Create pages array for the existing page navigation system
                      pages: pageInfo.pages.map((page: any, index: number) => ({
                        id: page.containerId || `page-${index + 1}`,
                        title: page.containerName,
                        elements: page.elements,
                        order: index,
                        createdAt: new Date(foundModule.createdAt || new Date()),
                        updatedAt: new Date()
                      }))
                    };
                    
                    const importResult = stableImportProject(JSON.stringify(projectData));
                    
                    // Mark this module as loaded to prevent reload loops
                    loadedModuleRef.current = moduleContext.moduleId;
                  } else {
                  }
                } catch (parseError) {
                  // console.error('❌ Error parsing module content JSON:', parseError);
                  if (foundModule.content.includes('elements')) {
                  }
                }
              } else {
              }
            } else {
              // console.warn('⚠️ Module not found:', moduleContext.moduleId);
            }
          } else {
            // console.error('❌ Error loading modules:', modulesResponse.error);
          }
        } catch (error) {
          // console.error('❌ Error loading module content:', error);
        }
      }
    };
    
    loadModuleContent();
  }, [moduleContext.courseId, moduleContext.moduleId, moduleContext.action, stableCreateNewProject, stableImportProject]);

  // Reset builder when creating a new module
  useEffect(() => {
    if (moduleContext.courseId && moduleContext.moduleId && moduleContext.action === 'new-module') {
      stableCreateNewProject();
      loadedModuleRef.current = null; // Reset loaded state for new module
    }
  }, [moduleContext.courseId, moduleContext.moduleId, moduleContext.action, stableCreateNewProject]);
};
