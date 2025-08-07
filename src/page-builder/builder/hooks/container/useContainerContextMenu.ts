import { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import type { Element } from '../../../types';

interface UseContainerContextMenuProps {
  element: Element;
  properties: any;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const useContainerContextMenu = ({ element, properties, openImageChoiceModal }: UseContainerContextMenuProps) => {
  const { updateElement, removeElement, copyElements, pasteElements, selectElement, setTextElementTab, togglePropertyPanel, propertyPanelVisible } = useBuilder();
  
  // Context menu states
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Listen for global context menu close events
  useEffect(() => {
    const handleCloseAllContextMenus = (e: CustomEvent) => {
      if (e.detail.except !== element.id) {
        setContextMenuOpen(false);
      }
    };
    
    window.addEventListener('closeAllContextMenus', handleCloseAllContextMenus as EventListener);
    return () => window.removeEventListener('closeAllContextMenus', handleCloseAllContextMenus as EventListener);
  }, [element.id]);
  
  // Context menu handlers
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    
    // Check if the click target is a child widget/element
    const target = e.target as HTMLElement;
    const clickedWidget = target.closest('[data-element-type]:not([data-element-type="container"])');
    
    if (clickedWidget) {
      return; // Don't show container context menu if clicking on a child widget
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Close any other open context menus
    window.dispatchEvent(new CustomEvent('closeAllContextMenus', { detail: { except: element.id } }));
    
    // Get the exact position using getBoundingClientRect for precision
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Use viewport coordinates (clientX/clientY) directly
    const viewportPosition = { x: e.clientX, y: e.clientY };

    
    setContextMenuPosition(viewportPosition);
    setContextMenuOpen(true);
  }, [element.id, selectElement]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuOpen(false);
  }, []);

  const handleDuplicate = useCallback(() => {
    // Duplicate the element using copy-paste functionality
    // First copy the element
    copyElements([element.id]);
    // Then paste it with a small offset to avoid overlapping
    pasteElements(element.parentId, { x: 20, y: 20 });
    setContextMenuOpen(false);
  }, [element.id, element.parentId, copyElements, pasteElements]);

  const handleDelete = useCallback(() => {
    removeElement(element.id);
    setContextMenuOpen(false);
  }, [element.id, removeElement]);

  const handleImageUpload = useCallback(() => {
    
    if (openImageChoiceModal) {
      // Use the image choice modal with SET_BACKGROUND context instead of direct upload
      openImageChoiceModal(element.id, 'SET_BACKGROUND');
    } else {
      // Fallback to direct image modal if choice modal not available
      setImageModalOpen(true);
    }
    setContextMenuOpen(false);
  }, [openImageChoiceModal, element.id]);

  const handleRemoveBackgroundImage = useCallback(() => {
    updateElement(element.id, {
      properties: { ...properties, backgroundImage: undefined }
    });
    setContextMenuOpen(false);
  }, [element.id, properties, updateElement]);

  const handleMoveElement = useCallback(() => {
    // For containers, we can trigger the repositioning mode
    // The user can then drag the element to reposition it
    setContextMenuOpen(false);
  }, [element.id]);

  const handleElementSettings = useCallback(() => {
    
    // Additional check: don't handle if this was triggered by a child element click
    const recentlyClickedChild = Date.now() - (window as any).lastChildContextMenuTime < 100;
    if (recentlyClickedChild) {
      setContextMenuOpen(false);
      return;
    }
    
    // Determine if this is a text element
    const isTextElement = ['heading', 'paragraph', 'quote'].includes(element.type);
    // Select the element and reset any previous tab state
    selectElement(element.id);
    // Immediately set the properties panel tab for text elements
    setTextElementTab(isTextElement ? 'styling' : null);
    // Ensure the properties panel is visible
    if (!propertyPanelVisible) {
      togglePropertyPanel();
    } else {
    }
    // Close context menu
    setContextMenuOpen(false);
  }, [element.id, element.type, selectElement, setTextElementTab, togglePropertyPanel, propertyPanelVisible]);

  return {
    contextMenuOpen,
    contextMenuPosition,
    imageModalOpen,
    setImageModalOpen,
    handleContextMenu,
    handleCloseContextMenu,
    handleDuplicate,
    handleDelete,
    handleImageUpload,
    handleRemoveBackgroundImage,
    handleMoveElement,
    handleElementSettings
  };
};
