import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface AlignmentControlsProps {
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignJustify: () => void;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignJustify,
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
          showTooltip('Alinear izquierda', e);
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
          showTooltip('Centrar', e);
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
          showTooltip('Alinear derecha', e);
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
          showTooltip('Justificar', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        <AlignJustify size={16} />
      </button>
    </div>
  );
}; 