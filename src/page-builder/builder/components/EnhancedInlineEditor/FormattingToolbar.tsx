import React from 'react';

interface FormattingToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignJustify: () => void;
  onTextColor: () => void;
  onBackgroundColor: () => void;
  onInsertLink: () => void;
  onTogglePreview: () => void;
  onFontFamily: (font: string) => void;
  onFontSize: (size: string) => void;
  onLineHeight: (height: string) => void;
  onLetterSpacing: (spacing: string) => void;
  onTextTransform: (transform: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearFormatting: () => void;
  onTextShadow: () => void;
  onStrikethrough: () => void;
  onSubscript: () => void;
  onSuperscript: () => void;
  onGradientText: () => void;
  onGradientBackground: () => void;
  onInsertEmoji: () => void;
  onInsertTable: () => void;
  onInsertCode: () => void;
  onInsertQuote: () => void;
  onInsertList: () => void;
  onInsertNumberedList: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  onFindReplace: () => void;
  onSelectAll: () => void;
  onSelectByFormat: () => void;
  isPreviewMode: boolean;
  hasSelection: boolean;
  canUndo: boolean;
  canRedo: boolean;
  wordCount: number;
  charCount: number;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignJustify,
  onTextColor,
  onBackgroundColor,
  onInsertLink,
  onTogglePreview,
  onFontFamily,
  onFontSize,
  onLineHeight,
  onLetterSpacing,
  onTextTransform,
  onUndo,
  onRedo,
  onClearFormatting,
  onTextShadow,
  onStrikethrough,
  onSubscript,
  onSuperscript,
  onGradientText,
  onGradientBackground,
  onInsertEmoji,
  onInsertTable,
  onInsertCode,
  onInsertQuote,
  onInsertList,
  onInsertNumberedList,
  onIndent,
  onOutdent,
  onFindReplace,
  onSelectAll,
  onSelectByFormat,
  isPreviewMode,
  hasSelection,
  canUndo,
  canRedo,
  wordCount,
  charCount
}) => {
  return (
    <div className="formatting-toolbar" style={{
      background: '#374151',
      borderBottom: '1px solid #4b5563',
      padding: '12px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '4px'
    }}>
      {/* Text Formatting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBold();
          }}
          disabled={!hasSelection}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (hasSelection) {
              e.currentTarget.style.background = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Negrita (Ctrl+B)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 7.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onItalic();
          }}
          disabled={!hasSelection}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (hasSelection) {
              e.currentTarget.style.background = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Cursiva (Ctrl+I)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUnderline();
          }}
          disabled={!hasSelection}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (hasSelection) {
              e.currentTarget.style.background = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Subrayado (Ctrl+U)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
          </svg>
        </button>
      </div>

      {/* Text Alignment */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignLeft();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Alinear a la izquierda"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignCenter();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Centrar"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 15v2h10v-2H7zm-4-2h2v-2H3v2zm18 0h-2v-2h2v2zM3 9h2V7H3v2zm18 0h-2V7h2v2zM7 5v2h10V5H7z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignRight();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Alinear a la derecha"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17h12v-2H3v2zm0-8h18V7H3v2zm0 8h18v-2H3v2z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignJustify();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Justificar"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
          </svg>
        </button>
      </div>

      {/* Colors and Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTextColor();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Color de texto"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBackgroundColor();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Color de fondo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm-1-8h2v2h-2v-2zm0-6h2v4h-2V8z"/>
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertLink();
          }}
          disabled={!hasSelection}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (hasSelection) {
              e.currentTarget.style.background = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Insertar enlace (Ctrl+K)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        </button>
      </div>

      {/* Typography Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        {/* Font Family */}
        <select
          onChange={(e) => onFontFamily(e.target.value)}
          disabled={!hasSelection}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#f9fafb',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            minWidth: '100px'
          }}
          title="Familia de fuente"
        >
          <option value="">Fuente</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => onFontSize(e.target.value)}
          disabled={!hasSelection}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#f9fafb',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            minWidth: '70px'
          }}
          title="Tamaño de fuente"
        >
          <option value="">Tamaño</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
        </select>

        {/* Line Height */}
        <select
          onChange={(e) => onLineHeight(e.target.value)}
          disabled={!hasSelection}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#f9fafb',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            minWidth: '70px'
          }}
          title="Altura de línea"
        >
          <option value="">Línea</option>
          <option value="1">1.0</option>
          <option value="1.2">1.2</option>
          <option value="1.4">1.4</option>
          <option value="1.6">1.6</option>
          <option value="1.8">1.8</option>
          <option value="2">2.0</option>
        </select>

        {/* Letter Spacing */}
        <select
          onChange={(e) => onLetterSpacing(e.target.value)}
          disabled={!hasSelection}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#f9fafb',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            minWidth: '70px'
          }}
          title="Espaciado de letras"
        >
          <option value="">Espaciado</option>
          <option value="normal">Normal</option>
          <option value="1px">1px</option>
          <option value="2px">2px</option>
          <option value="3px">3px</option>
          <option value="4px">4px</option>
          <option value="5px">5px</option>
        </select>

        {/* Text Transform */}
        <select
          onChange={(e) => onTextTransform(e.target.value)}
          disabled={!hasSelection}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: '#1f2937',
            border: '1px solid #4b5563',
            color: '#f9fafb',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            opacity: hasSelection ? 1 : 0.5,
            minWidth: '80px'
          }}
          title="Transformación de texto"
        >
          <option value="">Transformar</option>
          <option value="uppercase">MAYÚSCULAS</option>
          <option value="lowercase">minúsculas</option>
          <option value="capitalize">Capitalizar</option>
          <option value="none">Normal</option>
        </select>
      </div>

      {/* Preview Toggle */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePreview();
          }}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: isPreviewMode ? '#3b82f6' : 'transparent',
            border: 'none',
            color: isPreviewMode ? 'white' : '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isPreviewMode) {
              e.currentTarget.style.background = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPreviewMode) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title={isPreviewMode ? 'Modo edición' : 'Vista previa'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}; 