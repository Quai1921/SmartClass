import { useCallback, useState, useRef } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBuilder } from '../../hooks/useBuilder';
import { createElementFromType, createTemporaryElementFromType, createConnectionNodePair } from '../../utils/elementFactory';

export const useDragAndDrop = (
  openImageChoiceModal: (containerId: string) => void,
  openVideoChoiceModal: (containerId: string) => void,
  openAudioChoiceModal: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND', elementType?: 'audio' | 'audio-true-false') => void,
  openContainerTemplateModal?: () => void
) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<'handle' | 'body' | 'sidebar'>('sidebar');
  const [draggedElement, setDraggedElement] = useState<any>(null);

  const {
    elements,
    addElement,
    updateElement,
    moveElement,
    selectElement
  } = useBuilder();
  // Capture initial absolute position of dragged element
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);
  // Near top, define ref to store handleOffset
  const handleOffsetRef = useRef<{x:number,y:number}|null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    
    setActiveId(active.id.toString());
    
    // Detect drag source
    let source: 'handle' | 'body' | 'sidebar' = 'sidebar';
    if (active.id.toString().startsWith('new-')) {
      setDragSource('sidebar');
      // For new elements from sidebar, create a temporary element for the overlay
      const elementType = active.id.toString().replace('new-', '') as any;
      const dragData = active.data?.current;
    
      
      // Create temporary element with custom properties if available
      let tempElement;
      if (dragData?.level && elementType === 'heading') {
        tempElement = createTemporaryElementFromType(elementType, undefined, { level: dragData.level });
      } else {
        tempElement = createTemporaryElementFromType(elementType);
      }
      
      setDraggedElement(tempElement);
    } else {
      // For existing elements, default to 'body' drag and detect if it's a handle drag
      source = 'body'; // Default to body drag for existing elements
      
      let target: HTMLElement | null = null;
      if (event.activatorEvent && 'target' in event.activatorEvent) {
        target = event.activatorEvent.target as HTMLElement;
        const dragSourceAttr = target.closest('[data-drag-source]')?.getAttribute('data-drag-source');
        if (dragSourceAttr === 'handle') {
          source = 'handle';
        } else if (dragSourceAttr === 'body') {
          source = 'body';
        }
        
        // Additional detection: check if clicked on drag handle elements
        const isHandleElement = target.closest('.reposition-handle') || 
                               target.closest('.drag-handle') ||
                               target.classList.contains('reposition-handle') ||
                               target.classList.contains('drag-handle');
        
        if (isHandleElement) {
          source = 'handle';
        }
      }
      setDragSource(source);
      
      // For existing elements, set the actual element as draggedElement
      const existingElement = elements.find(el => el.id === active.id.toString());
      if (existingElement) {
        setDraggedElement(existingElement);
        
        // Capture initial absolute position for accurate drop positioning
        if (event.activatorEvent && 'clientX' in event.activatorEvent && 'clientY' in event.activatorEvent) {
          const mouseEvent = event.activatorEvent as MouseEvent;
          initialPositionRef.current = {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY
          };
        }
      }
      
      // In handleDragStart after setActiveId, if active.id starts with 'container-handle-'
      if(active.id.toString().startsWith('container-handle-')){
        const handleEvent = event.activatorEvent as MouseEvent;
        const targetEl = (handleEvent?.target as HTMLElement)?.closest('.resizable-container') as HTMLElement | null;
        if(targetEl){
          const rect= targetEl.getBoundingClientRect();
          handleOffsetRef.current = {x: handleEvent.clientX - rect.left, y: handleEvent.clientY - rect.top};
        }
      }
    }
  }, [setDraggedElement, elements]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    setActiveId(null);
    // DON'T reset dragSource here - we need it for the repositioning logic!
    // setDragSource('sidebar'); // <-- This was causing the bug!
    setDraggedElement(null);
    
    // Reset initial position reference
    initialPositionRef.current = null;

    if (!over) {
      return;
    }

    // Handle reordering existing elements
    if (!active.id.toString().startsWith('new-')) {
      let activeElementId = active.id.toString();
      
      // Handle child container IDs that have prefixes
      if (activeElementId.startsWith('child-container-')) {
        activeElementId = activeElementId.replace('child-container-', '');
      } else if (activeElementId.startsWith('container-handle-')) {
        activeElementId = activeElementId.replace('container-handle-', '');
      }
      
      const activeElement = elements.find(el => el.id === activeElementId);
      
      if (!activeElement) {
        return;
      }
      // Detect actual drag source from the event data instead of relying on state
      let actualDragSource: 'handle' | 'body' | 'sidebar' = 'body'; // Default for existing elements
      if (event.activatorEvent && 'target' in event.activatorEvent) {
        const target = event.activatorEvent.target as HTMLElement;
        const dragSourceAttr = target.closest('[data-drag-source]')?.getAttribute('data-drag-source');
        const isHandleElement = target.closest('.reposition-handle') || 
                               target.closest('.drag-handle') ||
                               target.classList.contains('reposition-handle') ||
                               target.classList.contains('drag-handle');
        
        if (dragSourceAttr === 'handle' || isHandleElement) {
          actualDragSource = 'handle';
        } else {
          actualDragSource = 'body';
        }
      }

      // 🆕 DRAG-DROP WIDGET OWNERSHIP VALIDATION
      // Check if the element belongs to a specific drag-drop widget or if it's being dropped into one
      const elementOwner = activeElement.properties?.ownedBy || activeElement.properties?.dragDropOwner;
      const targetDropZone = over?.data?.current;
      
      // Handle drops into drag-drop widgets
      if (targetDropZone?.type === 'drag-drop-widget' || targetDropZone?.elementType === 'drag-drop-widget') {
        const targetOwnerId = targetDropZone.ownerId || targetDropZone.elementId;
        const targetWidget = elements.find(el => el.id === targetOwnerId);
        
        // Check capacity limits before allowing drop
        if (targetWidget) {
          const maxItems = targetWidget.properties?.maxItems || 0;
          if (maxItems > 0) {
            // Count current direct children in the target widget
            const currentChildrenCount = elements.filter(el => el.parentId === targetOwnerId).length;
            
            // If this element is not already a child and adding it would exceed capacity, reject the drop
            if (activeElement.parentId !== targetOwnerId && currentChildrenCount >= maxItems) {
              // Snap back to original position
              const originalPos = activeElement.properties?.originalPosition;
              if (originalPos) {
                updateElement(activeElementId, {
                  properties: {
                    ...activeElement.properties,
                    left: originalPos.x,
                    top: originalPos.y,
                  }
                });
              } else {
              }
              return; // Prevent the drop
            }
          }
        }
        
        if (elementOwner && elementOwner !== targetOwnerId) {
          // Element belongs to a different drag-drop widget - prevent drop
          // Snap back to original position
          const originalPos = activeElement.properties?.originalPosition;
          if (originalPos) {
            updateElement(activeElementId, {
              properties: {
                ...activeElement.properties,
                left: originalPos.x,
                top: originalPos.y,
              }
            });
          } else {
          }
          return; // Prevent the drop
        } else {
          // Either element has no owner (newly created) or belongs to this widget
          // Handle positioning within the widget and set ownership
          const targetWidget = elements.find(el => el.id === targetOwnerId);
          if (targetWidget) {
            const widgetLeft = Number(targetWidget.properties?.left) || 0;
            const widgetTop = Number(targetWidget.properties?.top) || 0;
            const widgetWidth = Number(targetWidget.properties?.width) || 300;
            const widgetHeight = Number(targetWidget.properties?.height) || 200;
            let relativeLeft: number;
            let relativeTop: number;
            
            // Try to use the drop coordinates from the drag event
            if (event.activatorEvent && 'clientX' in event.activatorEvent && 'clientY' in event.activatorEvent) {
              // Get the widget's actual screen position
              const widgetElement = document.querySelector(`[data-element-id="${targetOwnerId}"]`);
              if (widgetElement) {
                const widgetRect = widgetElement.getBoundingClientRect();
                
                // Use activator event + delta for more accurate positioning
                const mouseEvent = event.activatorEvent as MouseEvent;
                const finalX = mouseEvent.clientX + (delta?.x || 0);
                const finalY = mouseEvent.clientY + (delta?.y || 0);
                
                // Convert to widget-relative coordinates
                relativeLeft = finalX - widgetRect.left;
                relativeTop = finalY - widgetRect.top;
                
                // Adjust for element center (since we want to drop at cursor, not top-left)
                relativeLeft -= 40; // Half of element width (80px)
                relativeTop -= 40; // Half of element height (80px)
              } else {
                // Fallback: use element's current position relative to widget
                const elementLeft = Number(activeElement.properties?.left) || 0;
                const elementTop = Number(activeElement.properties?.top) || 0;
                relativeLeft = elementLeft - widgetLeft;
                relativeTop = elementTop - widgetTop;
              }
            } else {
              // Fallback: use element's current position relative to widget
              const elementLeft = Number(activeElement.properties?.left) || 0;
              const elementTop = Number(activeElement.properties?.top) || 0;
              relativeLeft = elementLeft - widgetLeft;
              relativeTop = elementTop - widgetTop;
            }
            
            // Constrain within widget bounds with proper margins
            const padding = 5; // Reduced padding for more space
            const headerHeight = 60;
            const elementSize = 80; // Standard element size
            
            // For elements already owned by this widget, be much more permissive with positioning
            const isElementAlreadyOwned = elementOwner === targetOwnerId;
            
            // Allow elements to go much higher if they're already owned by this widget
            // Only prevent overlap with the actual header area, not add extra padding
            const minTop = isElementAlreadyOwned ? 5 : headerHeight + padding; // Very permissive for owned elements
            const maxTop = widgetHeight - elementSize - padding;
            const minLeft = padding;
            const maxLeft = widgetWidth - elementSize - padding;
            
            // Apply constraints
            const constrainedLeft = Math.max(minLeft, Math.min(relativeLeft, maxLeft));
            const constrainedTop = Math.max(minTop, Math.min(relativeTop, maxTop));
            
            relativeLeft = constrainedLeft;
            relativeTop = constrainedTop;
            
            // Move element to be child of the widget with relative positioning and set ownership
            
            // Update with all properties at once to prevent React batching issues
            updateElement(activeElementId, {
              parentId: targetOwnerId, // Make it a child of the widget
              properties: {
                ...activeElement.properties,
                left: relativeLeft,
                top: relativeTop,
                // Set ownership immediately to prevent any interference
                ownedBy: targetOwnerId,
                dragDropOwner: targetOwnerId,
                // Update original position to new successful position for future snap-back
                originalPosition: { x: relativeLeft, y: relativeTop },
              }
            });
            
            // Add a delay to check if position gets overridden
            setTimeout(() => {
              const updatedElement = elements.find(el => el.id === activeElementId);
            }, 100);
            
            // Also check much sooner to see when the change happens
            setTimeout(() => {
              const updatedElement = elements.find(el => el.id === activeElementId);
            }, 10);
            
            return; // Important: return here to prevent further processing
          }
        }
      }
      
      if (elementOwner) {
        // Element has ownership but not dropping into a widget - handle constraints
        // For now, allow free movement but could add distance constraints here
      }
      
      // Handle repositioning within the same parent container - GENERAL CASE for all element types
      if ((over.data?.current?.type === 'container' && over.data.current.elementId === activeElement.parentId) ||
          (activeElement.parentId && over.id === activeElement.parentId)) {
        const { delta } = event;
        if (delta && (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1)) {
          const currentLeft = Number(activeElement.properties.left) || 0;
          const currentTop = Number(activeElement.properties.top) || 0;
          
          // COORDINATE TRANSFORMATION FIX:
          // The delta might be in viewport/screen coordinates, but we need container-relative coordinates
          let transformedDeltaX = delta.x;
          let transformedDeltaY = delta.y;
          
          // Validate delta values
          if (isNaN(delta.x) || isNaN(delta.y)) {
            return;
          }
          
          // Apply boundary constraints if parent exists
          if (activeElement.parentId) {
            const parentEl = document.querySelector(`[data-container-id="${activeElement.parentId}"]`) as HTMLElement;
            if (parentEl) {
              const parentRect = parentEl.getBoundingClientRect();
              
              // Get the current element to check its actual position
              const elementEl = document.querySelector(`[data-element-id="${activeElementId}"]`) as HTMLElement;
              if (elementEl) {
                const elementRect = elementEl.getBoundingClientRect();
                
                // For now, use the delta as-is (no transformation needed for simple cases)
                // The delta should already be in the correct coordinate space from dnd-kit
                transformedDeltaX = delta.x;
                transformedDeltaY = delta.y;
              }
            } else {
            }
          } else {
          }
          
          let newLeft = currentLeft + transformedDeltaX;
          let newTop = currentTop + transformedDeltaY;
          
          // Apply boundary constraints
          if (activeElement.parentId) {
            const parentEl = document.querySelector(`[data-container-id="${activeElement.parentId}"]`) as HTMLElement;
            if (parentEl) {
              const parentRect = parentEl.getBoundingClientRect();
              const elementWidth = Number(activeElement.properties.width) || 120;
              const elementHeight = Number(activeElement.properties.height) || 100;
              const padding = 8;
              const headerHeight = 40;
              
              newLeft = Math.max(padding, Math.min(newLeft, parentRect.width - elementWidth - padding));
              newTop = Math.max(headerHeight, Math.min(newTop, parentRect.height - elementHeight - padding));
            }
          }
          
          updateElement(activeElementId, {
            properties: {
              ...activeElement.properties,
              left: Math.round(newLeft),
              top: Math.round(newTop)
            }
          });
          
          // IMMEDIATE verification - check if state updated right away
          const immediateUpdatedElement = elements.find(el => el.id === activeElementId);
          
          // VERIFICATION: Check if the update actually took effect
          // Add a longer delay and use requestAnimationFrame to ensure DOM is fully updated
          const verifyUpdate = () => {
            const checkAndVerify = (attempt = 1, maxAttempts = 5) => {
              setTimeout(() => {
                const updatedElement = elements.find(el => el.id === activeElementId);
                
                // Try multiple query strategies to find the DOM element
                const domElement1 = document.querySelector(`[data-element-id="${activeElementId}"]`) as HTMLElement;
                const domElement2 = document.querySelector(`[data-widget-id="${activeElementId}"]`) as HTMLElement;
                const domElement3 = document.querySelector(`[id="${activeElementId}"]`) as HTMLElement;
                const domElement4 = document.querySelector(`[data-container-id="${activeElementId}"]`) as HTMLElement;
                
                // Additional queries for image-choice and other interactive widgets
                const domElement5 = document.querySelector(`.widget-resizable[data-element-type="${activeElement.type}"]`) as HTMLElement;
                const domElement6 = document.querySelector(`.element-wrapper[data-element-id="${activeElementId}"]`) as HTMLElement;
                const domElement7 = document.querySelector(`.resizable-container[data-element-id="${activeElementId}"]`) as HTMLElement;
                
                // Find any element that might be the one we're looking for
                const domElement = domElement1 || domElement2 || domElement3 || domElement4 || domElement5 || domElement6 || domElement7;
                
                // Check if the DOM element has been updated with the new position
                const hasPositionStyles = domElement && (
                  domElement.style.left || 
                  domElement.style.top || 
                  domElement.style.transform ||
                  domElement.style.position === 'absolute'
                );
                
                // If DOM hasn't updated yet and we have attempts left, try again
                if (!hasPositionStyles && attempt < maxAttempts) {
                  checkAndVerify(attempt + 1, maxAttempts);
                  return;
                }
                
                // Debug: Show all elements with data-element-id to see what's available
                const allElementsWithDataId = Array.from(document.querySelectorAll('[data-element-id]')).map(el => ({
                  id: el.getAttribute('data-element-id'),
                  tagName: el.tagName,
                  className: el.className
                }));
                
                // Get computed styles to see what React is actually applying
                const computedStyle = domElement ? window.getComputedStyle(domElement) : null;
              }, attempt * 100); // Increase delay with each attempt
            };
            
            checkAndVerify();
          };
          
          // Use requestAnimationFrame to ensure DOM updates are complete
          requestAnimationFrame(() => {
            requestAnimationFrame(verifyUpdate);
          });
          return;
        }
      }

      // Handle drop-area content specially - implement area validation
      // Check both the element type and the drag data type to be more robust
      if (activeElement && (
        activeElement.type === 'drop-area-content' as any || 
        activeElement.type === 'drop-area' as any ||
        activeElement.type === 'drop-area-widget' as any ||
        active.data?.current?.type === 'drop-area-content' ||
        active.data?.current?.type === 'drop-area' ||
        active.data?.current?.type === 'drop-area-widget'
      )) {
        
        // Prevent self-drop: drop-area elements cannot be dropped on themselves
        if (over && over.id === activeElementId) {
          return;
        }

        // Handle drop-area-widget validation - simpler than drop-area-content
        // if (activeElement.type === 'drop-area-widget') {
        // }
        
        // Handle drop-area-content validation
        if (activeElement.type === 'drop-area-content') {
          const belongsToArea = active.data?.current?.belongsToArea;
          const belongsToSpecificArea = active.data?.current?.belongsToSpecificArea || activeElement.properties?.belongsToSpecificArea;
          const createdByArea = active.data?.current?.createdByArea || activeElement.properties?.createdByArea;
          const canDropInAnyDropArea = active.data?.current?.canDropInAnyDropArea;
          const isCurrentlyInDropArea = activeElement.parentId && elements.find(el => el.id === activeElement.parentId && el.type === 'drop-area');
          const draggedContentType = active.data?.current?.contentType || 'general';
          const draggedWidgetType = active.data?.current?.widgetType || activeElement.type;
          
          // Check if trying to drop on a drop area
          if (over && over.data?.current?.type === 'drop-area') {
            const targetAreaId = over.data.current.elementId;
            
            // SPECIFIC AREA BINDING: If widget was created by a specific area, it can ONLY go to that area
            if (belongsToSpecificArea && belongsToSpecificArea !== targetAreaId) {
              return; // Snap back
            }
            
            // Double-check using element properties as fallback
            const elementBelongsTo = activeElement.properties?.belongsToSpecificArea;
            if (elementBelongsTo && elementBelongsTo !== targetAreaId) {
              return; // Snap back
            }
            
            // If widget is bound to a specific area and this is the correct area, allow the drop
            if (belongsToSpecificArea && belongsToSpecificArea === targetAreaId) {
              // Allow the drop - will be handled by normal drop logic below
              // Continue with validation...
            }
            
            const targetArea = elements.find(el => el.id === targetAreaId);
            const targetContentType = targetArea?.properties?.contentType || 'general';
            const targetAllowedTypes = targetArea?.properties?.allowedWidgetTypes || [];
            const targetCategory = targetArea?.properties?.areaCategory || 'default';
                        
            // For widgets WITHOUT specific area binding, use the old content type validation
            if (!belongsToSpecificArea) {
              // Validate content type compatibility
              const isContentTypeCompatible = 
                targetContentType === 'general' || // General areas accept anything
                draggedContentType === 'general' || // General content can go anywhere
                targetContentType === draggedContentType; // Same content types match
              
              // Validate specific widget types if defined
              const isWidgetTypeAllowed = 
                targetAllowedTypes.length === 0 || // No restrictions
                targetAllowedTypes.includes(draggedWidgetType) || // Explicitly allowed
                targetAllowedTypes.includes('drop-area-content'); // Allows all drop-area-content
              
              // Check if this is a cross-area move for already placed content
              if (isCurrentlyInDropArea && targetAreaId !== activeElement.parentId) {
                return; // Snap back
              }
              
              // Check content compatibility for new drops
              if (!isCurrentlyInDropArea && (!isContentTypeCompatible || !isWidgetTypeAllowed)) {
                return; // Snap back
              }
              
              // If widget is outside drop areas and content is compatible, allow dropping
              if (!isCurrentlyInDropArea && isContentTypeCompatible && isWidgetTypeAllowed) {
                // Allow the drop - will be handled by normal drop logic below
              }
            }
          }
          
          // If trying to drop on non-drop-area and widget is currently in a drop area, prevent it
          if (isCurrentlyInDropArea && over && over.data?.current?.type !== 'drop-area') {
            return; // Snap back
          }
          
          // If widget has specific area binding and trying to drop elsewhere, prevent it
          if (belongsToSpecificArea && over && over.data?.current?.type !== 'drop-area') {
            return; // Snap back
          }
        }

        // Handle body drags for drop-area-content
        if (dragSource === 'body') {
          const isCurrentlyInDropArea = activeElement.parentId && elements.find(el => el.id === activeElement.parentId && el.type === 'drop-area');
          
          if (isCurrentlyInDropArea) {
            // If currently in a drop area, only allow repositioning within the same drop area
            if (
              over &&
              over.data?.current?.type === 'drop-area' &&
              over.data.current.elementId === activeElement.parentId
            ) {
              // Normal repositioning logic (already present below)
            } else {
              // Prevent moving to a different parent or canvas
              return;
            }
          } else {
            // If currently outside drop areas, allow moving into drop areas or repositioning in parent
            if (over && over.data?.current?.type === 'drop-area') {
              // Allow the drop - will be handled by normal drop logic below
            } else if (over && over.data?.current?.type === 'container' && over.data.current.elementId === activeElement.parentId) {
              // Allow repositioning within same parent
            } else {
              return;
            }
          }
        }

        // 1. If dropped onto a different drop-area, update parentId and position relative to new parent
        if (
          over &&
          over.data?.current?.type === 'drop-area' &&
          over.data.current.elementId !== activeElement.parentId
        ) {
          const dropAreaId = over.data.current.elementId;
          const dropAreaEl = document.querySelector(`[data-container-id="${dropAreaId}"]`) as HTMLElement;
          if (dropAreaEl) {
            const dropAreaRect = dropAreaEl.getBoundingClientRect();
            
            // Defensive check for mouse event
            const mouseEvent = event.activatorEvent as MouseEvent;
            if (!mouseEvent || !('clientX' in mouseEvent) || !('clientY' in mouseEvent)) {
              // Use default position in the drop area
              updateElement(activeElementId, {
                parentId: dropAreaId,
                properties: {
                  ...activeElement.properties,
                  left: 20,
                  top: 40, // Account for header space
                },
              });
              return;
            }
            
            const mouseX = mouseEvent.clientX || 0;
            const mouseY = mouseEvent.clientY || 0;

            // Position relative to drop-area
            let newLeft = Math.max(8, Math.round(mouseX - dropAreaRect.left));
            let newTop = Math.max(40, Math.round(mouseY - dropAreaRect.top)); // Account for header space

            // Clamp to bounds with more restrictive padding
            const contentWidth = Number(activeElement.properties.width) || 120;
            const contentHeight = Number(activeElement.properties.height) || 100;
            const padding = 16; // Increased padding to prevent edge drops
            newLeft = Math.max(padding, Math.min(newLeft, dropAreaRect.width - contentWidth - padding));
            newTop = Math.max(40, Math.min(newTop, dropAreaRect.height - contentHeight - padding)); // Min 40 for header

            updateElement(activeElementId, {
              parentId: dropAreaId,
              properties: {
                ...activeElement.properties,
                left: newLeft,
                top: newTop,
              },
            });
            return;
          }
        }

        // 2. If dropped within the same parent, update position with boundary constraints
        const { delta } = event;
        const currentLeft = Number(activeElement.properties.left) || 0;
        const currentTop = Number(activeElement.properties.top) || 0;
        let newLeft = currentLeft + delta.x;
        let newTop = currentTop + delta.y;
        if (activeElement.parentId) {
          const parentEl = document.querySelector(`[data-container-id="${activeElement.parentId}"]`) as HTMLElement;
          if (parentEl) {
            const parentRect = parentEl.getBoundingClientRect();
            const contentWidth = Number(activeElement.properties.width) || 120;
            const contentHeight = Number(activeElement.properties.height) || 100;
            const padding = 8;
            const headerHeight = 40; // Account for header space
            newLeft = Math.max(padding, Math.min(newLeft, parentRect.width - contentWidth - padding));
            newTop = Math.max(headerHeight, Math.min(newTop, parentRect.height - contentHeight - padding));
          }
        }
        // For containers, simple delta is sufficient; offset handled by design
        updateElement(activeElementId, {
          properties: {
            ...activeElement.properties,
            left: newLeft,
            top: newTop
          }
        });
        return;
      }

      // Only move to canvas if the drop target is explicitly the canvas
      // BUT prevent drop-area widgets from being moved to canvas
      if (over.data?.current?.type === 'canvas') {
        // Prevent drop-area content from being moved to canvas
        if (active.data?.current?.type === 'drop-area-content') {
          return;
        }

        
        let relX, relY;
        
        if (initialPositionRef.current) {
          // Calculate the element's current absolute position
          let currentAbsX, currentAbsY;
          
          if (activeElement.parentId) {
            // Element is moving from a child container to canvas
            const currentParentEl = document.querySelector(`[data-container-id="${activeElement.parentId}"]`) as HTMLElement;
            if (currentParentEl) {
              const currentRect = currentParentEl.getBoundingClientRect();
              // Calculate current absolute position: container position + element's relative position
              currentAbsX = currentRect.left + (activeElement.properties.left || 0);
              currentAbsY = currentRect.top + (activeElement.properties.top || 0);
            } else {
              // Fallback if container not found
              const { x, y } = initialPositionRef.current;
              currentAbsX = x;
              currentAbsY = y;
            }
          } else {
            // Element is already on canvas - use current canvas position
            currentAbsX = activeElement.properties.left || 0;
            currentAbsY = activeElement.properties.top || 0;
            
            // Convert canvas coordinates to absolute
            const canvasEl = document.querySelector('[data-canvas]') as HTMLElement;
            if (canvasEl) {
              const canvasRect = canvasEl.getBoundingClientRect();
              currentAbsX += canvasRect.left;
              currentAbsY += canvasRect.top;
            }
          }
          
          // Apply the drag delta to get final absolute position
          const finalAbsX = currentAbsX + delta.x;
          const finalAbsY = currentAbsY + delta.y;
          
          // Convert to position relative to the canvas
          const canvasEl = document.querySelector('[data-canvas]') as HTMLElement;
          if (canvasEl) {
            const canvasRect = canvasEl.getBoundingClientRect();
            relX = Math.max(0, Math.round(finalAbsX - canvasRect.left));
            relY = Math.max(0, Math.round(finalAbsY - canvasRect.top));
            
          } else {
            // Fallback if canvas not found
            relX = Math.max(0, Math.round(finalAbsX));
            relY = Math.max(0, Math.round(finalAbsY));
          }
          
          updateElement(activeElementId, {
            parentId: undefined,
            properties: { ...activeElement.properties, left: relX, top: relY }
          });
        } else {
          // Fallback - use default position
          updateElement(activeElementId, { 
            parentId: undefined,
            properties: { ...activeElement.properties, left: 20, top: 20 }
          });
        }
         return;
       }

      // Handle moving between containers and grid cells
      // BUT prevent drop-area widgets from being moved to other containers
      if (over.data?.current && ['container', 'grid-cell', 'drag-drop-widget'].includes(over.data.current.type)) {
        
        // Prevent drop-area content from being moved to other containers
        if (active.data?.current?.type === 'drop-area-content') {
          return;
        }

        const data = over.data.current;
        const newParentId = data.type === 'container'
          ? data.elementId
          : data.type === 'drag-drop-widget'
            ? data.elementId
            : data.containerId;
        const currentParentId = activeElement.parentId;
        

        
        // Prevent self-drop: containers cannot be dropped on themselves
        if (activeElementId === newParentId) {
          return;
        }
        
        // Prevent dropping on descendants: check if newParentId is a descendant of activeElementId
        const isDescendant = (parentId: string, childId: string): boolean => {
          const child = elements.find(el => el.id === childId);
          if (!child || !child.parentId) return false;
          if (child.parentId === parentId) return true;
          return isDescendant(parentId, child.parentId);
        };
        
        if (isDescendant(activeElementId, newParentId)) {
          return;
        }
        
        if (newParentId !== currentParentId) {
          // Get the drop position relative to the new container
          const newParentEl = document.querySelector(`[data-container-id="${newParentId}"]`) as HTMLElement;
          if (newParentEl) {
            const newRect = newParentEl.getBoundingClientRect();
            
            // Calculate position based on where the element was dropped
            // Use the delta to calculate the final drop position
            let relX, relY;
            
            if (initialPositionRef.current) {
              // Get the current (old) parent container to calculate the element's current absolute position
              let currentAbsX, currentAbsY;
              
              if (currentParentId) {
                // Element is moving from a child container to another container
                const currentParentEl = document.querySelector(`[data-container-id="${currentParentId}"]`) as HTMLElement;
                if (currentParentEl) {
                  const currentRect = currentParentEl.getBoundingClientRect();
                  // Calculate current absolute position: container position + element's relative position
                  currentAbsX = currentRect.left + (activeElement.properties.left || 0);
                  currentAbsY = currentRect.top + (activeElement.properties.top || 0);
                } else {
                  // Fallback if container not found
                  const { x, y } = initialPositionRef.current;
                  currentAbsX = x;
                  currentAbsY = y;
                }
              } else {
                // Element is moving from canvas (no parent) - use current canvas position
                currentAbsX = activeElement.properties.left || 0;
                currentAbsY = activeElement.properties.top || 0;
                
                // Convert canvas coordinates to absolute
                const canvasEl = document.querySelector('[data-canvas]') as HTMLElement;
                if (canvasEl) {
                  const canvasRect = canvasEl.getBoundingClientRect();
                  currentAbsX += canvasRect.left;
                  currentAbsY += canvasRect.top;
                }
              }
              
              // Apply the drag delta to get final absolute position
              const finalAbsX = currentAbsX + delta.x;
              const finalAbsY = currentAbsY + delta.y;
              
              // Convert to position relative to the new container
              relX = Math.max(0, Math.round(finalAbsX - newRect.left));
              relY = Math.max(0, Math.round(finalAbsY - newRect.top));
            } else {
              // Default position with some padding from top-left
              relX = 20;
              relY = 20;
            }
            
            // Clamp and auto-resize to fit within new parent container
            let newWidth = activeElement.properties.width || 200;
            let newHeight = activeElement.properties.height || 100;
            let minWidth = activeElement.properties.minWidth || 40;
            let minHeight = activeElement.properties.minHeight || 40;

            // Get container padding (if any)
            let containerPadding = 0;
            if (newParentEl) {
              const computedStyle = window.getComputedStyle(newParentEl);
              // Use left/right/top/bottom padding (assume uniform for simplicity)
              containerPadding = parseInt(computedStyle.paddingLeft || '0', 10);
            }

            // Calculate max allowed width/height inside the container
            const maxWidth = newRect.width - containerPadding * 2;
            const maxHeight = newRect.height - containerPadding * 2;

            // Clamp width/height
            if (typeof newWidth === 'string') newWidth = parseInt(newWidth, 10) || maxWidth;
            if (typeof newHeight === 'string') newHeight = parseInt(newHeight, 10) || maxHeight;
            newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
            newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

            // Clamp left/top so the element stays fully inside the container
            relX = Math.max(containerPadding, Math.min(relX, newRect.width - newWidth - containerPadding));
            relY = Math.max(containerPadding, Math.min(relY, newRect.height - newHeight - containerPadding));
            
            updateElement(activeElementId, {
              parentId: newParentId,
              properties: {
                ...activeElement.properties,
                left: relX,
                top: relY,
                width: newWidth,
                height: newHeight,
              }
            });

            // Trigger selection border update for the resized element
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('elementResized', { 
                detail: { elementId: activeElementId } 
              }));
            }, 100); // Small delay to ensure DOM update is complete
          } else {
            updateElement(activeElementId, { parentId: newParentId });
          }
           return;
         }
         
        if (newParentId === currentParentId) {
          
                    // Removed: Check if this is a drag-drop widget child - repositioning is now allowed
          // since we removed ContentDropZone and want normal drag behavior within containers
        
          // Check if this is a standalone widget being dropped into a container
          // Allow standalone widgets to be dropped into containers even if they're already children
          const parentElement = elements.find(el => el.id === currentParentId);
          if (activeElement.type === 'standalone-widget' && parentElement && parentElement.type === 'container') {
            
            // Get the drop position relative to the container
            const parentEl = document.querySelector(`[data-container-id="${currentParentId}"]`) as HTMLElement;
            if (parentEl) {
              const parentRect = parentEl.getBoundingClientRect();
              
              // Use the drop coordinates from the drag event
              let relX, relY;
              
              // Calculate the final drop position using current position + delta
              const currentLeft = Number(activeElement.properties.left) || 0;
              const currentTop = Number(activeElement.properties.top) || 0;
              
              // Use delta to get the final position where the element was dropped
              relX = currentLeft + (delta?.x || 0);
              relY = currentTop + (delta?.y || 0);
              
              // Apply boundary constraints
              const elementSize = 80; // Standard standalone widget size
              const padding = 8;
              relX = Math.max(padding, Math.min(relX, parentRect.width - elementSize - padding));
              relY = Math.max(padding, Math.min(relY, parentRect.height - elementSize - padding));
              
              updateElement(activeElementId, {
                properties: {
                  ...activeElement.properties,
                  left: relX,
                  top: relY,
                  // Update original position for future snap-back
                  originalPosition: { x: relX, y: relY }
                }
              });
              return;
            }
          }
          
          // Special handling for drop-area elements
          if (activeElement.type === 'drop-area-content' as any || activeElement.type === 'drop-area' as any) {
            const parentElement = elements.find(el => el.id === currentParentId);
            if (parentElement && (parentElement.type === 'drop-area' as any || parentElement.type === 'container' as any || parentElement.type === 'simple-container' as any)) {
              // Defensive check for delta
              const { delta } = event;
              if (!delta || typeof delta.x !== 'number' || typeof delta.y !== 'number') {
                return;
              }
              
              // Get current position
              const currentLeft = Number(activeElement.properties.left) || 0;
              const currentTop = Number(activeElement.properties.top) || 0;
              
              // Calculate new position
              let newLeft = currentLeft + delta.x;
              let newTop = currentTop + delta.y;
              
              // Get widget dimensions
              const widgetWidth = Number(activeElement.properties.width) || 100;
              const widgetHeight = Number(activeElement.properties.height) || 50;
              
              // Get parent dimensions
              const parentWidth = Number(parentElement.properties.width) || 300;
              const parentHeight = Number(parentElement.properties.height) || 200;
              
              // Apply boundary constraints with more restrictive padding
              const padding = 16; // Increased padding to prevent edge drops
              newLeft = Math.max(padding, Math.min(newLeft, parentWidth - widgetWidth - padding));
              newTop = Math.max(padding, Math.min(newTop, parentHeight - widgetHeight - padding));
              

              
              updateElement(activeElementId, {
                properties: {
                  ...activeElement.properties,
                  left: newLeft,
                  top: newTop,
                  // Update original position after successful repositioning
                  originalPosition: { x: newLeft, y: newTop }
                }
              });
              return;
            }
          }
          
          // Regular element repositioning
          // Get the parent container element to calculate proper drop position
          const parentEl = document.querySelector(`[data-container-id="${currentParentId}"]`) as HTMLElement;
          if (parentEl) {
            const parentRect = parentEl.getBoundingClientRect();
            const { delta } = event;
            
            // Calculate the element's current absolute position
            const currentAbsX = parentRect.left + (activeElement.properties.left || 0);
            const currentAbsY = parentRect.top + (activeElement.properties.top || 0);
            
            // Apply the drag delta to get final absolute position
            const finalAbsX = currentAbsX + delta.x;
            const finalAbsY = currentAbsY + delta.y;
            
            // Convert to position relative to the parent container
            const newLeft = Math.max(0, Math.round(finalAbsX - parentRect.left));
            const newTop = Math.max(0, Math.round(finalAbsY - parentRect.top));
            
            updateElement(activeElementId, {
              properties: {
                ...activeElement.properties,
                left: newLeft,
                top: newTop,
                // Update original position after successful repositioning
                originalPosition: { x: newLeft, y: newTop }
              }
            });
          } else {
            // Fallback to delta-based positioning if parent not found
            const { delta } = event;
            if (delta && (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1)) {
              const currentLeft = Number(activeElement.properties.left) || 0;
              const currentTop = Number(activeElement.properties.top) || 0;
              
              const newLeft = Math.round(currentLeft + delta.x);
              const newTop = Math.round(currentTop + delta.y);
              
              updateElement(activeElementId, {
                properties: {
                  ...activeElement.properties,
                  left: newLeft,
                  top: newTop,
                  // Update original position after successful repositioning
                  originalPosition: { x: newLeft, y: newTop }
                }
              });
            }
          }
          return;
        }
        
        // If we reach here, it means the drop was invalid (same parent but not repositioning)
        return;
      }
      
      // Handle repositioning on canvas (top-level elements) - ALLOW for both body and handle drag
      if (!activeElement.parentId && over.data?.current?.type === 'canvas') {
        
        // Get the drag delta from the event
        const { delta } = event;
        if (delta && (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1)) {
          const currentLeft = Number(activeElement.properties.left) || 0;
          const currentTop = Number(activeElement.properties.top) || 0;
          
          // Calculate new position with delta
          let newLeft = currentLeft + delta.x;
          let newTop = currentTop + delta.y;
          
          // Apply canvas bounds checking to prevent elements from jumping outside
          const canvasElement = document.querySelector('[data-canvas]') as HTMLElement;
          if (canvasElement) {
            const canvasRect = canvasElement.getBoundingClientRect();
            const canvasStyle = window.getComputedStyle(canvasElement);
            const paddingLeft = parseInt(canvasStyle.paddingLeft) || 0;
            const paddingTop = parseInt(canvasStyle.paddingTop) || 0;
            const paddingRight = parseInt(canvasStyle.paddingRight) || 0;
            const paddingBottom = parseInt(canvasStyle.paddingBottom) || 0;
            
            // Get element dimensions
            const elementWidth = Number(activeElement.properties.width) || 100;
            const elementHeight = Number(activeElement.properties.height) || 40;
            
            // Calculate usable canvas area (excluding padding)
            const minLeft = paddingLeft;
            const minTop = paddingTop;
            const maxLeft = canvasRect.width - paddingRight - elementWidth;
            const maxTop = canvasRect.height - paddingBottom - elementHeight;
            
            // Clamp the position to stay within canvas bounds
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));
            
          }
          
          // Round to prevent sub-pixel positioning
          newLeft = Math.round(newLeft);
          newTop = Math.round(newTop);
          
          updateElement(activeElementId, {
            properties: {
              ...activeElement.properties,
              left: newLeft,
              top: newTop
            }
          });
          
        }
        return;
      }
      
      // Handle reordering within the same container/level (by element order)
      // IMPORTANT: Only do this if we haven't already handled a container drop
      if (over.data?.current?.type !== 'container') {
        const oldIndex = elements.findIndex(el => el.id === activeElementId);
        const newIndex = elements.findIndex(el => el.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          // Use moveElement to reorder by index
          moveElement(activeElementId, undefined, newIndex);
          return;
        }
      }
      
      // If no specific reordering target, but we have a valid container drop, allow it
      if (over.data?.current?.type === 'container') {
        return;
      }
      return;
    }

    // Handle dropping new elements from sidebar
    if (active.id.toString().startsWith('new-')) {
      const dragData = active.data?.current;
      let elementType: string;
      let customProperties: any = {};

      // Get element type from ID
      elementType = active.id.toString().replace('new-', '') as any;
      
      // Check if there's additional data from the draggable (like heading level)
      if (dragData?.level && elementType === 'heading') {
        customProperties.level = dragData.level;
      }
      
      // Check grid-cell drop for any widget type
      if (over.data?.current?.type === 'grid-cell') {
        // Treat as container drop in grid cell
        const containerId = over.data.current.containerId;
        const newElement = createElementFromType(elementType as any, containerId, customProperties);
        if (newElement) addElement(newElement);
        return;
      }
      
      // Special handling for container widget - open template modal
      if (elementType === 'container') {
        if (openContainerTemplateModal) {
          openContainerTemplateModal();
          return;
        }
      }
      
      // Debug logging for text widget drops
      if (elementType === 'text') {
      }
      
      // Special handling for image widget - ONLY allow drops on containers
      if (elementType === 'image') {
        
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          
          // Open choice modal
          openImageChoiceModal(containerId);
          return;
        } else {
          // Image can only be dropped on containers - ignore other drops
          return;
        }
      }

      // Special handling for video widget - ONLY allow drops on containers
      if (elementType === 'video') {
        
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          // Open choice modal
          openVideoChoiceModal(containerId);
          return;
        } else {
          // Video can only be dropped on containers - ignore other drops
          return;
        }
      }

      // Special handling for audio widget - ONLY allow drops on containers
      if (elementType === 'audio') {
        
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          
          // Open choice modal for regular audio widget
          openAudioChoiceModal(containerId, 'ADD_ELEMENT', 'audio');
          return;
        } else {
          // Audio can only be dropped on containers - ignore other drops
          return;
        }
      }

      // Special handling for audio-true-false widget - ONLY allow drops on containers
      if (elementType === 'audio-true-false') {
        
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          
          // Open choice modal for audio-true-false widget
          openAudioChoiceModal(containerId, 'ADD_ELEMENT', 'audio-true-false');
          return;
        } else {
          // Audio True/False widget can only be dropped on containers - ignore other drops
          return;
        }
      }

      // Special handling for speech-recognition widget - ONLY allow drops on containers
      if (elementType === 'speech-recognition') {
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          // Create speech-recognition element directly with default properties
          const newElement = createElementFromType('speech-recognition' as any, containerId, {
            targetText: 'Hello, how are you today?',
            allowRetry: true,
            showResult: true,
            autoStart: false,
            feedbackMode: 'word',
            minAccuracy: 80,
            maxRecordingTime: 30000,
            playTargetAudio: true,
            micButtonColor: '#3b82f6',
            micButtonSize: 64,
            width: '400px',
            height: '300px',
            backgroundColor: '#f8fafc',
            borderRadius: 12
          } as any);
          
          addElement(newElement);
          selectElement(newElement.id);
          return;
        } else {
          return;
        }
      }

      // Special handling for area-true-false widget - ONLY allow drops on containers
      if (elementType === 'area-true-false') {
        
        if (over.data?.current?.type === 'container') {
          const containerId = over.data.current.elementId;
          
          // Create area-true-false element directly with default properties
          const newElement = createElementFromType('area-true-false' as any, containerId, {
            correctAnswer: true,
            clickAnswersTrue: true,
            showResult: true,
            allowRetry: true,
            clickableAreaText: 'Haz clic para responder',
            correctText: '¡Correcto!',
            incorrectText: 'Incorrecto',
            width: '300px',
            height: '200px',
            backgroundColor: '#f3f4f6',
            showBorder: true,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: '#d1d5db',
            borderRadius: 8,
            // Card background defaults
            correctCardBackgroundColor: '#10b981',
            correctCardBackgroundOpacity: 0.1,
            correctCardBackgroundTransparent: false,
            incorrectCardBackgroundColor: '#ef4444',
            incorrectCardBackgroundOpacity: 0.1,
            incorrectCardBackgroundTransparent: false,
            // Shake animation defaults
            shakeOnWrong: false
          } as any);
          
          if (newElement) {
            addElement(newElement);
          }
          return;
        } else {
          // Area True/False widget can only be dropped on containers - ignore other drops
          return;
        }
      }
      
      // Special handling for connection-widget - create two separate node elements
      if (elementType === 'connection-widget') {
        
        if (over.data?.current?.type === 'container') {
          try {
            const containerId = over.data.current.elementId;
            
            const dropPosition = {
              x: 50 // Default left position
            };

            const { textNode, imageNode } = createConnectionNodePair(
              containerId,
              customProperties.text || 'Connect me!',
              customProperties.imageUrl || '',
              dropPosition
            );
            
            // Add both nodes to the container
            addElement(textNode);
            
            addElement(imageNode);
            return; // Early return to prevent fallback element creation
          } catch (error) {
            // Continue to regular element creation as fallback
          }
        } else {
          return; // Early return for invalid drop target
        }
      }

      // Regular element creation for non-connection widgets
      
      const newElement = createElementFromType(elementType as any, 
        over.data?.current?.type === 'container' ? over.data.current.elementId : undefined,
        Object.keys(customProperties).length > 0 ? customProperties : undefined
      );
      
      if (newElement) {
        addElement(newElement);
      }
    }
    
    // Reset drag source after all logic has completed
    setDragSource('sidebar');
  }, [elements, addElement, updateElement, moveElement, openImageChoiceModal, openVideoChoiceModal, openAudioChoiceModal, openContainerTemplateModal]);

  return {
    activeId,
    dragSource,
    draggedElement,
    handleDragStart,
    handleDragEnd,
  };
};
