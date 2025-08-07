import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
// import { FormattingToolbar } from './FormattingToolbar';
import { RefactoredFormattingToolbar } from './RefactoredFormattingToolbar';
import { useEnhancedEditing } from './hooks/useEnhancedEditing';
import { useEmojiPicker } from './hooks/useEmojiPicker';
import { EmojiPicker } from './components/EmojiPicker';
import { LinkModal } from './LinkModal';
import { ColorPicker } from './ColorPicker';
import { sanitizeHtml } from './utils/htmlSanitizer';

interface EnhancedInlineEditorProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onComplete: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  elementType?: string;
  backgroundColor?: string;
}

export const EnhancedInlineEditor: React.FC<EnhancedInlineEditorProps> = ({
  isEditing,
  content,
  onContentChange,
  onComplete,
  onKeyDown,
  placeholder = 'Escribe aquí...',
  elementType,
  backgroundColor
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showBgColorModal, setShowBgColorModal] = useState(false);
  const [linkData, setLinkData] = useState({ url: '', text: '' });
  const [colorData, setColorData] = useState('#000000');
  const [bgColorData, setBgColorData] = useState('#ffffff');
  
  // Enhanced features state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const textareaRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const lastContentRef = React.useRef<string>('');
  const isInitializedRef = React.useRef<boolean>(false);

  const {
    formatText,
    insertLink,
    changeTextColor,
    changeBackgroundColor,
    handleLinkSubmit,
    handleColorSubmit,
    handleBgColorSubmit
  } = useEnhancedEditing({
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
  });

  // Emoji picker hook
  const emojiPicker = useEmojiPicker();

  // Handle text selection for formatting
  const handleTextSelection = useCallback(() => {
    // Use setTimeout to ensure the selection is updated after the event
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selected = range.toString();
        setSelectedText(selected);
      } else {
        setSelectedText('');
      }
    }, 0);
  }, []);

  // Typography functions
  const applyStylePreservingExisting = useCallback((styleProperty: string, styleValue: string) => {
    if (!textareaRef.current) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        // Get the existing HTML content of the selection
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(range.cloneContents());
        const existingHTML = tempDiv.innerHTML;
        
        // Wrap the existing HTML with a span that has the new style
        const newHTML = `<span style="${styleProperty}: ${styleValue};">${existingHTML}</span>`;
        
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('insertHTML', false, newHTML);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  const handleFontFamily = useCallback((font: string) => {
    if (!font || !textareaRef.current) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('fontName', false, font);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  const handleFontSize = useCallback((size: string) => {
    if (!size || !textareaRef.current) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('fontSize', false, size);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  const handleLineHeight = useCallback((height: string) => {
    applyStylePreservingExisting('line-height', height);
  }, [applyStylePreservingExisting]);

  const handleLetterSpacing = useCallback((spacing: string) => {
    applyStylePreservingExisting('letter-spacing', spacing);
  }, [applyStylePreservingExisting]);

  const handleTextTransform = useCallback((transform: string) => {
    applyStylePreservingExisting('text-transform', transform);
  }, [applyStylePreservingExisting]);

  // Enhanced features functions
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      const currentContent = textareaRef.current?.innerHTML || '';
      
      setRedoStack([...redoStack, currentContent]);
      setUndoStack(undoStack.slice(0, -1));
      
      if (textareaRef.current) {
        textareaRef.current.innerHTML = previousContent;
        onContentChange(previousContent);
      }
      
      setCanUndo(undoStack.length > 1);
      setCanRedo(true);
    }
  }, [undoStack, redoStack, onContentChange]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      const currentContent = textareaRef.current?.innerHTML || '';
      
      setUndoStack([...undoStack, currentContent]);
      setRedoStack(redoStack.slice(0, -1));
      
      if (textareaRef.current) {
        textareaRef.current.innerHTML = nextContent;
        onContentChange(nextContent);
      }
      
      setCanRedo(redoStack.length > 1);
      setCanUndo(true);
    }
  }, [undoStack, redoStack, onContentChange]);

  const handleClearFormatting = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const plainText = range.toString();
        document.execCommand('insertHTML', false, plainText);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  const handleTextShadow = useCallback(() => {
    applyStylePreservingExisting('text-shadow', '2px 2px 4px rgba(0,0,0,0.5)');
  }, [applyStylePreservingExisting]);

  const handleStrikethrough = useCallback(() => {
    if (!textareaRef.current) return;
    document.execCommand('strikeThrough', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleSubscript = useCallback(() => {
    if (!textareaRef.current) return;
    document.execCommand('subscript', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleSuperscript = useCallback(() => {
    if (!textareaRef.current) return;
    document.execCommand('superscript', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleGradientText = useCallback(() => {
    setGradientType('text');
    setShowGradientTextModal(true);
  }, []);

  const handleGradientBackground = useCallback(() => {
    setGradientType('background');
    setShowGradientBackgroundModal(true);
  }, []);

  const applyGradient = useCallback((gradient: string, type: 'text' | 'background') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) return;
    
    // Create a span with gradient styling
    const gradientSpan = document.createElement('span');
    gradientSpan.style.background = gradient;
    
    if (type === 'text') {
      // Gradient text styling
      gradientSpan.style.webkitBackgroundClip = 'text';
      gradientSpan.style.webkitTextFillColor = 'transparent';
      gradientSpan.style.backgroundClip = 'text';
    } else {
      // Gradient background styling
      gradientSpan.style.color = 'white';
      gradientSpan.style.padding = '2px 4px';
      gradientSpan.style.borderRadius = '3px';
    }
    
    gradientSpan.textContent = selectedText;
    
    // Replace the selected text with the gradient span
    range.deleteContents();
    range.insertNode(gradientSpan);
    
    // Update content
    if (textareaRef.current) {
      onContentChange(textareaRef.current.innerHTML);
    }
    handleTextSelection();
    
    // Close the modal
    setShowGradientTextModal(false);
    setShowGradientBackgroundModal(false);
  }, [onContentChange, handleTextSelection]);

  const handleInsertEmoji = useCallback(() => {
    emojiPicker.openEmojiModal();
  }, [emojiPicker]);

  const handleEmojiInsert = useCallback((emoji: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      document.execCommand('insertHTML', false, emoji);
      handleTextSelection();
    }
  }, [handleTextSelection]);

  const handleInsertTable = useCallback(() => {
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 1</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 3</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Celda 4</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHTML);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleInsertCode = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Check if the selection is already within a code element
      let currentNode = range.commonAncestorContainer;
      let isAlreadyCode = false;
      let codeElement = null;
      
      // Traverse up the DOM tree to find if we're inside a code element
      while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
        currentNode = currentNode.parentNode;
      }
      
      if (currentNode) {
        let element = currentNode as Element;
        while (element && element !== textareaRef.current) {
          if (element.tagName === 'CODE') {
            isAlreadyCode = true;
            codeElement = element;
            break;
          }
          element = element.parentElement;
        }
      }
      
      if (isAlreadyCode && codeElement) {
        // Remove code formatting - unwrap the content
        const parent = codeElement.parentNode;
        if (parent) {
          // Move all child nodes out of the code element
          while (codeElement.firstChild) {
            parent.insertBefore(codeElement.firstChild, codeElement);
          }
          // Remove the empty code element
          parent.removeChild(codeElement);
        }
      } else {
        // Apply code formatting - wrap in code tags
        const newCodeElement = document.createElement('code');
        newCodeElement.style.background = '#f4f4f4';
        newCodeElement.style.padding = '2px 4px';
        newCodeElement.style.borderRadius = '3px';
        newCodeElement.style.fontFamily = 'monospace';
        newCodeElement.textContent = selectedText;
        
        // Replace selection with the code element
        range.deleteContents();
        range.insertNode(newCodeElement);
      }
    } else {
      // If no text is selected, insert placeholder
      const codeHTML = '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; color: #000000;">código aquí</code>';
      document.execCommand('insertHTML', false, codeHTML);
    }
    
    // Update content
    if (textareaRef.current) {
      onContentChange(textareaRef.current.innerHTML);
    }
    handleTextSelection();
  }, [onContentChange, handleTextSelection]);

  const handleInsertQuote = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Check if the selection is already within a blockquote element
      let currentNode = range.commonAncestorContainer;
      let isAlreadyQuote = false;
      let blockquoteElement = null;
      
      // Traverse up the DOM tree to find if we're inside a blockquote element
      while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
        currentNode = currentNode.parentNode;
      }
      
      if (currentNode) {
        let element = currentNode as Element;
        while (element && element !== textareaRef.current) {
          if (element.tagName === 'BLOCKQUOTE') {
            isAlreadyQuote = true;
            blockquoteElement = element;
            break;
          }
          element = element.parentElement;
        }
      }
      
      if (isAlreadyQuote && blockquoteElement) {
        // Remove quote formatting - unwrap the content
        const parent = blockquoteElement.parentNode;
        if (parent) {
          // Move all child nodes out of the blockquote element
          while (blockquoteElement.firstChild) {
            parent.insertBefore(blockquoteElement.firstChild, blockquoteElement);
          }
          // Remove the empty blockquote element
          parent.removeChild(blockquoteElement);
        }
      } else {
        // Apply quote formatting - wrap in blockquote
        const newBlockquoteElement = document.createElement('blockquote');
        newBlockquoteElement.style.borderLeft = '4px solid #ccc';
        newBlockquoteElement.style.margin = '10px 0';
        newBlockquoteElement.style.paddingLeft = '10px';
        newBlockquoteElement.style.fontStyle = 'italic';
        newBlockquoteElement.textContent = selectedText;
        
        // Replace selection with the blockquote element
        range.deleteContents();
        range.insertNode(newBlockquoteElement);
      }
    } else {
      // If no text is selected, insert placeholder
      const quoteHTML = '<blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px; font-style: italic; color: #000000;">Cita aquí</blockquote>';
      document.execCommand('insertHTML', false, quoteHTML);
    }
    
    // Update content
    if (textareaRef.current) {
      onContentChange(textareaRef.current.innerHTML);
    }
    handleTextSelection();
  }, [onContentChange, handleTextSelection]);

  const handleInsertList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Check if the selection is already within a list element
    let currentNode = range.commonAncestorContainer;
    let isAlreadyList = false;
    let listElement = null;
    
    // Traverse up the DOM tree to find if we're inside a list element
    while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }
    
    if (currentNode) {
      let element = currentNode as Element;
      while (element && element !== textareaRef.current) {
        if (element.tagName === 'UL' || element.tagName === 'OL') {
          isAlreadyList = true;
          listElement = element;
          break;
        }
        element = element.parentElement;
      }
    }
    
    if (isAlreadyList && listElement) {
      // Remove list formatting - unwrap the content
      const parent = listElement.parentNode;
      if (parent) {
        // Move all list items out of the list element
        const listItems = Array.from(listElement.querySelectorAll('li'));
        listItems.forEach(li => {
          const textContent = li.textContent || '';
          const textNode = document.createTextNode(textContent + '\n');
          parent.insertBefore(textNode, listElement);
        });
        // Remove the empty list element
        parent.removeChild(listElement);
      }
    } else {
      // Apply list formatting
      const ul = document.createElement('ul');
      ul.style.margin = '8px 0';
      ul.style.paddingLeft = '20px';
      ul.style.listStyleType = 'disc';
      
      if (selectedText) {
        // If text is selected, split by lines and create list items
        const lines = selectedText.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const li = document.createElement('li');
          li.textContent = line.trim();
          li.style.color = '#000000';
          ul.appendChild(li);
        });
      } else {
        // Create default list items
        const li1 = document.createElement('li');
        li1.textContent = 'Elemento de lista';
        li1.style.color = '#000000';
        const li2 = document.createElement('li');
        li2.textContent = 'Otro elemento';
        li2.style.color = '#000000';
        ul.appendChild(li1);
        ul.appendChild(li2);
      }
      
      // Replace selection with the list
      range.deleteContents();
      range.insertNode(ul);
    }
    
    // Update content
    if (textareaRef.current) {
      onContentChange(textareaRef.current.innerHTML);
    }
    handleTextSelection();
  }, [onContentChange, handleTextSelection]);

  const handleInsertNumberedList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Check if the selection is already within a list element
    let currentNode = range.commonAncestorContainer;
    let isAlreadyList = false;
    let listElement = null;
    
    // Traverse up the DOM tree to find if we're inside a list element
    while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }
    
    if (currentNode) {
      let element = currentNode as Element;
      while (element && element !== textareaRef.current) {
        if (element.tagName === 'UL' || element.tagName === 'OL') {
          isAlreadyList = true;
          listElement = element;
          break;
        }
        element = element.parentElement;
      }
    }
    
    if (isAlreadyList && listElement) {
      // Remove list formatting - unwrap the content
      const parent = listElement.parentNode;
      if (parent) {
        // Move all list items out of the list element
        const listItems = Array.from(listElement.querySelectorAll('li'));
        listItems.forEach(li => {
          const textContent = li.textContent || '';
          const textNode = document.createTextNode(textContent + '\n');
          parent.insertBefore(textNode, listElement);
        });
        // Remove the empty list element
        parent.removeChild(listElement);
      }
    } else {
      // Apply numbered list formatting
      const ol = document.createElement('ol');
      ol.style.margin = '8px 0';
      ol.style.paddingLeft = '20px';
      ol.style.listStyleType = 'decimal';
      
      if (selectedText) {
        // If text is selected, split by lines and create list items
        const lines = selectedText.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const li = document.createElement('li');
          li.textContent = line.trim();
          li.style.color = '#000000';
          ol.appendChild(li);
        });
      } else {
        // Create default list items
        const li1 = document.createElement('li');
        li1.textContent = 'Elemento numerado';
        li1.style.color = '#000000';
        const li2 = document.createElement('li');
        li2.textContent = 'Otro elemento';
        li2.style.color = '#000000';
        ol.appendChild(li1);
        ol.appendChild(li2);
      }
      
      // Replace selection with the list
      range.deleteContents();
      range.insertNode(ol);
    }
    
    // Update content
    if (textareaRef.current) {
      onContentChange(textareaRef.current.innerHTML);
    }
    handleTextSelection();
  }, [onContentChange, handleTextSelection]);

  const handleIndent = useCallback(() => {
    document.execCommand('indent', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleOutdent = useCallback(() => {
    document.execCommand('outdent', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleFindReplace = useCallback(() => {
    // Simple find and replace implementation
    const searchTerm = prompt('Buscar:');
    if (searchTerm) {
      const replaceTerm = prompt('Reemplazar con:');
      if (replaceTerm && textareaRef.current) {
        const content = textareaRef.current.innerHTML;
        const newContent = content.replace(new RegExp(searchTerm, 'g'), replaceTerm);
        textareaRef.current.innerHTML = newContent;
        onContentChange(newContent);
      }
    }
  }, [onContentChange]);

  const handleSelectAll = useCallback(() => {
    if (textareaRef.current) {
      const range = document.createRange();
      range.selectNodeContents(textareaRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  const [showFormatSelectionModal, setShowFormatSelectionModal] = useState(false);
  const [formatSelectionType, setFormatSelectionType] = useState<string>('');
  const [showGradientTextModal, setShowGradientTextModal] = useState(false);
  const [showGradientBackgroundModal, setShowGradientBackgroundModal] = useState(false);
  const [gradientType, setGradientType] = useState<'text' | 'background'>('text');

  const handleSelectByFormat = useCallback(() => {
    setShowFormatSelectionModal(true);
  }, []);

  const selectByFormat = useCallback((formatType: string) => {
    if (!textareaRef.current) return;
    
    const selection = window.getSelection();
    if (!selection) return;

    // Clear current selection
    selection.removeAllRanges();
    
    // Find all elements with the specified format
    const elements = textareaRef.current.querySelectorAll('*');
    const matchingElements: Element[] = [];
    
    elements.forEach(element => {
      let matches = false;
      
      switch (formatType) {
        case 'bold':
          matches = element.tagName === 'B' || element.tagName === 'STRONG' || 
                   (element as HTMLElement).style.fontWeight === 'bold' ||
                   (element as HTMLElement).style.fontWeight === '700';
          break;
        case 'italic':
          matches = element.tagName === 'I' || element.tagName === 'EM' ||
                   (element as HTMLElement).style.fontStyle === 'italic';
          break;
        case 'underline':
          matches = element.tagName === 'U' ||
                   !!((element as HTMLElement).style.textDecoration?.includes('underline'));
          break;
        case 'colored':
          matches = !!(element as HTMLElement).style.color && 
                   (element as HTMLElement).style.color !== 'inherit' &&
                   (element as HTMLElement).style.color !== 'rgb(0, 0, 0)' &&
                   (element as HTMLElement).style.color !== '#000000';
          break;
        case 'highlighted':
          matches = !!((element as HTMLElement).style.backgroundColor && 
                   (element as HTMLElement).style.backgroundColor !== 'transparent' &&
                   (element as HTMLElement).style.backgroundColor !== 'rgba(0, 0, 0, 0)');
          break;
        case 'links':
          matches = element.tagName === 'A';
          break;
        case 'lists':
          matches = element.tagName === 'LI';
          break;
        case 'headings':
          matches = /^H[1-6]$/.test(element.tagName);
          break;
      }
      
      if (matches) {
        matchingElements.push(element);
      }
    });
    
    if (matchingElements.length === 0) {
      alert(`No se encontraron elementos con formato "${formatType}"`);
      return;
    }
    
    // Create a range that includes all matching elements
    const range = document.createRange();
    const firstElement = matchingElements[0];
    const lastElement = matchingElements[matchingElements.length - 1];
    
    range.setStart(firstElement, 0);
    range.setEnd(lastElement, lastElement.childNodes.length || 0);
    
    selection.addRange(range);
    setShowFormatSelectionModal(false);
    
    // Show feedback
    alert(`Seleccionados ${matchingElements.length} elementos con formato "${formatType}"`);
  }, []);

  // Calculate word and character count
  const updateWordCount = useCallback((text: string) => {
    // Create a temporary div to extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Get only the text content, excluding HTML tags
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Split by whitespace and filter out empty strings
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(textContent.length);
  }, []);

  // Update undo/redo state when content changes
  useEffect(() => {
    if (content !== lastContentRef.current) {
      setUndoStack([...undoStack, lastContentRef.current]);
      setRedoStack([]);
      setCanUndo(undoStack.length > 0);
      setCanRedo(false);
      lastContentRef.current = content;
      updateWordCount(content);
    }
  }, [content, undoStack, updateWordCount]);

  // Handle keyboard shortcuts
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    // Call the original onKeyDown handler first
    onKeyDown(e);
    
    // Handle Shift+Enter for list items
    if (e.shiftKey && e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      
      // Find if we're inside a list item
      let listItem = null;
      let parent = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentNode : currentNode;
      
      while (parent && parent !== textareaRef.current) {
        if (parent.nodeName === 'LI') {
          listItem = parent;
          break;
        }
        parent = parent.parentNode;
      }
      
      if (listItem) {
        e.preventDefault();
        
        // Create a new list item
        const newLi = document.createElement('li');
        newLi.textContent = '\u200B'; // Zero-width space to maintain cursor position
        
        // Insert the new list item after the current one
        const list = listItem.parentNode;
        if (list) {
          list.insertBefore(newLi, listItem.nextSibling);
          
          // Move cursor to the new list item
          const newRange = document.createRange();
          newRange.setStart(newLi, 0);
          newRange.collapse(true);
          
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Update content
          if (textareaRef.current) {
            onContentChange(textareaRef.current.innerHTML);
          }
        }
        return;
      }
    }
    
    // Handle Enter key for list items
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      
      // Find if we're inside a list item
      let listItem = null;
      let parent = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentNode : currentNode;
      
      while (parent && parent !== textareaRef.current) {
        if (parent.nodeName === 'LI') {
          listItem = parent;
          break;
        }
        parent = parent.parentNode;
      }
      
      if (listItem) {
        e.preventDefault();
        
        // Check if the current list item is empty or only contains whitespace
        const listItemText = listItem.textContent || '';
        const isEmpty = listItemText.trim() === '' || listItemText.trim() === '\u200B';
        
        if (isEmpty) {
          // If list item is empty, exit the list
          const list = listItem.parentNode;
          if (list) {
            // Check if this is the only item in the list
            const isOnlyItem = list.children.length === 1;
            
            if (isOnlyItem) {
              // If it's the only item, remove the entire list and create a paragraph
              const paragraph = document.createElement('p');
              paragraph.innerHTML = '<br>';
              
              // Replace the entire list with a paragraph
              list.parentNode?.insertBefore(paragraph, list.nextSibling);
              (list as HTMLElement).remove();
              
              // Move cursor to the new paragraph
              const newRange = document.createRange();
              newRange.setStart(paragraph, 0);
              newRange.collapse(true);
              
              selection.removeAllRanges();
              selection.addRange(newRange);
            } else {
              // Create a paragraph to replace the empty list item
              const paragraph = document.createElement('p');
              paragraph.innerHTML = '<br>';
              
              // Replace the list item with the paragraph
              list.parentNode?.insertBefore(paragraph, list.nextSibling);
              list.removeChild(listItem);
              
              // Move cursor to the new paragraph
              const newRange = document.createRange();
              newRange.setStart(paragraph, 0);
              newRange.collapse(true);
              
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        } else {
          // If list item has content, create a new empty list item
          const newLi = document.createElement('li');
          newLi.textContent = '\u200B'; // Zero-width space to maintain cursor position
          
          // Insert the new list item after the current one
          const list = listItem.parentNode;
          if (list) {
            list.insertBefore(newLi, listItem.nextSibling);
            
            // Move cursor to the new list item
            const newRange = document.createRange();
            newRange.setStart(newLi, 0);
            newRange.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
        
        // Update content
        if (textareaRef.current) {
          onContentChange(textareaRef.current.innerHTML);
        }
        return;
      }
    }
    
    // Handle formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };
  
  // Focus the editor when it opens and initialize content
  useEffect(() => {
    if (isEditing && !isPreviewMode && textareaRef.current) {
      // Initialize content directly in the DOM
      if (!isInitializedRef.current) {
        textareaRef.current.innerHTML = content || '';
        lastContentRef.current = content || '';
        isInitializedRef.current = true;
      }
      textareaRef.current.focus();
    } else {
      isInitializedRef.current = false;
    }
  }, [isEditing, isPreviewMode, content]);

  // Remove the external content update effect to prevent interference
  
  if (!isEditing) return null;

  // Helper function to determine if background is dark
  const isDarkBackground = useCallback((bgColor: string) => {
    if (!bgColor || bgColor === 'transparent') return false;
    
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }, []);

  // Get appropriate text color based on background
  const getTextColor = useCallback((bgColor: string) => {
    if (!bgColor || bgColor === 'transparent') return '#1f2937';
    return isDarkBackground(bgColor) ? '#ffffff' : '#1f2937';
  }, [isDarkBackground]);

  const editorContent = (
    <>
      <style>
        {`
          .editor-content-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .editor-content-scrollbar::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 4px;
          }
          .editor-content-scrollbar::-webkit-scrollbar-thumb {
            background: #6b7280;
            border-radius: 4px;
          }
          .editor-content-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}
      </style>
      <div 
        className="enhanced-inline-editor" 
        style={{ 
          background: '#1f2937',
          color: '#f9fafb',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
      
      {/* Header with close button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #374151',
        background: '#374151'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          {elementType === 'quote' ? 'Editor de cita' : 
           elementType === 'h1' ? 'Título principal' : 
           elementType === 'h2' ? 'Título secundario' : 
           'Editor de texto enriquecido'}
        </h3>
        <button
          onClick={onComplete}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '18px',
            lineHeight: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Cerrar editor"
        >
          ✕
        </button>
      </div>
      
      {/* Toolbar */}
      <RefactoredFormattingToolbar
        onBold={() => formatText('bold')}
        onItalic={() => formatText('italic')}
        onUnderline={() => formatText('underline')}
        onAlignLeft={() => formatText('align-left')}
        onAlignCenter={() => formatText('align-center')}
        onAlignRight={() => formatText('align-right')}
        onAlignJustify={() => formatText('align-justify')}
        onTextColor={() => changeTextColor()}
        onBackgroundColor={() => changeBackgroundColor()}
        onInsertLink={() => insertLink()}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onFontFamily={handleFontFamily}
        onFontSize={handleFontSize}
        onLineHeight={handleLineHeight}
        onLetterSpacing={handleLetterSpacing}
        onTextTransform={handleTextTransform}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearFormatting={handleClearFormatting}
        onTextShadow={handleTextShadow}
        onStrikethrough={handleStrikethrough}
        onSubscript={handleSubscript}
        onSuperscript={handleSuperscript}
        onGradientText={handleGradientText}
        onGradientBackground={handleGradientBackground}
        onInsertEmoji={handleInsertEmoji}
        onInsertTable={handleInsertTable}
        onInsertCode={handleInsertCode}
        onInsertQuote={handleInsertQuote}
        onInsertList={handleInsertList}
        onInsertNumberedList={handleInsertNumberedList}
        onIndent={handleIndent}
        onOutdent={handleOutdent}
        onFindReplace={handleFindReplace}
        onSelectAll={handleSelectAll}
        onSelectByFormat={handleSelectByFormat}
        isPreviewMode={isPreviewMode}
        hasSelection={selectedText.length > 0}
        canUndo={canUndo}
        canRedo={canRedo}
        wordCount={wordCount}
        charCount={charCount}
      />

      {/* Editor Content */}
      <div className="editor-content" style={{ flex: 1, padding: '20px', minHeight: '350px' }}>
        {isPreviewMode ? (
          /* Preview Mode */
          <div
            ref={editorRef}
            className="preview-content"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(content) || `<span style="color: #9ca3af; font-style: italic;">${placeholder}</span>` 
            }}
            style={{
              minHeight: '200px',
              padding: '12px',
              border: '1px solid #374151',
              borderRadius: '6px',
              backgroundColor: backgroundColor || '#ffffff',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.6',
              color: getTextColor(backgroundColor || '#ffffff'),
              overflow: 'auto'
            }}
          />
        ) : (
          /* Edit Mode */
          <div
            ref={textareaRef}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            lang="es"
            onInput={(e) => {
              const newContent = e.currentTarget.innerHTML;
              lastContentRef.current = newContent;
              onContentChange(newContent);
              // Update word count in real-time
              updateWordCount(newContent);
              // Update selection after content change
              setTimeout(handleTextSelection, 0);
            }}
            onKeyDown={handleEditorKeyDown}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onMouseDown={handleTextSelection}
            onKeyUp={handleTextSelection}
            data-placeholder={placeholder}
            className="editor-content-scrollbar"
            style={{
              width: '100%',
              minHeight: '280px',
              border: 'none',
              outline: 'none',
              background: backgroundColor || 'white',
              color: '#1f2937',
              fontSize: '16px',
              fontFamily: 'inherit',
              padding: '18px',
              margin: '0',
              boxSizing: 'border-box',
              overflow: 'auto',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              lineHeight: '1.6'
            }}
            onFocus={(e) => {
              if (!e.currentTarget.innerHTML || e.currentTarget.innerHTML === '<br>') {
                e.currentTarget.innerHTML = '';
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget.innerHTML || e.currentTarget.innerHTML === '<br>') {
                e.currentTarget.innerHTML = '';
              }
            }}
          />
        )}
      </div>

      {/* Link Modal */}
      <LinkModal
        isOpen={showLinkModal}
        linkData={linkData}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
        onChange={setLinkData}
      />

      {/* Color Modal */}
      <ColorPicker
        isOpen={showColorModal}
        value={colorData}
        onChange={setColorData}
        onClose={() => setShowColorModal(false)}
        onSubmit={(color) => handleColorSubmit(color)}
        title="Color de texto"
      />

      {/* Background Color Modal */}
      <ColorPicker
        isOpen={showBgColorModal}
        value={bgColorData}
        onChange={setBgColorData}
        onClose={() => setShowBgColorModal(false)}
        onSubmit={(color) => handleBgColorSubmit(color)}
        title="Color de fondo"
      />

      {/* Gradient Selection Modal */}
      {(showGradientTextModal || showGradientBackgroundModal) && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000001
          }}
          onClick={() => {
            setShowGradientTextModal(false);
            setShowGradientBackgroundModal(false);
          }}
        >
          <div 
            style={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              minWidth: '320px',
              maxWidth: '380px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              color: '#f9fafb', 
              margin: '0 0 8px 0', 
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {gradientType === 'text' ? 'Gradiente de Texto' : 'Gradiente de Fondo'}
            </h3>
            <p style={{ 
              color: '#d1d5db', 
              margin: '0 0 10px 0', 
              fontSize: '12px'
            }}>
              Selecciona un gradiente para aplicar:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { name: 'Sunset', gradient: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' },
                { name: 'Ocean', gradient: 'linear-gradient(45deg, #667eea, #764ba2)' },
                { name: 'Forest', gradient: 'linear-gradient(45deg, #11998e, #38ef7d)' },
                { name: 'Fire', gradient: 'linear-gradient(45deg, #ff416c, #ff4b2b)' },
                { name: 'Purple', gradient: 'linear-gradient(45deg, #a855f7, #ec4899)' },
                { name: 'Blue', gradient: 'linear-gradient(45deg, #3b82f6, #1d4ed8)' },
                { name: 'Green', gradient: 'linear-gradient(45deg, #10b981, #059669)' },
                { name: 'Orange', gradient: 'linear-gradient(45deg, #f97316, #ea580c)' },
                { name: 'Pink', gradient: 'linear-gradient(45deg, #ec4899, #be185d)' },
                { name: 'Teal', gradient: 'linear-gradient(45deg, #14b8a6, #0d9488)' },
                { name: 'Yellow', gradient: 'linear-gradient(45deg, #eab308, #ca8a04)' },
                { name: 'Red', gradient: 'linear-gradient(45deg, #ef4444, #dc2626)' },
                { name: 'Rainbow', gradient: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)' },
                { name: 'Neon', gradient: 'linear-gradient(45deg, #00ffff, #ff00ff)' },
                { name: 'Gold', gradient: 'linear-gradient(45deg, #ffd700, #ffa500)' },
                { name: 'Silver', gradient: 'linear-gradient(45deg, #c0c0c0, #808080)' }
              ].map(({ name, gradient }) => (
                <button
                  key={name}
                  onClick={() => applyGradient(gradient, gradientType)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px',
                    background: 'transparent',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: '#f9fafb',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                    minHeight: '56px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#374151';
                    e.currentTarget.style.borderColor = '#6b7280';
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#4b5563';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      background: gradient,
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  />
                  <span style={{ fontWeight: '500', fontSize: '11px' }}>{name}</span>
                </button>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '12px',
              gap: '6px'
            }}>
              <button
                onClick={() => {
                  setShowGradientTextModal(false);
                  setShowGradientBackgroundModal(false);
                }}
                style={{
                  padding: '6px 14px',
                  background: '#6b7280',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#f9fafb',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Format Selection Modal */}
      {showFormatSelectionModal && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000001
          }}
          onClick={() => setShowFormatSelectionModal(false)}
        >
          <div 
            style={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '16px',
              minWidth: '280px',
              maxWidth: '320px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              color: '#f9fafb', 
              margin: '0 0 12px 0', 
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Seleccionar por formato
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { type: 'bold', label: 'Negrita', icon: 'B' },
                { type: 'italic', label: 'Cursiva', icon: 'I' },
                { type: 'underline', label: 'Subrayado', icon: 'U' },
                { type: 'colored', label: 'Coloreado', icon: '🎨' },
                { type: 'highlighted', label: 'Resaltado', icon: '🖍️' },
                { type: 'links', label: 'Enlaces', icon: '🔗' },
                { type: 'lists', label: 'Listas', icon: '📝' },
                { type: 'headings', label: 'Títulos', icon: 'H' }
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => selectByFormat(type)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px 8px',
                    background: 'transparent',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: '#f9fafb',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#374151';
                    e.currentTarget.style.borderColor = '#6b7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#4b5563';
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '12px'
            }}>
              <button
                onClick={() => setShowFormatSelectionModal(false)}
                style={{
                  padding: '6px 14px',
                  background: '#6b7280',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#f9fafb',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Emoji Picker Modal */}
      <EmojiPicker
        isOpen={emojiPicker.showEmojiModal}
        onClose={emojiPicker.closeEmojiModal}
        onEmojiSelect={(emoji) => emojiPicker.handleEmojiSelect(emoji, handleEmojiInsert)}
        emojiSearchTerm={emojiPicker.emojiSearchTerm}
        setEmojiSearchTerm={emojiPicker.setEmojiSearchTerm}
        selectedEmojiCategory={emojiPicker.selectedEmojiCategory}
        setSelectedEmojiCategory={emojiPicker.setSelectedEmojiCategory}
        emojiCategories={emojiPicker.emojiCategories}
        filteredEmojis={emojiPicker.filteredEmojis}
      />
    </div>
    </>
  );

  return editorContent;
}; 