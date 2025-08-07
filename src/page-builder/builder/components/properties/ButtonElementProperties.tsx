import React, { useState } from 'react';
import { Upload, Eye, X, Palette, Type, Settings } from 'lucide-react';
import type { Element } from '../../../types';
import { ImageUploadModal } from '../../../components/ImageWidget';

export interface ButtonElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
}

// Button templates with preview styles
const BUTTON_TEMPLATES = [
  {
    id: 'modern-primary',
    name: 'Moderno Primario',
    preview: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '12px 24px',
      border: 'none',
      fontWeight: '600',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    },
    properties: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '12px 24px',
      border: 'none',
      fontWeight: '600',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'gradient-sunset',
    name: 'Gradiente Atardecer',
    preview: {
      background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
      color: '#ffffff',
      borderRadius: '25px',
      padding: '14px 28px',
      border: 'none',
      fontWeight: '700',
      boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)'
    },
    properties: {
      background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
      backgroundColor: 'transparent',
      color: '#ffffff',
      borderRadius: '25px',
      padding: '14px 28px',
      border: 'none',
      fontWeight: '700',
      boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'neon-cyber',
    name: 'Neón Cyber',
    preview: {
      backgroundColor: '#1a1a2e',
      color: '#00ffff',
      border: '2px solid #00ffff',
      borderRadius: '4px',
      padding: '12px 24px',
      fontWeight: '600',
      textShadow: '0 0 10px #00ffff',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
    },
    properties: {
      backgroundColor: '#1a1a2e',
      color: '#00ffff',
      border: '2px solid #00ffff',
      borderRadius: '4px',
      padding: '12px 24px',
      fontWeight: '600',
      textShadow: '0 0 10px #00ffff',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorfismo',
    preview: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '16px',
      padding: '16px 32px',
      color: '#333333',
      fontWeight: '500',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    },
    properties: {
      background: 'rgba(255, 255, 255, 0.25)',
      backgroundColor: 'transparent',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '16px',
      padding: '16px 32px',
      color: '#333333',
      fontWeight: '500',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'minimalist-outline',
    name: 'Minimalista Contorno',
    preview: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '2px solid #374151',
      borderRadius: '2px',
      padding: '10px 20px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    properties: {
      backgroundColor: 'transparent',
      color: '#374151',
      border: '2px solid #374151',
      borderRadius: '2px',
      padding: '10px 20px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'elegant-dark',
    name: 'Elegante Oscuro',
    preview: {
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      borderRadius: '12px',
      padding: '16px 24px',
      border: '1px solid #374151',
      fontWeight: '500',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    properties: {
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      borderRadius: '12px',
      padding: '16px 24px',
      border: '1px solid #374151',
      fontWeight: '500',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'pattern-texture',
    name: 'Textura de Patrón',
    preview: {
      backgroundColor: '#6366f1',
      background: 'repeating-linear-gradient(45deg, #4f46e5, #4f46e5 10px, #6366f1 10px, #6366f1 20px)',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '14px 28px',
      border: 'none',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
    },
    properties: {
      backgroundColor: '#6366f1',
      background: 'repeating-linear-gradient(45deg, #4f46e5, #4f46e5 10px, #6366f1 10px, #6366f1 20px)',
      color: '#ffffff',
      borderRadius: '8px',
      padding: '14px 28px',
      border: 'none',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'wood-texture',
    name: 'Textura de Madera',
    preview: {
      background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #A0522D 75%, #8B4513 100%)',
      backgroundSize: '20px 100%',
      color: '#ffffff',
      borderRadius: '6px',
      padding: '12px 24px',
      border: '2px solid #654321',
      fontWeight: '700',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)'
    },
    properties: {
      background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #A0522D 75%, #8B4513 100%)',
      backgroundColor: 'transparent',
      backgroundSize: '20px 100%',
      color: '#ffffff',
      borderRadius: '6px',
      padding: '12px 24px',
      border: '2px solid #654321',
      fontWeight: '700',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }
  },
  {
    id: 'metal-gradient',
    name: 'Metálico Gradiente',
    preview: {
      background: 'linear-gradient(145deg, #c0c0c0, #808080, #c0c0c0, #e0e0e0)',
      backgroundSize: '200% 200%',
      color: '#2d2d2d',
      borderRadius: '10px',
      padding: '14px 26px',
      border: '1px solid #999999',
      fontWeight: '600',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    properties: {
      background: 'linear-gradient(145deg, #c0c0c0, #808080, #c0c0c0, #e0e0e0)',
      backgroundColor: 'transparent',
      backgroundSize: '200% 200%',
      color: '#2d2d2d',
      borderRadius: '10px',
      padding: '14px 26px',
      border: '1px solid #999999',
      fontWeight: '600',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  }
];

/**
 * Enhanced Button element properties component
 * Handles comprehensive button customization including backgrounds, templates, and advanced styling
 */
export const ButtonElementProperties: React.FC<ButtonElementPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'templates' | 'advanced'>('basic');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);

  // Helper function to apply template
  const applyTemplate = (template: typeof BUTTON_TEMPLATES[0]) => {
    // First, clear all style-related properties to avoid conflicts
    const clearedProperties = {
      ...element.properties,
      // Clear all visual styling properties
      backgroundColor: undefined,
      background: undefined,
      backgroundImage: undefined,
      backgroundSize: undefined,
      backgroundPosition: undefined,
      backgroundRepeat: undefined,
      color: undefined,
      border: undefined,
      borderRadius: undefined,
      borderWidth: undefined,
      borderColor: undefined,
      borderStyle: undefined,
      padding: undefined,
      margin: undefined,
      fontSize: undefined,
      fontWeight: undefined,
      fontFamily: undefined,
      lineHeight: undefined,
      letterSpacing: undefined,
      textTransform: undefined,
      textShadow: undefined,
      textDecoration: undefined,
      textDecorationColor: undefined,
      boxShadow: undefined,
      cursor: undefined,
      transition: undefined,
      backdropFilter: undefined,
      customCSS: undefined,
      // Clear any webkit properties that might interfere
      WebkitBackgroundClip: undefined,
      WebkitTextFillColor: undefined,
      variant: 'custom'
    };

    // Then apply the new template properties
    const updatedProperties = {
      ...clearedProperties,
      ...template.properties
    } as any;
    
    onElementUpdate(element.id, { properties: updatedProperties });
  };

  // Helper function to handle background image
  const handleImageSelect = (src: string, alt?: string) => {
    onPropertyChange('backgroundImage', `url(${src})`);
    onPropertyChange('backgroundSize', 'cover');
    onPropertyChange('backgroundPosition', 'center');
    onPropertyChange('backgroundRepeat', 'no-repeat');
    if (alt) {
      onPropertyChange('backgroundImageAlt', alt);
    }
    setImageModalOpen(false);
  };

  // Remove background image
  const removeBackgroundImage = () => {
    onPropertyChange('backgroundImage', '');
    onPropertyChange('backgroundSize', '');
    onPropertyChange('backgroundPosition', '');
    onPropertyChange('backgroundRepeat', '');
    onPropertyChange('backgroundImageAlt', '');
  };

  const renderBasicTab = () => (
    <div className="space-y-4">
      {/* Element Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Elemento</label>
        <input
          type="text"
          value={element.name || ''}
          onChange={(e) => onElementUpdate(element.id, { name: e.target.value })}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Botón sin nombre"
        />
      </div>

      {/* Button text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Texto</label>
        <input
          type="text"
          value={element.properties.text || ''}
          onChange={(e) => onPropertyChange('text', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Texto del botón"
        />
      </div>

      {/* Button URL/Link */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Enlace (URL)</label>
        <input
          type="url"
          value={element.properties.href || ''}
          onChange={(e) => onPropertyChange('href', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="https://ejemplo.com"
        />
      </div>

      {/* Target */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Abrir en</label>
        <select
          value={element.properties.target || '_self'}
          onChange={(e) => onPropertyChange('target', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="_self">Misma ventana</option>
          <option value="_blank">Nueva ventana</option>
        </select>
      </div>

      {/* Button type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
        <select
          value={element.properties.buttonType || 'button'}
          onChange={(e) => onPropertyChange('buttonType', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="button">Botón</option>
          <option value="submit">Enviar</option>
          <option value="reset">Reiniciar</option>
        </select>
      </div>

      {/* Disabled state */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="disabled"
          checked={element.properties.disabled || false}
          onChange={(e) => onPropertyChange('disabled', e.target.checked)}
          className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="disabled" className="text-sm font-medium text-gray-300">
          Deshabilitado
        </label>
      </div>
    </div>
  );

  const renderStylingTab = () => (
    <div className="space-y-4">
      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={element.properties.backgroundColor || '#3b82f6'}
              onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
              className="w-12 h-8 rounded border border-gray-600 bg-gray-700"
            />
            <input
              type="text"
              value={element.properties.backgroundColor || ''}
              onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500"
              placeholder="#3b82f6"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Texto</label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={element.properties.color || '#ffffff'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="w-12 h-8 rounded border border-gray-600 bg-gray-700"
            />
            <input
              type="text"
              value={element.properties.color || ''}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Fondo</label>
        <div className="space-y-3">
          {element.properties.backgroundImage ? (
            <div className="flex items-center space-x-2">
              <div 
                className="w-16 h-8 rounded border border-gray-600"
                style={{ 
                  backgroundImage: element.properties.backgroundImage,
                  backgroundSize: element.properties.backgroundSize || 'cover',
                  backgroundPosition: element.properties.backgroundPosition || 'center',
                  backgroundRepeat: element.properties.backgroundRepeat || 'no-repeat'
                }}
              />
              <span className="text-sm text-gray-400 flex-1">Imagen establecida</span>
              <button
                onClick={removeBackgroundImage}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setImageModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 border border-gray-600 bg-gray-700 text-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-600 focus:border-blue-500"
            >
              <Upload size={16} />
              <span>Subir Imagen</span>
            </button>
          )}
          
          {/* Background Image Properties - Only show when image is set */}
          {element.properties.backgroundImage && (
            <div className="grid grid-cols-1 gap-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
              <div className="grid grid-cols-2 gap-3">
                {/* Background Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Tamaño</label>
                  <select
                    value={element.properties.backgroundSize || 'cover'}
                    onChange={(e) => onPropertyChange('backgroundSize', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                  >
                    <option value="cover">Cubrir</option>
                    <option value="contain">Contener</option>
                    <option value="auto">Automático</option>
                    <option value="100% 100%">Estirar</option>
                  </select>
                </div>
                
                {/* Background Position */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Posición</label>
                  <select
                    value={element.properties.backgroundPosition || 'center'}
                    onChange={(e) => onPropertyChange('backgroundPosition', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="top left">Arriba Izquierda</option>
                    <option value="top right">Arriba Derecha</option>
                    <option value="bottom left">Abajo Izquierda</option>
                    <option value="bottom right">Abajo Derecha</option>
                  </select>
                </div>
              </div>
              
              {/* Background Repeat */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Repetición</label>
                <select
                  value={element.properties.backgroundRepeat || 'no-repeat'}
                  onChange={(e) => onPropertyChange('backgroundRepeat', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                >
                  <option value="no-repeat">Sin repetir</option>
                  <option value="repeat">Repetir</option>
                  <option value="repeat-x">Repetir X</option>
                  <option value="repeat-y">Repetir Y</option>
                  <option value="space">Espaciado</option>
                  <option value="round">Redondear</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Border */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Borde</label>
          <input
            type="text"
            value={element.properties.border || ''}
            onChange={(e) => onPropertyChange('border', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="1px solid #ccc"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Radio del Borde</label>
          <input
            type="text"
            value={element.properties.borderRadius || ''}
            onChange={(e) => onPropertyChange('borderRadius', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="8px"
          />
        </div>
      </div>

      {/* Box Shadow - button-specific styling */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Sombra</label>
        <input
          type="text"
          value={element.properties.boxShadow || ''}
          onChange={(e) => onPropertyChange('boxShadow', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        />
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-300">Plantillas Prediseñadas</h5>
        <button
          onClick={() => setTemplatePreviewOpen(!templatePreviewOpen)}
          className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <Eye size={14} />
          <span>Vista previa</span>
        </button>
      </div>
      
      {/* Warning about style clearing */}
      <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5">
            ⚠️
          </div>
          <div className="text-xs text-amber-200">
            <strong>Nota:</strong> Al aplicar una plantilla se limpiarán todos los estilos existentes y se aplicarán únicamente los estilos de la plantilla seleccionada.
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {BUTTON_TEMPLATES.map((template) => (
          <div key={template.id} className="border border-gray-600 rounded-lg p-3 bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-200">{template.name}</span>
              <button
                onClick={() => applyTemplate(template)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
            {templatePreviewOpen && (
              <div className="flex justify-center p-2 bg-gray-800 rounded">
                <button
                  style={template.preview as React.CSSProperties}
                  className="pointer-events-none"
                >
                  {element.properties.text || 'Botón'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      {/* Typography */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Peso de Fuente</label>
          <select
            value={element.properties.fontWeight || '500'}
            onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
          >
            <option value="100">100 - Thin</option>
            <option value="200">200 - Extra Light</option>
            <option value="300">300 - Light</option>
            <option value="400">400 - Normal</option>
            <option value="500">500 - Medium</option>
            <option value="600">600 - Semi Bold</option>
            <option value="700">700 - Bold</option>
            <option value="800">800 - Extra Bold</option>
            <option value="900">900 - Black</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño de Fuente</label>
          <input
            type="text"
            value={element.properties.fontSize || ''}
            onChange={(e) => onPropertyChange('fontSize', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
            placeholder="16px"
          />
        </div>
      </div>

      {/* Text Effects */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Transformación de Texto</label>
          <select
            value={element.properties.textTransform || 'none'}
            onChange={(e) => onPropertyChange('textTransform', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
          >
            <option value="none">Ninguna</option>
            <option value="uppercase">MAYÚSCULAS</option>
            <option value="lowercase">minúsculas</option>
            <option value="capitalize">Capitalizar</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Espaciado de Letras</label>
          <input
            type="text"
            value={element.properties.letterSpacing || ''}
            onChange={(e) => onPropertyChange('letterSpacing', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
            placeholder="0.5px"
          />
        </div>
      </div>

      {/* Text Shadow */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Sombra de Texto</label>
        <input
          type="text"
          value={element.properties.textShadow || ''}
          onChange={(e) => onPropertyChange('textShadow', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
          placeholder="0 1px 2px rgba(0, 0, 0, 0.1)"
        />
      </div>

      {/* Transitions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Transición</label>
        <input
          type="text"
          value={element.properties.transition || ''}
          onChange={(e) => onPropertyChange('transition', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
          placeholder="all 0.2s ease"
        />
      </div>

      {/* Cursor */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Cursor</label>
        <select
          value={element.properties.cursor || 'pointer'}
          onChange={(e) => onPropertyChange('cursor', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500"
        >
          <option value="pointer">Puntero</option>
          <option value="default">Por defecto</option>
          <option value="not-allowed">No permitido</option>
          <option value="wait">Esperar</option>
          <option value="help">Ayuda</option>
        </select>
      </div>

      {/* Custom CSS */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">CSS Personalizado</label>
        <textarea
          value={element.properties.customCSS || ''}
          onChange={(e) => onPropertyChange('customCSS', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 h-20 resize-none"
          placeholder="opacity: 0.8;&#10;backdrop-filter: blur(10px);"
        />
      </div>
    </div>
  );

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Propiedades del Botón</h4>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 p-1 bg-gray-800 rounded-lg">
        {[
          { id: 'basic', label: 'Básico', icon: Settings },
          { id: 'styling', label: 'Estilo', icon: Palette },
          { id: 'templates', label: 'Plantillas', icon: Eye },
          { id: 'advanced', label: 'Avanzado', icon: Type }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'basic' && renderBasicTab()}
        {activeTab === 'styling' && renderStylingTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};
