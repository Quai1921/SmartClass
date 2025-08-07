import { useState, useCallback, useEffect } from 'react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

export const useInlineEditing = (element: Element, onContentChange?: () => void, isSelected?: boolean) => {
  const { updateElement } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Add keyboard shortcut to start editing (Enter key when element is selected)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      
      // Only trigger if this element is selected and not already editing
      if (isSelected && !isEditing && e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Check if element supports text editing
        if (['paragraph', 'quote', 'heading', 'text'].includes(element.type)) {
          e.preventDefault();
          // For paragraphs and quotes, prefer HTML content if available
          const currentText = (element.type === 'paragraph' || element.type === 'quote') && element.properties.htmlContent 
            ? element.properties.htmlContent 
            : element.properties.text || element.properties.content || '';
          setEditText(currentText);
          setIsEditing(true);
        }
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected, isEditing, element.type, element.properties.text, element.properties.content, element.properties.htmlContent]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!['paragraph', 'quote', 'heading', 'text'].includes(element.type)) return;
    
    // For paragraphs and quotes, start enhanced editing
    if (element.type === 'paragraph' || element.type === 'quote') {
      const currentText = element.properties.htmlContent || element.properties.text || element.properties.content || '';
      setEditText(currentText);
      setIsEditing(true);
      return;
    }
    
    // For other text elements, use basic editing
    const currentText = element.properties.text || element.properties.content || '';
    setEditText(currentText);
    setIsEditing(true);
  }, [element.type, element.properties.text, element.properties.content, element.properties.htmlContent]);  const handleEditingComplete = useCallback(() => {
    if (editText.trim() !== '') {
      const hasHtmlContent = editText.includes('<');
      
      updateElement(element.id, {
        properties: {
          ...element.properties,
          text: editText,
          content: editText,
          // For paragraphs and quotes, store HTML content if it contains HTML tags
          ...((element.type === 'paragraph' || element.type === 'quote') && {
            htmlContent: hasHtmlContent ? editText : undefined
          })
        },
      });
      
      // Call the callback to notify parent about content change
      // Use a small delay to ensure DOM updates are complete
      setTimeout(() => {
        onContentChange?.();
      }, 100);
    }
    setIsEditing(false);
    setEditText('');
  }, [editText, element.id, element.properties, element.type, updateElement, onContentChange]);

  const handleEditingCancel = useCallback(() => {
    setIsEditing(false);
    setEditText('');
  }, []);

  const handleEditingKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditingComplete();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEditingCancel();
    }
  }, [handleEditingComplete, handleEditingCancel]);
  
  return {
    isEditing,
    editText,
    setEditText,
    setIsEditing, // Expose this for testing
    handleDoubleClick,
    handleEditingComplete,
    handleEditingKeyDown,
  };
};
