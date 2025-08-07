import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Link,
  Eye,
  Type,
  Undo,
  Redo,
  Eraser,
  Strikethrough,
  Subscript,
  Superscript,
  Rainbow,
  Smile,
  Table,
  Code,
  Quote,
  List,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  Search,
  MousePointer,
  Sparkles,
  Brush
} from 'lucide-react';

interface EnhancedFormattingToolbarProps {
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

export const EnhancedFormattingToolbar: React.FC<EnhancedFormattingToolbarProps> = ({
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
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Hide tooltips when dropdowns are open
  useEffect(() => {
    if (openDropdown) {
      hideTooltip();
    }
  }, [openDropdown]);

  const showTooltip = (text: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    const tooltipData = {
      text,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10
    };
    
    setTooltip(tooltipData);
  };

  const hideTooltip = () => {
    setTooltip(null);
  };
  return (
    <div className="enhanced-formatting-toolbar" style={{
      background: '#374151',
      borderBottom: '1px solid #4b5563',
      padding: '12px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '4px',
      overflow: 'hidden',
      maxWidth: '100%',
      minHeight: 'fit-content'
    }}>
      {/* History Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px', 
        borderRight: '1px solid #4b5563', 
        paddingRight: '8px',
        flexWrap: 'wrap',
        minWidth: 'fit-content'
      }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUndo();
          }}
          disabled={!canUndo}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            opacity: canUndo ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (canUndo) {
              e.currentTarget.style.background = '#4b5563';
              showTooltip('Deshacer (Ctrl+Z)', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Undo size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRedo();
          }}
          disabled={!canRedo}
          style={{
            padding: '6px',
            borderRadius: '4px',
            background: 'transparent',
            border: 'none',
            color: '#f9fafb',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            opacity: canRedo ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (canRedo) {
              e.currentTarget.style.background = '#4b5563';
              showTooltip('Rehacer (Ctrl+Y)', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Redo size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClearFormatting();
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
              showTooltip('Limpiar formato', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Eraser size={16} />
        </button>
      </div>

      {/* Typography Section */}
      <div 
        data-dropdown
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          borderRight: '1px solid #4b5563', 
          paddingRight: '8px',
          position: 'relative',
          zIndex: 1000
        }}
      >
        {/* Font Family */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => {
              if (!hasSelection) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'fontFamily' ? null : 'fontFamily');
            }}
            style={{
              padding: '6px',
              borderRadius: '4px',
              background: 'transparent',
              border: 'none',
              color: '#f9fafb',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.5,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minWidth: '32px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!openDropdown) {
                e.currentTarget.style.background = '#4b5563';
                showTooltip('Familia de fuente', e);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              hideTooltip();
            }}
          >
            <Type size={16} />
          </button>
          {openDropdown === 'fontFamily' && (
            <select
              onChange={(e) => {
                onFontFamily(e.target.value);
                setOpenDropdown(null);
              }}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '140px',
                height: 'auto',
                opacity: 1,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                zIndex: 1001,
                marginTop: '2px'
              }}
              autoFocus
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          )}
        </div>

        {/* Font Size */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => {
              if (!hasSelection) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'fontSize' ? null : 'fontSize');
            }}
            style={{
              padding: '6px',
              borderRadius: '4px',
              background: 'transparent',
              border: 'none',
              color: '#f9fafb',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.5,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minWidth: '32px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!openDropdown) {
                e.currentTarget.style.background = '#4b5563';
                showTooltip('Tamaño de fuente', e);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              hideTooltip();
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>A</span>
          </button>
          {openDropdown === 'fontSize' && (
            <select
              onChange={(e) => {
                onFontSize(e.target.value);
                setOpenDropdown(null);
              }}
              disabled={!hasSelection}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '80px',
                height: 'auto',
                opacity: 1,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                zIndex: 1001,
                marginTop: '2px'
              }}
              autoFocus
            >
              <option value="8px">8px</option>
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
              <option value="36px">36px</option>
              <option value="48px">48px</option>
            </select>
          )}
        </div>

        {/* Line Height */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => {
              if (!hasSelection) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'lineHeight' ? null : 'lineHeight');
            }}
            style={{
              padding: '6px',
              borderRadius: '4px',
              background: 'transparent',
              border: 'none',
              color: '#f9fafb',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.5,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minWidth: '32px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!openDropdown) {
                e.currentTarget.style.background = '#4b5563';
                showTooltip('Altura de línea', e);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              hideTooltip();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"/>
              <path d="M3 12h18"/>
              <path d="M3 18h18"/>
            </svg>
          </button>
          {openDropdown === 'lineHeight' && (
            <select
              onChange={(e) => {
                onLineHeight(e.target.value);
                setOpenDropdown(null);
              }}
              disabled={!hasSelection}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '80px',
                height: 'auto',
                opacity: 1,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                zIndex: 1001,
                marginTop: '2px'
              }}
              autoFocus
            >
              <option value="1">1.0</option>
              <option value="1.2">1.2</option>
              <option value="1.4">1.4</option>
              <option value="1.6">1.6</option>
              <option value="1.8">1.8</option>
              <option value="2">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3">3.0</option>
            </select>
          )}
        </div>

        {/* Letter Spacing */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => {
              if (!hasSelection) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'letterSpacing' ? null : 'letterSpacing');
            }}
            style={{
              padding: '6px',
              borderRadius: '4px',
              background: 'transparent',
              border: 'none',
              color: '#f9fafb',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.5,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minWidth: '32px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!openDropdown) {
                e.currentTarget.style.background = '#4b5563';
                showTooltip('Espaciado de letras', e);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              hideTooltip();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"/>
              <path d="M9 20h6"/>
              <path d="M12 4v16"/>
              <path d="M16 7h4"/>
              <path d="M8 7H4"/>
            </svg>
          </button>
          {openDropdown === 'letterSpacing' && (
            <select
              onChange={(e) => {
                onLetterSpacing(e.target.value);
                setOpenDropdown(null);
              }}
              disabled={!hasSelection}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '100px',
                height: 'auto',
                opacity: 1,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                zIndex: 1001,
                marginTop: '2px'
              }}
              autoFocus
            >
              <option value="0px">Normal</option>
              <option value="1px">Ajustado</option>
              <option value="2px">Suelto</option>
              <option value="3px">Muy suelto</option>
              <option value="-1px">Muy ajustado</option>
            </select>
          )}
        </div>

        {/* Text Transform */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={(e) => {
              if (!hasSelection) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setOpenDropdown(openDropdown === 'textTransform' ? null : 'textTransform');
            }}
            style={{
              padding: '6px',
              borderRadius: '4px',
              background: 'transparent',
              border: 'none',
              color: '#f9fafb',
              cursor: hasSelection ? 'pointer' : 'not-allowed',
              opacity: hasSelection ? 1 : 0.5,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minWidth: '32px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!openDropdown) {
                e.currentTarget.style.background = '#4b5563';
                showTooltip('Transformación de texto', e);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              hideTooltip();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"/>
              <path d="M9 20h6"/>
              <path d="M12 4v16"/>
              <path d="M16 7h4"/>
              <path d="M8 7H4"/>
            </svg>
          </button>
          {openDropdown === 'textTransform' && (
            <select
              onChange={(e) => {
                onTextTransform(e.target.value);
                setOpenDropdown(null);
              }}
              disabled={!hasSelection}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '100px',
                height: 'auto',
                opacity: 1,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                zIndex: 1001,
                marginTop: '2px'
              }}
              autoFocus
            >
              <option value="none">Normal</option>
              <option value="uppercase">MAYÚSCULAS</option>
              <option value="lowercase">minúsculas</option>
              <option value="capitalize">Capitalizar</option>
            </select>
          )}
        </div>
      </div>

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
              showTooltip('Negrita (Ctrl+B)', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Bold size={16} />
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
              showTooltip('Cursiva (Ctrl+I)', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Italic size={16} />
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
              showTooltip('Subrayado (Ctrl+U)', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Underline size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStrikethrough();
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
              showTooltip('Tachado', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Strikethrough size={16} />
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
              showTooltip('Alinear izquierda', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <AlignLeft size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignCenter();
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
              showTooltip('Alinear centro', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <AlignCenter size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignRight();
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
              showTooltip('Alinear derecha', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <AlignRight size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAlignJustify();
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
              showTooltip('Justificar', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Colors & Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTextColor();
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
              showTooltip('Color de texto', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Palette size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBackgroundColor();
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
              showTooltip('Color de fondo', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Highlighter size={16} />
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
              showTooltip('Insertar enlace', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Link size={16} />
        </button>
      </div>

      {/* Text Effects */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTextShadow();
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
              showTooltip('Sombra de texto', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Brush size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubscript();
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
              showTooltip('Subíndice', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Subscript size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSuperscript();
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
              showTooltip('Superíndice', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Superscript size={16} />
        </button>
      </div>

      {/* Advanced Insert & Effects */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #4b5563', paddingRight: '8px' }}>
        <button 
          onClick={onInsertEmoji} 
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
            showTooltip('Emoji', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Smile size={16} />
        </button>
        <button 
          onClick={onInsertTable} 
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
            showTooltip('Tabla', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Table size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertCode();
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
            showTooltip('Código (toggle)', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Code size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertQuote();
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
            showTooltip('Cita (toggle)', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Quote size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertList();
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
            showTooltip('Lista (toggle)', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <List size={16} />
        </button>
        <button 
          onClick={onInsertNumberedList} 
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
            showTooltip('Lista numerada (toggle)', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <ListOrdered size={16} />
        </button>
        <button 
          onClick={onGradientText} 
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
            showTooltip('Texto gradiente', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Rainbow size={16} />
        </button>
        <button 
          onClick={onGradientBackground} 
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
            showTooltip('Fondo gradiente', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <div style={{ position: 'relative' }}>
            <Rainbow size={16} />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '2px',
              border: '1px solid #f9fafb'
            }} />
          </div>
        </button>
        <button 
          onClick={onIndent} 
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
            showTooltip('Indentar', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <IndentIncrease size={16} />
        </button>
        <button 
          onClick={onOutdent} 
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
            showTooltip('Desindentar', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <IndentDecrease size={16} />
        </button>
        <button 
          onClick={onFindReplace} 
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
            showTooltip('Buscar/Reemplazar', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Search size={16} />
        </button>
        <button 
          onClick={onSelectAll} 
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
            showTooltip('Seleccionar todo', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <MousePointer size={16} />
        </button>
        <button 
          onClick={onSelectByFormat} 
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
            showTooltip('Seleccionar por formato', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Sparkles size={16} />
        </button>
      </div>

      {/* Word Count Display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        borderRight: '1px solid #4b5563', 
        paddingRight: '8px',
        fontSize: '12px',
        color: '#9ca3af',
        flexWrap: 'wrap',
        minWidth: 'fit-content'
      }}>
        <span>{wordCount} palabras</span>
        <span>{charCount} caracteres</span>
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
          <Eye size={16} />
        </button>
      </div>
      
      {/* Render tooltip using React Portal */}
      {tooltip && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            transform: 'translate(-50%, 0%)',
            background: '#1f2937',
            color: '#f9fafb',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 999999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid #4b5563',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {tooltip.text}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '6px solid transparent',
              borderBottomColor: '#1f2937'
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}; 