import React, { useState, useEffect, useCallback } from 'react';
import { RefactoredFormattingToolbar } from './RefactoredFormattingToolbar';
import { useEnhancedEditing } from './hooks/useEnhancedEditing';
import { useEmojiPicker } from './hooks/useEmojiPicker';
import { LinkModal } from './LinkModal';
import { ColorPicker } from './ColorPicker';
import {
  EditorHeader,
  EditorContent,
  GradientSelectionModal,
  FormatSelectionModal,
  EmojiPicker
} from './components';

interface RefactoredEnhancedInlineEditorProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onComplete: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  elementType?: string;
  backgroundColor?: string;
}

export const RefactoredEnhancedInlineEditor: React.FC<RefactoredEnhancedInlineEditorProps> = ({
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

  // Modal states
  const [showGradientTextModal, setShowGradientTextModal] = useState(false);
  const [showGradientBackgroundModal, setShowGradientBackgroundModal] = useState(false);
  const [showFormatSelectionModal, setShowFormatSelectionModal] = useState(false);
  const [gradientType, setGradientType] = useState<'text' | 'background'>('text');

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
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(range.cloneContents());
        const existingHTML = tempDiv.innerHTML;
        
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
        document.execCommand('insertText', false, plainText);
        handleTextSelection();
      }
    }
  }, [handleTextSelection]);

  // Advanced formatting functions
  const handleTextShadow = useCallback(() => {
    applyStylePreservingExisting('text-shadow', '2px 2px 4px rgba(0,0,0,0.3)');
  }, [applyStylePreservingExisting]);

  const handleStrikethrough = useCallback(() => {
    formatText('strikethrough');
  }, [formatText]);

  const handleSubscript = useCallback(() => {
    formatText('subscript');
  }, [formatText]);

  const handleSuperscript = useCallback(() => {
    formatText('superscript');
  }, [formatText]);

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
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        if (type === 'text') {
          const newHTML = `<span style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${range.toString()}</span>`;
          document.execCommand('insertHTML', false, newHTML);
        } else {
          const newHTML = `<span style="background: ${gradient}; padding: 2px 4px; border-radius: 3px;">${range.toString()}</span>`;
          document.execCommand('insertHTML', false, newHTML);
        }
        handleTextSelection();
      }
    }
    setShowGradientTextModal(false);
    setShowGradientBackgroundModal(false);
  }, [handleTextSelection]);

  // Content insertion functions
  const handleInsertEmoji = useCallback(() => {
    emojiPicker.openEmojiModal();
  }, [emojiPicker]);

  const handleEmojiInsert = useCallback((emoji: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      document.execCommand('insertText', false, emoji);
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
    const codeHTML = '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;">código aquí</code>';
    document.execCommand('insertHTML', false, codeHTML);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleInsertQuote = useCallback(() => {
    const quoteHTML = '<blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px; font-style: italic;">Cita aquí</blockquote>';
    document.execCommand('insertHTML', false, quoteHTML);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleInsertList = useCallback(() => {
    const listHTML = '<ul><li>Elemento de lista</li></ul>';
    document.execCommand('insertHTML', false, listHTML);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleInsertNumberedList = useCallback(() => {
    const listHTML = '<ol><li>Elemento numerado</li></ol>';
    document.execCommand('insertHTML', false, listHTML);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleIndent = useCallback(() => {
    formatText('indent');
  }, [formatText]);

  const handleOutdent = useCallback(() => {
    formatText('outdent');
  }, [formatText]);

  // Search and selection functions
  const handleFindReplace = useCallback(() => {
    // TODO: Implement find and replace functionality
  }, []);

  const handleSelectAll = useCallback(() => {
    document.execCommand('selectAll', false);
    handleTextSelection();
  }, [handleTextSelection]);

  const handleSelectByFormat = useCallback(() => {
    setShowFormatSelectionModal(true);
  }, []);

  const selectByFormat = useCallback((formatType: string) => {
    // TODO: Implement format-based selection
    setShowFormatSelectionModal(false);
  }, []);

  // Word count function
  const updateWordCount = useCallback((content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = textContent.length;
    
    setWordCount(words.length);
    setCharCount(chars);
  }, []);

  // Editor key down handler
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [formatText, insertLink]);

  // Focus the editor when it opens and initialize content
  useEffect(() => {
    if (isEditing && !isPreviewMode && textareaRef.current) {
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

  if (!isEditing) return null;

  return (
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
      {/* Header */}
      <EditorHeader
        elementType={elementType}
        onComplete={onComplete}
      />
      
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
      <EditorContent
        isPreviewMode={isPreviewMode}
        content={content}
        placeholder={placeholder}
        backgroundColor={backgroundColor}
        textareaRef={textareaRef}
        editorRef={editorRef}
        onContentChange={onContentChange}
        onEditorKeyDown={handleEditorKeyDown}
        onTextSelection={handleTextSelection}
        updateWordCount={updateWordCount}
      />

      {/* Modals */}
      <LinkModal
        isOpen={showLinkModal}
        linkData={linkData}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
        onChange={setLinkData}
      />

      <ColorPicker
        isOpen={showColorModal}
        value={colorData}
        onChange={setColorData}
        onClose={() => setShowColorModal(false)}
        onSubmit={(color) => handleColorSubmit(color)}
        title="Color de texto"
      />

      <ColorPicker
        isOpen={showBgColorModal}
        value={bgColorData}
        onChange={setBgColorData}
        onClose={() => setShowBgColorModal(false)}
        onSubmit={(color) => handleBgColorSubmit(color)}
        title="Color de fondo"
      />

      <GradientSelectionModal
        isOpen={showGradientTextModal || showGradientBackgroundModal}
        gradientType={gradientType}
        onClose={() => {
          setShowGradientTextModal(false);
          setShowGradientBackgroundModal(false);
        }}
        onGradientSelect={applyGradient}
      />

      <FormatSelectionModal
        isOpen={showFormatSelectionModal}
        onClose={() => setShowFormatSelectionModal(false)}
        onFormatSelect={selectByFormat}
      />

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
  );
};