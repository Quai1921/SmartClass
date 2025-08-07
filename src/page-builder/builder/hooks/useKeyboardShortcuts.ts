import { useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

export const useKeyboardShortcuts = () => {
  const {
    selectedElementIds,
    removeElement,
    selectElement,
    toggleSidebar,
    canUndo,
    canRedo,
    undo,
    redo,
    saveProject,
    copyElements,
    pasteElements,
    canCopy,
    canPaste,
  } = useBuilder();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent actions when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement || 
          event.target instanceof HTMLSelectElement) {
        return;
      }

      const isCtrl = event.ctrlKey || event.metaKey;
      
      switch (event.key) {
        case 'Delete':
        case 'Supr':
          if (selectedElementIds.length > 0) {
            // Delete all selected elements
            selectedElementIds.forEach(elementId => {
              removeElement(elementId);
            });
            event.preventDefault();
          }
          break;
          
        case 'z':
        case 'Z':
          if (isCtrl) {
            if (canUndo) {
              undo();
            }
            event.preventDefault();
          }
          break;
            
        case 'y':
        case 'Y':
          if (isCtrl) {
            if (canRedo) {
              redo();
            }
            event.preventDefault();
          }
          break;
          
        case 's':
        case 'S':
          if (isCtrl) {
            // Use the same save logic as the toolbar button
            const saveEvent = new CustomEvent('saveCurrentModule');
            window.dispatchEvent(saveEvent);
            event.preventDefault();
          }
          break;

        case 'c':
        case 'C':
          if (isCtrl && canCopy) {
            copyElements(selectedElementIds);
            event.preventDefault();
          }
          break;

        case 'v':
        case 'V':
          if (isCtrl && canPaste) {
            pasteElements();
            event.preventDefault();
          }
          break;
            case 'Escape':
          if (selectedElementIds.length > 0) {
            selectElement(null);
            event.preventDefault();
          }
          break;
          
        case 'F9':
          toggleSidebar();
          event.preventDefault();
          break;
          
        case 'ArrowUp':
        case 'ArrowDown':
          if (selectedElementIds.length === 1) {
            // TODO: Implement element movement with arrow keys
            event.preventDefault();
          }
          break;
          
        case 't':
        case 'T':
          if (event.altKey) {
            // TODO: Implement tab switching
            event.preventDefault();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);  }, [
    selectedElementIds,
    removeElement,
    selectElement,
    toggleSidebar,
    canUndo,
    canRedo,
    undo,
    redo,
    saveProject,
    copyElements,
    pasteElements,
    canCopy,
    canPaste,
  ]);
};
