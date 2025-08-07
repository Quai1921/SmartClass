import React, { useState } from 'react';
import { Type } from 'lucide-react';

interface TypographyControlsProps {
  hasSelection: boolean;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
  onFontFamily: (font: string) => void;
  onFontSize: (size: string) => void;
  onLineHeight: (height: string) => void;
  onLetterSpacing: (spacing: string) => void;
  onTextTransform: (transform: string) => void;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const TypographyControls: React.FC<TypographyControlsProps> = ({
  hasSelection,
  openDropdown,
  setOpenDropdown,
  onFontFamily,
  onFontSize,
  onLineHeight,
  onLetterSpacing,
  onTextTransform,
  showTooltip,
  hideTooltip
}) => {
  return (
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
            <option value="normal">Normal</option>
            <option value="0.5px">0.5px</option>
            <option value="1px">1px</option>
            <option value="1.5px">1.5px</option>
            <option value="2px">2px</option>
            <option value="3px">3px</option>
            <option value="4px">4px</option>
            <option value="5px">5px</option>
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
              showTooltip('Transformar texto', e);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
            <path d="M7 8v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8"/>
            <path d="M12 8v8"/>
            <path d="M9 12h6"/>
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
              width: '120px',
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
  );
}; 