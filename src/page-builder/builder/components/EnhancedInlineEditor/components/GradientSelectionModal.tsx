import React from 'react';
import { createPortal } from 'react-dom';

interface GradientSelectionModalProps {
  isOpen: boolean;
  gradientType: 'text' | 'background';
  onClose: () => void;
  onGradientSelect: (gradient: string, type: 'text' | 'background') => void;
}

export const GradientSelectionModal: React.FC<GradientSelectionModalProps> = ({
  isOpen,
  gradientType,
  onClose,
  onGradientSelect
}) => {
  if (!isOpen) return null;

  const gradients = [
    { name: 'Sunset', gradient: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' },
    { name: 'Ocean', gradient: 'linear-gradient(45deg, #667eea, #764ba2)' },
    { name: 'Forest', gradient: 'linear-gradient(45deg, #11998e, #38ef7d)' },
    { name: 'Fire', gradient: 'linear-gradient(45deg, #ff416c, #ff4b2b)' },
    { name: 'Purple', gradient: 'linear-gradient(45deg, #a855f7, #ec4899)' },
    { name: 'Blue', gradient: 'linear-gradient(45deg, #3b82f6, #1d4ed8)' },
    { name: 'Green', gradient: 'linear-gradient(45deg, #10b981, #059669)' },
    { name: 'Orange', gradient: 'linear-gradient(45deg, #f97316, #ea580c)' },
    { name: 'Pink', gradient: 'linear-gradient(45deg, #ec4899, #be185d)' },
    { name: 'Teal', gradient: 'linear-gradient(45deg, #14b8a6, #0d9488)' },
    { name: 'Yellow', gradient: 'linear-gradient(45deg, #eab308, #ca8a04)' },
    { name: 'Red', gradient: 'linear-gradient(45deg, #ef4444, #dc2626)' },
    { name: 'Rainbow', gradient: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)' },
    { name: 'Neon', gradient: 'linear-gradient(45deg, #00ffff, #ff00ff)' },
    { name: 'Gold', gradient: 'linear-gradient(45deg, #ffd700, #ffa500)' },
    { name: 'Silver', gradient: 'linear-gradient(45deg, #c0c0c0, #808080)' }
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
          padding: '12px',
          minWidth: '320px',
          maxWidth: '380px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ 
          color: '#f9fafb', 
          margin: '0 0 8px 0', 
          fontSize: '15px',
          fontWeight: '600'
        }}>
          {gradientType === 'text' ? 'Gradiente de Texto' : 'Gradiente de Fondo'}
        </h3>
        <p style={{ 
          color: '#d1d5db', 
          margin: '0 0 10px 0', 
          fontSize: '12px'
        }}>
          Selecciona un gradiente para aplicar:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {gradients.map(({ name, gradient }) => (
            <button
              key={name}
              onClick={() => onGradientSelect(gradient, gradientType)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px',
                background: 'transparent',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                color: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                minHeight: '56px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.borderColor = '#6b7280';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#4b5563';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  background: gradient,
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              <span style={{ fontWeight: '500', fontSize: '11px' }}>{name}</span>
            </button>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '12px',
          gap: '6px'
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