import React from 'react';
import { Sparkles, Rainbow } from 'lucide-react';

interface AdvancedTextControlsProps {
  onSubscript: () => void;
  onSuperscript: () => void;
  onTextShadow: () => void;
  onGradientText: () => void;
  onGradientBackground: () => void;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const AdvancedTextControls: React.FC<AdvancedTextControlsProps> = ({
  onSubscript,
  onSuperscript,
  onTextShadow,
  onGradientText,
  onGradientBackground,
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
          onSubscript();
        }}
        style={{
          padding: '6px',
          borderRadius: '4px',
          background: 'transparent',
          border: 'none',
          color: '#f9fafb',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#4b5563';
          showTooltip('Subíndice', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        X₂
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSuperscript();
        }}
        style={{
          padding: '6px',
          borderRadius: '4px',
          background: 'transparent',
          border: 'none',
          color: '#f9fafb',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#4b5563';
          showTooltip('Superíndice', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        X²
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onTextShadow();
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
          showTooltip('Sombra de texto', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        <Sparkles size={16} />
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGradientText();
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGradientBackground();
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
    </div>
  );
}; 