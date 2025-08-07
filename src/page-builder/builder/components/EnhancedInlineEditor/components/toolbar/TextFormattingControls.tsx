import React from 'react';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';

interface TextFormattingControlsProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const TextFormattingControls: React.FC<TextFormattingControlsProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  showTooltip,
  hideTooltip
}) => {
  return (
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
          onBold();
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
          showTooltip('Negrita (Ctrl+B)', e);
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
          showTooltip('Cursiva (Ctrl+I)', e);
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
          showTooltip('Subrayado (Ctrl+U)', e);
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
          showTooltip('Tachado', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        <Strikethrough size={16} />
      </button>
    </div>
  );
}; 