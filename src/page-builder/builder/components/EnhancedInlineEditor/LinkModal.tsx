import React, { useState, useEffect } from 'react';

interface LinkData {
  url: string;
  text: string;
}

interface LinkModalProps {
  isOpen: boolean;
  linkData: LinkData;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: LinkData) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  linkData,
  onClose,
  onSubmit,
  onChange
}) => {
  const [localData, setLocalData] = useState<LinkData>({ url: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      setLocalData(linkData);
    }
  }, [isOpen, linkData]);

  const handleSubmit = () => {
    if (localData.url.trim()) {
      onChange(localData);
      onSubmit();
      onClose();
    }
  };

  const handleCancel = () => {
    setLocalData(linkData);
    onClose();
  };

  const handleInputChange = (field: keyof LinkData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
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
          minWidth: '320px',
          maxWidth: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ 
            color: '#f9fafb', 
            fontSize: '16px',
            fontWeight: '600',
            margin: 0
          }}>
            Insertar enlace
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* URL Input */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#d1d5db', 
              marginBottom: '8px' 
            }}>
              URL *
            </label>
            <input
              type="url"
              value={localData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#374151',
                color: '#f9fafb',
                outline: 'none'
              }}
              placeholder="https://ejemplo.com"
              autoFocus
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#4b5563'}
            />
          </div>

          {/* Link Text Input */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#d1d5db', 
              marginBottom: '8px' 
            }}>
              Texto del enlace
            </label>
            <input
              type="text"
              value={localData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#374151',
                color: '#f9fafb',
                outline: 'none'
              }}
              placeholder="Texto que se mostrará"
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#4b5563'}
            />
            <p style={{ 
              fontSize: '12px', 
              color: '#9ca3af', 
              marginTop: '4px' 
            }}>
              Si se deja vacío, se usará la URL como texto
            </p>
          </div>

          {/* Preview */}
          {localData.url && (
            <div style={{
              padding: '12px',
              background: '#374151',
              borderRadius: '6px',
              border: '1px solid #4b5563'
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#9ca3af', 
                marginBottom: '4px' 
              }}>
                Vista previa:
              </p>
              <a
                href={localData.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
              >
                {localData.text || localData.url}
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '8px', 
            paddingTop: '16px',
            borderTop: '1px solid #374151'
          }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#9ca3af',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4b5563';
                e.currentTarget.style.color = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!localData.url.trim()}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                background: localData.url.trim() ? '#3b82f6' : '#6b7280',
                border: '1px solid',
                borderColor: localData.url.trim() ? '#3b82f6' : '#6b7280',
                borderRadius: '6px',
                cursor: localData.url.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: localData.url.trim() ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (localData.url.trim()) {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.borderColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (localData.url.trim()) {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
            >
              Insertar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 