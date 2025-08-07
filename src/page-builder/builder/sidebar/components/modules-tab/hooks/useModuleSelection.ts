import { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '../../../../../hooks/useBuilder';
import { useSimpleUnsavedChanges } from '../../../../../hooks/useSimpleUnsavedChanges';
import { DraftModuleService } from '../../../../../services/draftModuleService';
import { getModuleById } from '../../../../../../actions/modules/modules';
import { useUrlParams } from './useUrlParams';

export const useModuleSelection = (
  showErrorAlert: (message: string) => void,
  loadModulesForCourse: (courseId: string, moduleId?: string | null) => Promise<void>
) => {
  const [currentModuleInfo, setCurrentModuleInfo] = useState<any>(null);
  const [isServerDown, setIsServerDown] = useState(false);
  const [waitingForInitialElements, setWaitingForInitialElements] = useState<string | null>(null);
  const { importProject, elements, course } = useBuilder();
  const { startTracking, stopTracking } = useSimpleUnsavedChanges();
  const { getUrlParams, updateUrlWithModule } = useUrlParams();

  // 🔧 NEW: Watch for elements changes after module load to set initial state
  useEffect(() => {
    if (waitingForInitialElements && elements.length > 0) {
      
      // Start tracking with the loaded elements
      startTracking(waitingForInitialElements, elements);
      setWaitingForInitialElements(null);
    }
  }, [elements, waitingForInitialElements, startTracking]);

  // Function to save current module changes before switching
  const saveCurrentModuleChanges = useCallback(async (currentModule: any) => {
    
    if (currentModule.isDraft) {
      // Save draft module to local storage
      try {
        const currentContent = JSON.stringify(elements);
        const draftModule = DraftModuleService.getDraft(currentModule.id);
        
        if (draftModule) {
          // Preserve all original module information, only update content and timestamp
          const updatedDraft = {
            ...draftModule, // Keep all original data
            content: currentContent, // Update only content
            updatedAt: new Date().toISOString() // Update timestamp
          };
          DraftModuleService.saveDraft(updatedDraft);
        } else {
          // console.warn('⚠️ Draft module not found in local storage:', currentModule.id);
          throw new Error('Módulo borrador no encontrado en almacenamiento local');
        }
      } catch (error) {
        // console.error('❌ Error saving draft module:', error);
        throw new Error('Error al guardar módulo borrador: ' + (error.message || 'Error desconocido'));
      }
    } else {
      // Save published module to backend
      try {
        // Import the page parser to create enhanced module content
        const { parseModulePages } = await import('../../../../../utils/modulePageParser');
        
        // 🚀 Enhanced: Create V3 format for multi-page modules, V2 for compatibility
        const coursePages = course?.pages || [];
        const currentPageElements = elements || [];
        
        let moduleContent: any;
        
        if (coursePages.length > 1) {
          // Multi-page module - use V3 format for proper pagination
          
          moduleContent = {
            version: 3,
            content: {
              pages: {} as any,
              currentPageId: '',
              totalPages: coursePages.length,
              metadata: {
                moduleId: currentModule.id,
                courseId: currentModule.courseId,
                createdAt: currentModule.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          };
          
          // Map each course page to V3 structure with direct element storage
          coursePages.forEach((page: any, index: number) => {
            const pageId = `${currentModule.id}-page-${index + 1}`;
            
            // 🔧 FIX: Use current builder elements for the active page, course page elements for others
            let pageElements = page.elements || [];
            // Note: We don't have currentPage context here, so we'll use stored elements for now
            // This hook is typically used for background saves, not active editing
            
            moduleContent.content.pages[pageId] = {
              id: pageId,
              title: page.title || `Page ${index + 1}`,
              elements: pageElements, // Direct element storage
              order: index + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });
          
          // Set current page to first page or active page
          const firstPageId = Object.keys(moduleContent.content.pages)[0];
          moduleContent.content.currentPageId = firstPageId;
          
        } else {
          // Single page module - use V2 format for backward compatibility
          
          moduleContent = {
            version: 2,
            elements: currentPageElements,
            pages: coursePages.map((page: any, index: number) => ({
              id: page.id,
              title: page.title,
              pageNumber: index + 1,
              containerId: page.id,
              elementIds: page.elements?.map((el: any) => el.id) || [],
              order: page.order || index
            })),
            currentPage: 1,
            totalPages: coursePages.length,
            metadata: {
              createdAt: currentModule.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              moduleId: currentModule.id
            }
          };
        }
        
        const currentContent = JSON.stringify(moduleContent);
        const { updateModule } = await import('../../../../../../actions/modules/modules');
        
        // Preserve all original module information, only update content
        const updateData = {
          type: currentModule.type,
          title: currentModule.title,
          description: currentModule.description,
          status: currentModule.status,
          content: currentContent // Enhanced content with page structure
          // Preserve any other fields that might exist
        };
        
        const response = await updateModule(currentModule.courseId, currentModule.id, updateData);
        
        if (!response.success) {
          // console.error('❌ Backend returned error:', response.error);
          throw new Error(response.error || 'Error del servidor al actualizar módulo');
        }
        
      } catch (error: any) {
        // console.error('❌ Error saving published module:', error);
        throw new Error('Error al guardar módulo publicado: ' + (error.message || 'Error desconocido'));
      }
    }
  }, [elements]);

  // Helper function to load empty project
  const loadEmptyProject = useCallback((module: any) => {
    const emptyProjectData = {
      id: module.id,
      title: module.title,
      description: module.description || `Draft module: ${module.title}`,
      type: module.type,
      elements: [],
      courseId: module.courseId,
      createdAt: module.createdAt || new Date().toISOString(),
      updatedAt: module.updatedAt || new Date().toISOString(),
      pages: [{
        id: `${module.id}-page-1`,
        title: 'Page 1',
        elements: [],
        order: 0
      }]
    };
    
    importProject(JSON.stringify(emptyProjectData));
    
    // 🔧 FIX: For empty project, start tracking with empty elements
    startTracking(module.id, []);
  }, [importProject, startTracking]);

  const handleModuleSelect = useCallback(async (module: any, forceReload: boolean = false) => {
    
    // Prevent module switching if server is down
    if (isServerDown && !module.isDraft) {
      showErrorAlert('No se puede cambiar de módulo: El servidor no está disponible');
      return;
    }

    try {
      
      // Check if we're selecting the same module that's already selected
      // Skip this check if forceReload is true
      if (!forceReload && currentModuleInfo && currentModuleInfo.id === module.id) {
        return; // Don't reload content, just keep current state
      }
      
      if (forceReload) {
      } else {
      }
      
      // Step 1: Save current module changes if there's a current module and elements
      // Skip saving when force reloading since we want to reload from database
      if (!forceReload && currentModuleInfo && elements && elements.length > 0) {
        try {
          await saveCurrentModuleChanges(currentModuleInfo);
        } catch (saveError: any) {
          // console.error('❌ Error saving current module changes:', saveError);
          // console.error('❌ Save error details:', {
          //   message: saveError.message,
          //   stack: saveError.stack,
          //   moduleId: currentModuleInfo?.id,
          //   elementsCount: elements?.length || 0,
          //   moduleType: currentModuleInfo?.isDraft ? 'DRAFT' : 'PUBLISHED'
          // });
          showErrorAlert(`Error al guardar los cambios del módulo actual: ${saveError.message || 'Error desconocido'}`);
          // Don't return here - continue with module selection even if save fails
        }
      } else if (forceReload) {
      }
      
      // Step 2: Always load the selected module content from backend (draft or published)
      let contentLoaded = false;
      const { courseId } = getUrlParams();
      if (courseId) {
        try {
          // Fetch module content from backend
          const response = await getModuleById(courseId, module.id);
          
          if (response.success && response.data) {
            // Server is working, clear server down flag
            setIsServerDown(false);
            
            const moduleData = response.data;
            
            if (moduleData.content) {
              
              try {
                // Parse the content and load into builder
                const parsedContent = JSON.parse(moduleData.content);
                
                // Handle all content formats with V3 migration
                let elementsToLoad = [];
                let pagesToLoad = [];
                
                // Detect V3 format: either old format (version === 3) or new clean format (has content.pages structure)
                const isV3Format = (parsedContent.version === 3 && parsedContent.content) || 
                                 (parsedContent.content && parsedContent.content.pages);
                
                if (isV3Format) {
                  // V3 format - use current page elements (handle both old and new V3 format)
                  
                  // Handle currentPageId for backward compatibility
                  const currentPageId = parsedContent.content.currentPageId || 
                                      Object.keys(parsedContent.content.pages)[0] || 
                                      'page-1';
                  
                  // 🔍 DEBUG: Check what's actually in the V3 database data
                  // Object.values(parsedContent.content.pages).forEach((page: any) => {
                  
                  const currentPage = parsedContent.content.pages[currentPageId];
                  
                  // 🔧 FIX: For V3 format, load only current page elements
                  // The page switching will handle loading other pages
                  elementsToLoad = currentPage?.elements || [];
                  
                  // Flatten hierarchical elements if they have children
                  const flattenedElements = [];
                  elementsToLoad.forEach(element => {
                    if (element) {
                      // Add the parent element (without children property to avoid conflicts)
                      const { children, ...parentElement } = element;
                      flattenedElements.push(parentElement);
                      
                      // Add all children as separate elements
                      if (Array.isArray(children)) {
                        children.forEach(child => {
                          if (child) {
                            flattenedElements.push(child);
                          }
                        });
                      }
                    }
                  });
                  
                  elementsToLoad = flattenedElements;
                  
                  // Create pages array for course builder compatibility
                  pagesToLoad = Object.values(parsedContent.content.pages)
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
                  
                  // 🔍 DEBUG: Verify V3 pages mapping is correct
                  pagesToLoad.forEach((page: any, index: number) => {
                  });
                  
                } else if (parsedContent.version === 2 && parsedContent.elements) {
                  // Enhanced format - extract elements and pages
                  elementsToLoad = parsedContent.elements;
                  pagesToLoad = parsedContent.pages || [];
                } else if (Array.isArray(parsedContent)) {
                  // Legacy format - direct array of elements
                  elementsToLoad = parsedContent;
                  pagesToLoad = [{
                    id: `${moduleData.id}-page-1`,
                    title: 'Page 1',
                    elements: parsedContent,
                    order: 0
                  }];
                } else {
                }
                
                if (Array.isArray(elementsToLoad)) {
                }
                
                // Create proper project structure for importProject
                const projectData = {
                  id: moduleData.id,
                  title: moduleData.title,
                  description: moduleData.description || moduleData.title,
                  type: moduleData.type,
                  elements: elementsToLoad,
                  courseId: moduleData.courseId || courseId,
                  createdAt: moduleData.createdAt,
                  updatedAt: moduleData.updatedAt,
                  pages: pagesToLoad.map((page: any, index: number) => {
                    
                    // 🔧 FIX: Handle V3 pages differently - they already have elements directly
                    let mappedElements;
                    
                    if (page.isV3Page && page.elements) {
                      // V3 pages already have elements directly - use them as-is
                      mappedElements = page.elements;
                    } else {
                      // V2 pages - use the old elementIds mapping logic
                      mappedElements = page.elementIds && page.elementIds.length > 0
                        ? page.elementIds.map((id: string) => {
                            const el = elementsToLoad.find((e: any) => e.id === id);
                            if (!el) {
                              // console.warn(`Element with id ${id} not found for page ${page.title}`);
                            }
                            return el;
                          }).filter((e: any) => e != null) as any[]
                        : elementsToLoad;
                    }
                    
                    const mappedPage = {
                      id: page.id || `page-${index + 1}`,
                      title: page.title || `Page ${index + 1}`,
                      elements: mappedElements,
                      order: page.order || index,
                      createdAt: new Date(moduleData.createdAt || new Date()),
                      updatedAt: new Date(moduleData.updatedAt || new Date())
                    };
                    return mappedPage;
                  })
                };
                
                // Debug tracking
                const { debugPageLoading } = await import('../../../../../utils/debug-page-loading');
                debugPageLoading.trackProjectData(projectData);
                
                // Import the project with proper structure
                importProject(JSON.stringify(projectData));
                
                // 🔧 FIX: Set flag to wait for elements to load, then set initial state
                setWaitingForInitialElements(module.id);
                
                contentLoaded = true;
              } catch (parseError: any) {
                // console.error('❌ Error parsing module content:', parseError);
                // console.error('❌ Parse error details:', {
                //   message: parseError.message,
                //   stack: parseError.stack,
                //   rawContent: moduleData.content
                // });
                loadEmptyProject(module);
                contentLoaded = true;
              }
            } else {
              loadEmptyProject(module);
              contentLoaded = true;
            }
          } else {
            // Check if this is a server error (500, 503, etc.)
            if (response.statusCode && response.statusCode >= 500) {
              // console.error('❌ Server error detected:', response.statusCode);
              setIsServerDown(true);
              showErrorAlert('Servidor no disponible. Solo se pueden editar módulos borradores.');
              return; // Don't proceed with module selection
            } else {
              // console.error('❌ Error loading module:', response.error || 'Unknown error');
              showErrorAlert('Error al cargar el módulo');
              return; // Don't proceed with module selection
            }
          }
        } catch (error: any) {
          // console.error('❌ Network error loading module:', error);
          setIsServerDown(true);
          showErrorAlert('Error de conexión. Solo se pueden editar módulos borradores.');
          return; // Don't proceed with module selection
        }
      } else {
        // console.error('❌ No courseId found in URL params');
        showErrorAlert('Error: No se encontró el ID del curso');
        return;
      }
      
      // Step 3: Update UI state AFTER content is loaded
      if (contentLoaded) {
        setCurrentModuleInfo(module);
        
        // Step 4: Update URL
        updateUrlWithModule(module.id);
      } else {
        // console.error('❌ Content was not loaded successfully');
      }
      
    } catch (error: any) {
      // console.error('❌ Error in handleModuleSelect:', error);
      showErrorAlert('Error al cargar el módulo');
    }
  }, [currentModuleInfo, elements, saveCurrentModuleChanges, showErrorAlert, updateUrlWithModule, getUrlParams, importProject, loadEmptyProject, isServerDown]);

  // Listen for tab switches - OPTIMIZED to preserve page state
  useEffect(() => {
    const handleTabSwitch = (event: CustomEvent) => {
      const { fromTab, toTab } = event.detail;
      
      // 🎯 OPTIMIZATION: Since components no longer re-mount, we don't need to reload
      if (fromTab === 'elements' && toTab === 'modules' && currentModuleInfo) {
        
        // ❌ DISABLED: The reload that was causing page reset
        // Previously this would call: handleModuleSelect(currentModuleInfo, true);
        // This is no longer needed since the component stays mounted
      }
    };

    window.addEventListener('sidebarTabSwitch', handleTabSwitch as EventListener);
    return () => window.removeEventListener('sidebarTabSwitch', handleTabSwitch as EventListener);
  }, [currentModuleInfo]);

  return {
    currentModuleInfo,
    setCurrentModuleInfo,
    handleModuleSelect,
    saveCurrentModuleChanges,
    isServerDown
  };
};
