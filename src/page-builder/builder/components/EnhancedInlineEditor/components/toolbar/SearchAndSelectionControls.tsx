import React from 'react';
import { Search, MousePointer, Sparkles } from 'lucide-react';

interface SearchAndSelectionControlsProps {
  onFindReplace: () => void;
  onSelectAll: () => void;
  onSelectByFormat: () => void;
  showTooltip: (text: string, event: React.MouseEvent) => void;
  hideTooltip: () => void;
}

export const SearchAndSelectionControls: React.FC<SearchAndSelectionControlsProps> = ({
  onFindReplace,
  onSelectAll,
  onSelectByFormat,
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
          onFindReplace();
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
          showTooltip('Buscar y reemplazar', e);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          hideTooltip();
        }}
      >
        <Search size={16} />
      </button>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectAll();
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectByFormat();
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
  );
}; 