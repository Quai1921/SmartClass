import { useCallback } from 'react';

interface UseEnhancedEditingProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLDivElement | null>;
  content: string;
  onContentChange: (content: string) => void;
  setShowLinkModal: (show: boolean) => void;
  setShowColorModal: (show: boolean) => void;
  setShowBgColorModal: (show: boolean) => void;
  setLinkData: (data: { url: string; text: string }) => void;
  setColorData: (color: string) => void;
  setBgColorData: (color: string) => void;
}

export const useEnhancedEditing = ({
  editorRef,
  textareaRef,
  content,
  onContentChange,
  setShowLinkModal,
  setShowColorModal,
  setShowBgColorModal,
  setLinkData,
  setColorData,
  setBgColorData
}: UseEnhancedEditingProps) => {
  // Handle text formatting with toggle functionality
  const formatText = useCallback((tag: string, colorValue?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Get current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) return;
    
    // For underline, use a more careful approach to preserve existing formatting
    if (tag === 'underline') {
      handleUnderlineFormatting(range);
    } else {
      // Check if the formatting is already applied
      const isAlreadyFormatted = checkIfFormatted(range, tag, colorValue);
      
      if (isAlreadyFormatted) {
        // Remove formatting
        removeFormatting(range, tag);
      } else {
        // Add formatting
        addFormatting(range, tag, colorValue);
      }
    }

    // Update content
    onContentChange(textarea.innerHTML);
  }, [textareaRef, onContentChange]);

  // Special handler for underline formatting that preserves existing styles
  const handleUnderlineFormatting = (range: Range) => {
    // Check if underline is already applied to the entire selection
    const isAlreadyUnderlined = checkIfEntireSelectionUnderlined(range);
    
    if (isAlreadyUnderlined) {
      // Remove underline from the entire selection
      removeUnderlineFromSelection(range);
    } else {
      // Add underline to the entire selection
      addUnderlineToSelection(range);
    }
  };

  // Check if the entire selection is underlined
  const checkIfEntireSelectionUnderlined = (range: Range): boolean => {
    const contents = range.cloneContents();
    const walker = document.createTreeWalker(
      contents,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    let hasUnderline = false;
    let hasNonUnderlined = false;
    
    let node;
    while (node = walker.nextNode()) {
      const element = node as Element;
      const htmlElement = element as HTMLElement;
      
      if (element.tagName === 'U' || htmlElement.style.textDecoration?.includes('underline')) {
        hasUnderline = true;
      } else if (element.textContent && element.textContent.trim()) {
        hasNonUnderlined = true;
      }
    }
    
    // If we have underline but no non-underlined text, then everything is underlined
    return hasUnderline && !hasNonUnderlined;
  };

  // Remove underline from the entire selection
  const removeUnderlineFromSelection = (range: Range) => {
    const contents = range.extractContents();
    const walker = document.createTreeWalker(
      contents,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const element = node as Element;
      const htmlElement = element as HTMLElement;
      
      if (element.tagName === 'U') {
        // Move children out of U tag
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        element.parentNode?.removeChild(element);
      } else if (htmlElement.style.textDecoration?.includes('underline')) {
        // Remove underline from text-decoration
        const decorations = htmlElement.style.textDecoration.split(' ').filter(dec => dec !== 'underline');
        htmlElement.style.textDecoration = decorations.join(' ') || '';
      }
    }
    
    range.insertNode(contents);
  };

  // Add underline to the entire selection
  const addUnderlineToSelection = (range: Range) => {
    const contents = range.extractContents();
    const walker = document.createTreeWalker(
      contents,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      const element = node as Element;
      const htmlElement = element as HTMLElement;
      
      // Add underline to existing formatting elements
      if (element.tagName === 'B' || element.tagName === 'STRONG' || 
          element.tagName === 'I' || element.tagName === 'EM' ||
          element.tagName === 'SPAN') {
        htmlElement.style.textDecoration = (htmlElement.style.textDecoration || '') + ' underline';
      }
    }
    
    // If there are text nodes without formatting, wrap them in U tags
    const textWalker = document.createTreeWalker(
      contents,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let textNode;
    while (textNode = textWalker.nextNode()) {
      if (textNode.textContent && textNode.textContent.trim()) {
        const uElement = document.createElement('u');
        textNode.parentNode?.insertBefore(uElement, textNode);
        uElement.appendChild(textNode);
      }
    }
    
    range.insertNode(contents);
  };

  // Helper function to check if text is already formatted
  const checkIfFormatted = (range: Range, tag: string, colorValue?: string): boolean => {
    const container = range.commonAncestorContainer;
    let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
    
    // Walk up the DOM tree to find formatting
    while (element && element !== textareaRef.current) {
      const htmlElement = element as HTMLElement;
      switch (tag) {
        case 'bold':
          if (element.tagName === 'B' || element.tagName === 'STRONG' || 
              htmlElement.style.fontWeight === 'bold' || htmlElement.style.fontWeight === '700') {
            return true;
          }
          break;
        case 'italic':
          if (element.tagName === 'I' || element.tagName === 'EM' || 
              htmlElement.style.fontStyle === 'italic') {
            return true;
          }
          break;
        case 'underline':
          if (element.tagName === 'U') {
            return true;
          } else if (htmlElement.style.textDecoration?.includes('underline')) {
            return true;
          }
          break;
        case 'color':
          if (htmlElement.style.color && htmlElement.style.color !== 'inherit' && 
              htmlElement.style.color !== 'rgb(0, 0, 0)' && htmlElement.style.color !== '#000000') {
            return true;
          }
          break;
        case 'backgroundColor':
          if (htmlElement.style.backgroundColor && htmlElement.style.backgroundColor !== 'transparent' && 
              htmlElement.style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            return true;
          }
          break;
      }
      element = element.parentElement;
    }
    return false;
  };

  // Helper function to remove formatting
  const removeFormatting = (range: Range, tag: string) => {
    const container = range.commonAncestorContainer;
    let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
    
    // Find and remove the formatting element
    while (element && element !== textareaRef.current) {
      const htmlElement = element as HTMLElement;
      let shouldRemove = false;
      
      switch (tag) {
        case 'bold':
          if (element.tagName === 'B' || element.tagName === 'STRONG' || 
              htmlElement.style.fontWeight === 'bold' || htmlElement.style.fontWeight === '700') {
            shouldRemove = true;
          }
          break;
        case 'italic':
          if (element.tagName === 'I' || element.tagName === 'EM' || 
              htmlElement.style.fontStyle === 'italic') {
            shouldRemove = true;
          }
          break;
        case 'underline':
          if (element.tagName === 'U') {
            shouldRemove = true;
          } else if (htmlElement.style.textDecoration?.includes('underline')) {
            // Remove only the underline from text-decoration, preserve other decorations
            const currentDecoration = htmlElement.style.textDecoration;
            const decorations = currentDecoration.split(' ').filter(dec => dec !== 'underline');
            htmlElement.style.textDecoration = decorations.join(' ') || '';
            return; // Don't remove the element, just clear the underline
          }
          break;
        case 'color':
          if (htmlElement.style.color && htmlElement.style.color !== 'inherit' && 
              htmlElement.style.color !== 'rgb(0, 0, 0)' && htmlElement.style.color !== '#000000') {
            htmlElement.style.color = '';
            return; // Just clear the color, don't remove the element
          }
          break;
        case 'backgroundColor':
          if (htmlElement.style.backgroundColor && htmlElement.style.backgroundColor !== 'transparent' && 
              htmlElement.style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            htmlElement.style.backgroundColor = '';
            return; // Just clear the background, don't remove the element
          }
          break;
      }
      
      if (shouldRemove) {
        // Move the content out of the formatting element
        const parent = element.parentElement;
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
          }
          parent.removeChild(element);
        }
        return;
      }
      
      element = element.parentElement;
    }
  };

  // Helper function to add formatting
  const addFormatting = (range: Range, tag: string, colorValue?: string) => {
    const selectedText = range.toString();
    
    // For underline, try to apply it to existing formatting elements first
    if (tag === 'underline') {
      const container = range.commonAncestorContainer;
      let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
      
      // Check if we're inside a formatting element that we can add underline to
      while (element && element !== textareaRef.current) {
        const htmlElement = element as HTMLElement;
        if (element.tagName === 'B' || element.tagName === 'STRONG' || 
            element.tagName === 'I' || element.tagName === 'EM' ||
            element.tagName === 'SPAN') {
          // Add underline to existing element
          htmlElement.style.textDecoration = (htmlElement.style.textDecoration || '') + ' underline';
          return;
        }
        element = element.parentElement;
      }
    }
    
    // Create the formatted element
    let formattedElement: HTMLElement;
    
    switch (tag) {
      case 'bold':
        formattedElement = document.createElement('strong');
        break;
      case 'italic':
        formattedElement = document.createElement('em');
        break;
      case 'underline':
        formattedElement = document.createElement('u');
        break;
      case 'color':
        formattedElement = document.createElement('span');
        formattedElement.style.color = colorValue || '#000000';
        break;
      case 'backgroundColor':
        formattedElement = document.createElement('span');
        formattedElement.style.backgroundColor = colorValue || '#ffffff';
        break;
      case 'align-left':
        formattedElement = document.createElement('div');
        formattedElement.style.textAlign = 'left';
        break;
      case 'align-center':
        formattedElement = document.createElement('div');
        formattedElement.style.textAlign = 'center';
        break;
      case 'align-right':
        formattedElement = document.createElement('div');
        formattedElement.style.textAlign = 'right';
        break;
      case 'align-justify':
        formattedElement = document.createElement('div');
        formattedElement.style.textAlign = 'justify';
        break;
      default:
        return;
    }

    // Apply formatting
    if (selectedText) {
      // If text is selected, wrap it with the formatting
      range.deleteContents();
      formattedElement.textContent = selectedText;
      range.insertNode(formattedElement);
    } else {
      // If no text is selected, insert empty formatting tags
      formattedElement.textContent = '\u200B'; // Zero-width space
      range.insertNode(formattedElement);
      // Move cursor inside the element
      const newRange = document.createRange();
      newRange.setStart(formattedElement, 0);
      newRange.setEnd(formattedElement, 0);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(newRange);
    }
  };

  // Insert link
  const insertLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    setLinkData({ 
      url: '', 
      text: selectedText || '' 
    });
    setShowLinkModal(true);
  }, [setLinkData, setShowLinkModal, textareaRef]);

  // Handle link submission
  const handleLinkSubmit = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Get the current link data from the modal
    const linkText = selectedText || 'Enlace';
    const linkUrl = 'https://ejemplo.com'; // This will be updated by the modal
    
    const linkElement = document.createElement('a');
    linkElement.href = linkUrl;
    linkElement.style.color = '#2563eb';
    linkElement.style.textDecoration = 'underline';
    linkElement.textContent = linkText;
    
    range.deleteContents();
    range.insertNode(linkElement);
    
    onContentChange(textarea.innerHTML);
    textarea.focus();
  }, [onContentChange, textareaRef]);

  // Change text color
  const changeTextColor = useCallback(() => {
    setColorData('#000000');
    setShowColorModal(true);
  }, [setColorData, setShowColorModal]);

  // Change background color
  const changeBackgroundColor = useCallback(() => {
    setBgColorData('#ffffff');
    setShowBgColorModal(true);
  }, [setBgColorData, setShowBgColorModal]);

  // Handle color submission
  const handleColorSubmit = useCallback((colorValue?: string) => {
    const color = colorValue || '#000000';
    formatText('color', color);
  }, [formatText]);

  // Handle background color submission
  const handleBgColorSubmit = useCallback((colorValue?: string) => {
    const color = colorValue || '#ffffff';
    formatText('backgroundColor', color);
  }, [formatText]);

  return {
    formatText,
    insertLink,
    changeTextColor,
    changeBackgroundColor,
    handleLinkSubmit,
    handleColorSubmit,
    handleBgColorSubmit
  };
}; 