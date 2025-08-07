// Example configurations for the Enhanced DragDropWidget

export const dragDropWidgetExamples = {
  // Example 1: Fully rounded with gradient background
  roundedGradient: {
    isFullyRounded: true,
    backgroundColor: '#4f46e5',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonTransparency: 'semi-transparent',
    dropZoneText: 'Suelta aquí - Estilo Redondeado',
    dragOverColor: '#e0e7ff',
    successColor: '#dcfce7'
  },

  // Example 2: Custom borders with different styles per side
  customBorders: {
    borderTopWidth: '4px',
    borderTopStyle: 'solid',
    borderTopColor: '#ef4444',
    borderRightWidth: '2px',
    borderRightStyle: 'dashed',
    borderRightColor: '#3b82f6',
    borderBottomWidth: '3px',
    borderBottomStyle: 'dotted',
    borderBottomColor: '#10b981',
    borderLeftWidth: '1px',
    borderLeftStyle: 'double',
    borderLeftColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    buttonTransparency: 'opaque',
    dropZoneText: 'Bordes personalizados'
  },

  // Example 3: Individual corner radius with image background
  customCorners: {
    borderTopLeftRadius: '25px',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '25px',
    borderBottomLeftRadius: '5px',
    backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    isTransparent: false,
    buttonTransparency: 'transparent',
    borderTopWidth: '3px',
    borderTopStyle: 'solid',
    borderTopColor: '#ffffff',
    borderRightWidth: '3px',
    borderRightStyle: 'solid',
    borderRightColor: '#ffffff',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#ffffff',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: '#ffffff',
    dropZoneText: 'Esquinas asimétricas'
  },

  // Example 4: Transparent widget with subtle styling
  transparentSubtle: {
    isTransparent: true,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    borderBottomLeftRadius: '12px',
    buttonTransparency: 'semi-transparent',
    dropZoneText: 'Área transparente'
  },

  // Example 5: Professional card style
  professionalCard: {
    backgroundColor: '#ffffff',
    borderTopWidth: '2px',
    borderRightWidth: '2px',
    borderBottomWidth: '2px',
    borderLeftWidth: '2px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: '#e5e7eb',
    borderRightColor: '#e5e7eb',
    borderBottomColor: '#e5e7eb',
    borderLeftColor: '#e5e7eb',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    borderBottomLeftRadius: '8px',
    buttonTransparency: 'opaque',
    dropZoneText: 'Estilo profesional',
    dragOverColor: '#f3f4f6',
    dragOverBorderColor: '#6b7280',
    successColor: '#f0fdf4',
    successBorderColor: '#22c55e'
  }
};

// Helper function to apply example styles to a DragDropWidget
export const applyDragDropWidgetStyle = (element: any, styleName: keyof typeof dragDropWidgetExamples) => {
  const style = dragDropWidgetExamples[styleName];
  return {
    ...element,
    properties: {
      ...element.properties,
      ...style
    }
  };
};
