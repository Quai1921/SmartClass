import React from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import { ImageUploadModal } from '../../../components/ImageWidget';
import type { Element } from '../../../types';

interface ConnectionTextNodePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ConnectionTextNodeProperties: React.FC<ConnectionTextNodePropertiesProps> = ({
  element,
  onPropertyChange,
  openImageChoiceModal,
}) => {
  const properties = element.properties as any;
  const { updateElement } = useBuilder();
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'basic' | 'styling' | 'connection' | 'advanced'>('basic');

  const handleImageSelect = (src: string, alt?: string) => {
    const updatedProperties = {
      ...properties,
      imageSrc: src,
      imageUrl: src,
      ...(alt && { imageAlt: alt })
    };
    
    updateElement(element.id, {
      properties: updatedProperties
    });
    
    setImageModalOpen(false);
  };

  const handleOpenImageModal = () => {
    (window as any).connectionImageCallback = handleImageSelect;
    (window as any).connectionImageElementId = element.id;
    
    if (openImageChoiceModal) {
      openImageChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      setImageModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Nodo de Texto/Imagen</h4>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'styling'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Estilo
          </button>
          <button
            onClick={() => setActiveTab('connection')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'connection'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Conexión
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'advanced'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Text Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modo de Texto</label>
            <select
              value={properties.textMode || 'normal'}
              onChange={(e) => onPropertyChange('textMode', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="normal">Texto con Fondo</option>
              <option value="plain">Solo Texto</option>
              <option value="minimal">Texto Minimalista</option>
            </select>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Contenido</label>
            <select
              value={properties.contentType || 'text'}
              onChange={(e) => onPropertyChange('contentType', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="text">Texto</option>
              <option value="image">Imagen</option>
            </select>
          </div>

          {/* Text Content */}
          {(properties.contentType !== 'image') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Texto del Nodo</label>
              <input
                type="text"
                value={properties.text || ''}
                onChange={(e) => onPropertyChange('text', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Texto a conectar..."
              />
            </div>
          )}

          {/* Image Content */}
          {(properties.contentType === 'image') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del Nodo</label>
              <div className="space-y-3">
                {(properties.imageUrl || properties.imageSrc) && (
                  <div className="relative">
                    <img
                      src={properties.imageUrl || properties.imageSrc}
                      alt={properties.imageAlt || 'Preview'}
                      className="w-full h-32 object-cover rounded border border-gray-600"
                    />
                  </div>
                )}
                <button
                  onClick={handleOpenImageModal}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  {(properties.imageUrl || properties.imageSrc) ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Text Color (Always Visible) */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Color del Texto</h6>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.textColor || '#ffffff'}
                onChange={(e) => onPropertyChange('textColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={properties.textColor || '#ffffff'}
                onChange={(e) => onPropertyChange('textColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Background and Border (Only for Normal Mode) */}
          {(properties.textMode === 'normal' || !properties.textMode) && (
            <>
              {/* Background Color */}
              <div>
                <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Fondo</h6>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={properties.backgroundColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  />
                  <input
                    type="text"
                    value={properties.backgroundColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                    className="flex-1 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                  />
                  <button
                    onClick={() => onPropertyChange('backgroundColor', 'transparent')}
                    className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded"
                  >
                    Transparente
                  </button>
                </div>
              </div>

              {/* Border Settings */}
              <div>
                <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Bordes</h6>
                <div className="space-y-3">
                  <div>
                    <label className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Grosor del Borde</span>
                      <span>{properties.borderWidth || 0}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={properties.borderWidth || 0}
                      onChange={(e) => onPropertyChange('borderWidth', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Radio del Borde</span>
                      <span>{parseInt(String(properties.borderRadius || '8')) || 8}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={parseInt(String(properties.borderRadius || '8')) || 8}
                      onChange={(e) => onPropertyChange('borderRadius', `${e.target.value}px`)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Typography */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Tipografía</h6>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de Fuente</label>
                <input
                  type="text"
                  value={properties.fontSize || '14px'}
                  onChange={(e) => onPropertyChange('fontSize', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="14px"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Peso de Fuente</label>
                <select
                  value={properties.fontWeight || '500'}
                  onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="300">Ligera</option>
                  <option value="400">Normal</option>
                  <option value="500">Media</option>
                  <option value="600">Semi-negrita</option>
                  <option value="700">Negrita</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Tab */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Línea de Conexión</h6>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color de Línea</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={properties.lineColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  />
                  <input
                    type="text"
                    value={properties.lineColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                    className="flex-1 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Grosor de Línea</span>
                  <span>{properties.lineWidth || 2}px</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={properties.lineWidth || 2}
                  onChange={(e) => onPropertyChange('lineWidth', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Configuración Avanzada</h6>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Clases CSS Personalizadas</label>
                <input
                  type="text"
                  value={properties.customClasses || ''}
                  onChange={(e) => onPropertyChange('customClasses', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="clase1 clase2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};
