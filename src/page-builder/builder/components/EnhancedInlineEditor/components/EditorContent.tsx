import React, { useCallback } from 'react';
import { sanitizeHtml } from '../utils/htmlSanitizer';

interface EditorContentProps {
  isPreviewMode: boolean;
  content: string;
  placeholder: string;
  backgroundColor?: string;
  textareaRef: React.RefObject<HTMLDivElement>;
  editorRef: React.RefObject<HTMLDivElement>;
  onContentChange: (content: string) => void;
  onEditorKeyDown: (e: React.KeyboardEvent) => void;
  onTextSelection: () => void;
  updateWordCount: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  isPreviewMode,
  content,
  placeholder,
  backgroundColor,
  textareaRef,
  editorRef,
  onContentChange,
  onEditorKeyDown,
  onTextSelection,
  updateWordCount
}) => {
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

  return (
    <div className="editor-content" style={{ flex: 1, padding: '20px', minHeight: '350px' }}>
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
            onContentChange(newContent);
            // Update word count in real-time
            updateWordCount(newContent);
            // Update selection after content change
            setTimeout(onTextSelection, 0);
          }}
          onKeyDown={onEditorKeyDown}
          onSelect={onTextSelection}
          onMouseUp={onTextSelection}
          onMouseDown={onTextSelection}
          onKeyUp={onTextSelection}
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
  );
}; 