import React from 'react';
import { createPortal } from 'react-dom';

interface FormatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatSelect: (formatType: string) => void;
}

export const FormatSelectionModal: React.FC<FormatSelectionModalProps> = ({
  isOpen,
  onClose,
  onFormatSelect
}) => {
  if (!isOpen) return null;

  const formatOptions = [
    { type: 'bold', label: 'Negrita', icon: 'B' },
    { type: 'italic', label: 'Cursiva', icon: 'I' },
    { type: 'underline', label: 'Subrayado', icon: 'U' },
    { type: 'colored', label: 'Coloreado', icon: '🎨' },
    { type: 'highlighted', label: 'Resaltado', icon: '🖍️' },
    { type: 'links', label: 'Enlaces', icon: '🔗' },
    { type: 'lists', label: 'Listas', icon: '📝' },
    { type: 'headings', label: 'Títulos', icon: 'H' }
  ];

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000001
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '280px',
          maxWidth: '320px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ 
          color: '#f9fafb', 
          margin: '0 0 12px 0', 
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Seleccionar por formato
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {formatOptions.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onFormatSelect(type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 8px',
                background: 'transparent',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                color: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.borderColor = '#6b7280';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#4b5563';
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              background: '#6b7280',
              border: 'none',
              borderRadius: '4px',
              color: '#f9fafb',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}; 