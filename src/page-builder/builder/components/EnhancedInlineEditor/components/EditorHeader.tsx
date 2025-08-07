import React from 'react';

interface EditorHeaderProps {
  elementType?: string;
  onComplete: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  elementType,
  onComplete
}) => {
  const getEditorTitle = () => {
    switch (elementType) {
      case 'quote':
        return 'Editor de cita';
      case 'h1':
        return 'Título principal';
      case 'h2':
        return 'Título secundario';
      default:
        return 'Editor de texto enriquecido';
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid #374151',
      background: '#374151'
    }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
        {getEditorTitle()}
      </h3>
      <button
        onClick={onComplete}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#f9fafb',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          fontSize: '18px',
          lineHeight: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#4b5563';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        title="Cerrar editor"
      >
        ✕
      </button>
    </div>
  );
}; 