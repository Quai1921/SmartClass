import React from 'react';
import { Undo, Redo, Eraser } from 'lucide-react';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onClearFormatting: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
  onClearFormatting,
  canUndo,
  canRedo,
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
          showTooltip('Limpiar formato', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        <Eraser size={16} />
      </button>
    </div>
  );
}; 