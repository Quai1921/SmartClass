import React from 'react';
import { Link, Eye } from 'lucide-react';

interface UtilityControlsProps {
  onInsertLink: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  wordCount: number;
  charCount: number;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const UtilityControls: React.FC<UtilityControlsProps> = ({
  onInsertLink,
  onTogglePreview,
  isPreviewMode,
  wordCount,
  charCount,
  showTooltip,
  hideTooltip
}) => {
  return (
    <>
      {/* Link Insertion */}
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
            onInsertLink();
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
            showTooltip('Insertar enlace', e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            hideTooltip();
          }}
        >
          <Link size={16} />
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
    </>
  );
}; 