import React, { useMemo, useEffect, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { BuilderProvider } from '../context/BuilderContext';
import { CourseProvider } from '../context/CourseContext';
import { ToastProvider } from '../context/ToastContext';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { PropertyPanel } from './PropertyPanel';
import { Toolbar } from './Toolbar';
import { FloatingLayersPanel } from './FloatingLayersPanel';
import { useBuilder } from '../hooks/useBuilder';
import { DraftModuleService } from '../services/draftModuleService';
import Alert from '../../ui/components/Alert';
import { ImageUploadModal } from '../components/ImageWidget';
import { ImageChoiceModal } from '../components/ImageChoiceModal';
import { VideoChoiceModal } from '../components/VideoChoiceModal';
import { AudioChoiceModal } from '../components/AudioChoiceModal';
import { ContainerTemplateModal } from '../components/ContainerTemplateModal';
import { ConnectionLineManager } from '../components/ConnectionLineManager';
import { createBoundaryCollisionDetection } from '../utils/collisionDetection';
import { BoundaryIndicator } from '../components/BoundaryIndicator';

// Partitioned components and hooks
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useBoundaryConstraints } from './hooks/useBoundaryConstraints';
import { useImageModal } from './hooks/useImageModal';
import { useVideoModal } from './hooks/useVideoModal';
import { useAudioModal } from './hooks/useAudioModal';
import { useContainerTemplateModal } from './hooks/useContainerTemplateModal';
import { useAdaptiveContainerResize } from './hooks/useAdaptiveContainerResize';
import { PageBuilderDragOverlay } from './components/PageBuilderDragOverlay'; // Re-enabled for better performance
import { KeyboardShortcutsInfo } from './components/KeyboardShortcutsInfo';

// Import partitioned CSS
import '../styles/index.css';

export interface PageBuilderProps {
  className?: string;
}

const PageBuilderContent: React.FC<PageBuilderProps> = ({ className = '' }) => {
  const { elements, course, currentPage, sidebarVisible, propertyPanelVisible, selectedElementId } = useBuilder();

  // Alert state for save notifications
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');

  // Helper function to show alerts
  const showSaveAlert = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Helper function to reset alerts
  const resetAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };
  // Compute hasContainers once here to avoid Sidebar re-renders
  const hasContainers = useMemo(() => {
    return elements.filter(el => el.type === 'container').length > 0;
  }, [elements.filter(el => el.type === 'container').length]); // Only depend on container count, not element properties  // Determine property panel width based on selected element
  const propertyPanelWidth = useMemo(() => {
    if (!propertyPanelVisible) return 0;

    const selectedElement = elements.find(el => el.id === selectedElementId);
    const isTextElement = selectedElement?.type === 'text' ||
      selectedElement?.type === 'heading' || selectedElement?.type === 'paragraph';
    const isButtonElement = selectedElement?.type === 'button';
    const isContainerElement = selectedElement?.type === 'container' ||
      selectedElement?.type === 'simple-container';
    const isAudioTrueFalseElement = selectedElement?.type === 'audio-true-false';
    const isAreaTrueFalseElement = selectedElement?.type === 'area-true-false';
    const isFillInBlanksElement = selectedElement?.type === 'fill-in-blanks';
    const isSingleChoiceElement = selectedElement?.type === 'single-choice';
    const isSingleChoiceWithButtonCustomization = isSingleChoiceElement && 
      (selectedElement?.properties as any)?.optionStyle === 'button';

    // Use wider panel for complex elements that need more space
    const needsWidePanel = isTextElement || isButtonElement || isContainerElement || 
      isAudioTrueFalseElement || isAreaTrueFalseElement || isFillInBlanksElement || isSingleChoiceElement;
    
    // Single-choice with button customization uses same width as containers (no extra-wide needed)
    const needsExtraWidePanel = false; // Removed - use same width as containers
    
    let baseWidth = 350; // Default width
    if (needsWidePanel) {
      baseWidth = 450; // Same as containers
    }
    
    const finalWidth = Math.max(300, Math.min(baseWidth, window.innerWidth * 0.45)); // Back to 45% limit

    return finalWidth;
  }, [propertyPanelVisible, selectedElementId, elements]);  // Calculate actual canvas width for container positioning
  const canvasWidth = useMemo(() => {
    if (typeof window === 'undefined') return 800; // SSR fallback

    // Calculate total available width for canvas content
    const totalWidth = window.innerWidth;
    const sidebarWidth = sidebarVisible ? 256 : 0;
    const panelWidth = propertyPanelVisible ? propertyPanelWidth : 0;

    // Canvas takes remaining width (no additional padding subtracted here since Canvas component handles its own padding)
    const calculatedWidth = totalWidth - sidebarWidth - panelWidth;

    return calculatedWidth;
  }, [sidebarVisible, propertyPanelVisible, propertyPanelWidth]);
  // Additional effect to check actual DOM canvas width after layout changes
  useEffect(() => {
    // Container position adjustments are now handled by individual ResizableContainer components
    // to avoid duplicate logic and ensure proper responsiveness
  }, [canvasWidth, sidebarVisible, propertyPanelVisible]);
  // Container position adjustments are now handled by individual ResizableContainer components
  // to avoid duplicate logic and ensure proper responsiveness

  // Image modal management
  const {
    imageModalOpen,
    imageChoiceModalOpen,
    fileManagerImageUrl,
    imageModalContext,
    openImageChoiceModal,
    handleImageUseChoice,
    handleModalClose,
    handleImageSelect,
    handleFileManagerSelect,
  } = useImageModal();

  // Video modal management
  const {
    videoChoiceModalOpen,
    openVideoChoiceModal,
    handleModalClose: handleVideoModalClose,
    handleVideoChoice,
  } = useVideoModal();

  // Audio modal management
  const {
    audioChoiceModalOpen,
    openAudioChoiceModal,
    handleModalClose: handleAudioModalClose,
    handleAudioChoice,
  } = useAudioModal();

  // Container template modal management
  const {
    containerTemplateModalOpen,
    openContainerTemplateModal,
    handleModalClose: handleContainerModalClose,
    handleTemplateSelect,
  } = useContainerTemplateModal(canvasWidth);

  // Adaptive container resizing when panels are hidden/shown
  const { resizeAndCenterContainers } = useAdaptiveContainerResize();

  // Drag and drop functionality
  const {
    activeId, // Needed for constraint feedback
    dragSource,
    draggedElement, // Re-enabled for drag overlay
    handleDragStart,
    handleDragEnd,
  } = useDragAndDrop(openImageChoiceModal, openVideoChoiceModal, openAudioChoiceModal, openContainerTemplateModal);

  // Boundary constraints
  const {
    boundaryConstraint,
    constrainToParent,
    resetBoundaryConstraint,
  } = useBoundaryConstraints(dragSource);

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Reduced from 3 to make dragging more responsive
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Collision detection - only recompute when element structure changes
  const elementStructure = useMemo(() => {
    return elements.map(el => ({ id: el.id, parentId: el.parentId }));
  }, [elements.map(el => `${el.id}:${el.parentId || 'root'}`).join('|')]);

  const collisionDetection = useMemo(() => {
    return createBoundaryCollisionDetection(
      elements,
      (elementId: string) => {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        return element ? element.getBoundingClientRect() : null;
      },
      undefined, // onBoundaryHit callback
      dragSource // Pass the current drag source
    );
  }, [elementStructure, dragSource]);

  // Reset boundary constraint on drag end
  const handleDragEndWithReset = (event: any) => {
    handleDragEnd(event);
    resetBoundaryConstraint();
  };

  // Global save event listener for module content
  useEffect(() => {
    const handleSaveModule = async () => {

      try {
        // Get URL parameters to identify the current module
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');
        const moduleId = urlParams.get('moduleId');

        if (!courseId || !moduleId) {
          // console.error('❌ Missing courseId or moduleId');
          showSaveAlert('Error: No se pudo identificar el módulo a guardar', 'error');
          return;
        }

        // 🚀 Enhanced: Create V3 format for multi-page modules, V2 for compatibility
        const coursePages = course?.pages || [];
        const currentPageElements = elements || [];
        
        
        let enhancedModuleContent: any;
        
        if (coursePages.length > 1) {
          // Multi-page module - use V3 format for proper pagination
          

          
          enhancedModuleContent = {
            content: {
              pages: {} as any,
              metadata: {
                courseId: courseId,
                moduleId: moduleId,
                totalPages: coursePages.length
              }
            }
          };
          
          // Helper function to organize elements hierarchically (with fallback to flat structure)
          const organizeElementsHierarchically = (elements: any[]) => {
            if (!Array.isArray(elements)) {
              // console.warn('⚠️ organizeElementsHierarchically: elements is not an array, returning empty array');
              return [];
            }
            
            try {

              
              // Step 1: Separate root elements from child elements
              const rootElements: any[] = [];
              const childElementsMap: { [parentId: string]: any[] } = {};
              
              elements.forEach(element => {
                if (!element) {
                  // console.warn('⚠️ Found null/undefined element, skipping');
                  return;
                }
                
                if (!element.parentId || element.parentId === '' || element.parentId === null) {
                  rootElements.push(element);
                } else {
                  // Group children by parentId
                  if (!childElementsMap[element.parentId]) {
                    childElementsMap[element.parentId] = [];
                  }
                  childElementsMap[element.parentId].push(element);
                }
              });
              
              
              // Step 2: For each root element, find and attach its children recursively
              const organizeElementRecursively = (element: any): any => {
                const elementChildren = childElementsMap[element.id] || [];
                
                if (elementChildren.length > 0) {
                  // Recursively organize children (in case children have their own children)
                  const organizedChildren = elementChildren.map(child => organizeElementRecursively(child));
                  
                  return {
                    ...element,
                    children: organizedChildren
                  };
                } else {
                  return element;
                }
              };
              
              const organizedElements = rootElements.map(organizeElementRecursively);
              
              return organizedElements;
              
            } catch (error) {
              // console.error('❌ Error in organizeElementsHierarchically:', error);
              return elements; // Fallback to original elements
            }
          };
          
          // Helper function to flatten hierarchical elements back to flat structure if needed
          const flattenHierarchicalElements = (elements: any[]) => {
            if (!Array.isArray(elements)) {
              // console.warn('⚠️ flattenHierarchicalElements: elements is not an array, returning empty array');
              return [];
            }
            
            try {
              const flatElements: any[] = [];
              
              elements.forEach(element => {
                if (!element) return;
                
                // Add the parent element (without children property)
                const { children, ...parentElement } = element;
                flatElements.push(parentElement);
                
                // Add all children as separate elements
                if (Array.isArray(children)) {
                  children.forEach(child => {
                    if (child) {
                      flatElements.push(child);
                    }
                  });
                }
              });
              

              return flatElements;
              
            } catch (error) {
              // console.error('❌ Error in flattenHierarchicalElements:', error);
              return elements; // Fallback to original elements
            }
          };
          
          // Map each course page to V3 structure with direct element storage
          coursePages.forEach((page: any, index: number) => {
            const pageId = `page-${index + 1}`; // Simplified page ID
            
            // 🔧 FIX: Use current builder elements for the active page, course page elements for others
            let pageElements = page.elements || [];
            const isCurrentPage = page.id === currentPage?.id;
            
            if (isCurrentPage && currentPageElements.length > 0) {
              // Use live builder elements for the current page
              pageElements = currentPageElements;
              
            } else {
              // Use stored elements for other pages
              
            }
            
            // 🚀 EXPERIMENTAL: For current page, try to get elements that belong to this page
            if (isCurrentPage) {
              // Try to filter elements that belong to this page specifically
              const pageSpecificElements = currentPageElements.filter((el: any) => {
                // Elements that don't have a parentId or have a parentId that exists in current elements
                return !el.parentId || currentPageElements.some((parent: any) => parent.id === el.parentId);
              });
              
              if (pageSpecificElements.length !== currentPageElements.length) {
                
                pageElements = pageSpecificElements;
              }
            }
            
            // Organize elements hierarchically (currently just passes through unchanged)
            const organizedElements = organizeElementsHierarchically(pageElements);
            
            enhancedModuleContent.content.pages[pageId] = {
              id: pageId,
              title: page.title || `Page ${index + 1}`,
              elements: organizedElements, // Use organized elements (currently same as pageElements)
              order: index + 1
            };
          });
          
        } else {
          // Single page module - use V2 format for backward compatibility

          
          enhancedModuleContent = {
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
            currentPage: coursePages.findIndex(p => p.id === currentPage?.id) + 1,
            totalPages: coursePages.length,
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              moduleId: moduleId
            }
          };
        }
        
        
        
        const currentContent = JSON.stringify(enhancedModuleContent);
        
        // Debug tracking
        const { debugSaveProcess } = await import('../utils/debug-save-process');
        debugSaveProcess.trackSaveFunction('PageBuilderRefactored.handleSaveModule', currentContent);

        

        if (moduleId.startsWith('draft-')) {
          // Save draft module to local storage
          const draftModule = DraftModuleService.getDraft(moduleId);
          if (draftModule) {
            const updatedDraft = {
              ...draftModule,
              content: currentContent,
              updatedAt: new Date().toISOString()
            };
            DraftModuleService.saveDraft(updatedDraft);

            showSaveAlert(`Módulo borrador "${draftModule.title}" guardado correctamente`, 'message');
          } else {
            // console.error('❌ Draft module not found');
            showSaveAlert('Error: Módulo borrador no encontrado', 'error');
          }
        } else {
          // Save published module to backend
          const { updateModule } = await import('../../actions/modules/modules');

          // We need to get the current module info to preserve other fields
          const { getModuleById } = await import('../../actions/modules/modules');
          const moduleResponse = await getModuleById(courseId, moduleId);

          if (moduleResponse.success && moduleResponse.data) {
            const currentModule = moduleResponse.data;
            const updateData = {
              type: currentModule.type,
              title: currentModule.title,
              description: currentModule.description,
              status: currentModule.status,
              content: currentContent
            };

            const response = await updateModule(courseId, moduleId, updateData);

            if (response.success) {
              showSaveAlert(`Módulo "${currentModule.title}" guardado correctamente`, 'message');
            } else {
              // console.error('❌ Failed to save module:', response.error);
              showSaveAlert(`Error al guardar el módulo: ${response.error || 'Error desconocido'}`, 'error');
            }
          } else {
            // console.error('❌ Failed to get current module data');
            showSaveAlert('Error: No se pudo obtener la información del módulo', 'error');
          }
        }

      } catch (error) {
        // console.error('❌ Save operation failed:', error);
        showSaveAlert(`Error al guardar: ${error.message || 'Error desconocido'}`, 'error');
      }
    };

    window.addEventListener('saveCurrentModule', handleSaveModule);
    return () => window.removeEventListener('saveCurrentModule', handleSaveModule);
  }, [elements, showSaveAlert]);

  return (
    <>
      {/* Save notification alert - always at the root, overlays everything */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="left-top"
          restartAlert={resetAlert}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndWithReset}
        // Disable drag overlay for drop-area elements
        modifiers={[
          constrainToParent,
          (args) => {
            // If dragging a drop-area element, disable the overlay
            if (activeId && !activeId.startsWith('new-')) {
              let elementId = activeId;
              if (activeId?.startsWith('container-handle-')) {
                elementId = activeId.replace('container-handle-', '');
              } else if (activeId?.startsWith('child-container-')) {
                elementId = activeId.replace('child-container-', '');
              }
              const element = elements.find(el => el.id === elementId);
              if (element && (element.type === 'drop-area' || element.type === 'drop-area-widget')) {
                // Return the original transform to keep element in place
                return args.transform;
              }
            }
            return args.transform;
          }
        ]}
      >
        <div className={`page-builder grid h-full w-full bg-gray-900 ${className}`} 
          style={{
            gridTemplateRows: 'auto 1fr',
            gridTemplateColumns: 'auto 1fr auto',
            gridTemplateAreas: `
              "toolbar toolbar toolbar"
              "sidebar canvas propertypanel"
            `,
            minHeight: '100vh',
          }}
          data-active-element-type={(() => {
            if (!activeId || activeId.startsWith('new-')) return undefined;
            let elementId = activeId;
            if (activeId?.startsWith('container-handle-')) {
              elementId = activeId.replace('container-handle-', '');
            } else if (activeId?.startsWith('child-container-')) {
              elementId = activeId.replace('child-container-', '');
            }
            const element = elements.find(el => el.id === elementId);
            return element?.type;
          })()}
        >
          {/* Toolbar (full width, top row) */}
          <div style={{ gridArea: 'toolbar', zIndex: 20 }}>
            <Toolbar />
          </div>

          {/* Sidebar (left column) */}
          <div
            className="page-builder-sidebar bg-gray-800 border-r border-gray-700"
            style={{
              gridArea: 'sidebar',
              width: sidebarVisible ? (
                typeof window !== 'undefined' && window.innerWidth <= 480 ? 200 :
                typeof window !== 'undefined' && window.innerWidth <= 640 ? 240 :
                typeof window !== 'undefined' && window.innerWidth <= 768 ? 280 :
                360
              ) : 0,
              minWidth: 0,
              zIndex: 10,
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1, minHeight: 0, height: '100%' }}>
              <Sidebar hasContainers={hasContainers} />
            </div>
          </div>

          {/* Canvas (center column) */}
          <div
            style={{
              gridArea: 'canvas',
              width: '100%',
              minWidth: 0,
              minHeight: 0,
              zIndex: 1,
              position: 'relative', // Ensure relative positioning for absolute children
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Shortcuts bar absolutely positioned at the top of the canvas */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 30,
                pointerEvents: 'none',
              }}
            >
              <KeyboardShortcutsInfo />
            </div>
            {/* Canvas content with top padding to avoid overlap with shortcuts bar */}
            <div style={{ flex: '1 1 auto', minHeight: 0, paddingTop: 48 }}>
              <Canvas
                canvasWidth={canvasWidth}
                isConstrained={boundaryConstraint.isConstrained}
                constraintType={boundaryConstraint.constraintType}
                draggedElementId={activeId}
                openImageChoiceModal={openImageChoiceModal}
              />
            </div>
          </div>

          {/* Property Panel (right column) */}
          <div
            className="page-builder-property-panel bg-gray-800 border-l border-gray-700"
            style={{
              gridArea: 'propertypanel',
              width: propertyPanelVisible ? propertyPanelWidth : 0,
              minWidth: 0,
              zIndex: 10,
              transition: 'width 0.2s',
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1, minHeight: 0, height: '100%' }}>
              <PropertyPanel 
                openImageChoiceModal={openImageChoiceModal} 
                openAudioChoiceModal={openAudioChoiceModal}
              />
            </div>
          </div>
        </div>
        {/* Drag Overlay - Re-enabled for better performance */}
        {activeId && (() => {
          
          // Don't show drag overlay for drop-area-widget elements
          if (!activeId.startsWith('new-')) {
            let elementId = activeId;
            
            if (activeId?.startsWith('container-handle-')) {
              elementId = activeId.replace('container-handle-', '');
            } else if (activeId?.startsWith('child-container-')) {
              elementId = activeId.replace('child-container-', '');
            }
            
            const element = elements.find(el => el.id === elementId);
            
            if (element && (element.type === 'drop-area-widget' || element.type === 'drop-area' || element.type === 'drop-area-content')) {
              return null;
            }
          }
          
          return (
            <PageBuilderDragOverlay
              activeId={activeId}
              dragSource={dragSource}
              elements={elements}
              draggedElement={draggedElement}
            />
          );
        })()}
        


        {/* Container Template Modal */}
        <ContainerTemplateModal
          isOpen={containerTemplateModalOpen}
          onClose={handleContainerModalClose}
          onTemplateSelect={handleTemplateSelect}
        />

        {/* Image Choice Modal */}
        <ImageChoiceModal
          isOpen={imageChoiceModalOpen}
          onClose={handleModalClose}
          onChoice={handleImageUseChoice}
          fileManagerImageUrl={fileManagerImageUrl}
          onFileManagerSelect={handleFileManagerSelect}
          context={imageModalContext}
        />

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={imageModalOpen}
          onClose={handleModalClose}
          onImageSelect={handleImageSelect}
        />

        {/* Video Choice Modal */}
        <VideoChoiceModal
          isOpen={videoChoiceModalOpen}
          onClose={handleVideoModalClose}
          onChoice={handleVideoChoice}
        />

        {/* Audio Choice Modal */}
        <AudioChoiceModal
          isOpen={audioChoiceModalOpen}
          onClose={handleAudioModalClose}
          onChoice={handleAudioChoice}
        />

        {/* Boundary constraint indicator */}
        <BoundaryIndicator
          isConstrained={boundaryConstraint.isConstrained}
          constraintType={boundaryConstraint.constraintType}
          parentName={boundaryConstraint.parentName}
        />

        {/* Floating Layers Panel */}
        <FloatingLayersPanel />

        {/* Connection Line Manager - for drawing lines between connection nodes */}
        <ConnectionLineManager />
      </DndContext>
    </>
  );
};

// Course integration component
const CourseIntegratedPageBuilder: React.FC<PageBuilderProps> = ({ className = '' }) => {
  const { importProject } = useBuilder();

  return (
    <CourseProvider
      onLoadElements={(elements) => {
        // Import elements directly into the builder
        if (elements.length > 0) {
          const exportData = {
            elements,
            version: '1.0',
            timestamp: new Date().toISOString()
          };
          importProject(JSON.stringify(exportData));
        } else {
          // Clear the canvas if no elements
          importProject(JSON.stringify({ elements: [], version: '1.0', timestamp: new Date().toISOString() }));
        }
      }}
      onSaveComplete={() => {
      }}
    >
      <PageBuilderContent className={className} />
    </CourseProvider>
  );
};

export const PageBuilder: React.FC<PageBuilderProps> = ({ className = '' }) => {
  return (
    <ToastProvider>
      <BuilderProvider>
        <CourseIntegratedPageBuilder className={className} />
      </BuilderProvider>
    </ToastProvider>
  );
};
