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
  const properties = element.properties as any; // Cast to any for custom properties like AudioTrueFalse
  const { updateElement } = useBuilder();
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'basic' | 'styling' | 'connection' | 'advanced'>('basic');

  const handleImageSelect = (src: string, alt?: string) => {
    
    // Direct Zustand store update for immediate persistence
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

  // Custom handler to open image choice modal with callback
  const handleOpenImageModal = () => {
    
    // Store the callback in a global location where useImageModal can access it
    (window as any).connectionImageCallback = handleImageSelect;
    (window as any).connectionImageElementId = element.id;
    
    if (openImageChoiceModal) {
      openImageChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      // Fallback to old modal if choice modal not available
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

          {/* Text Content - Only show if content type is text */}
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
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-gray-300 text-sm">Mostrar texto</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={properties.showText !== false}
                    onChange={e => onPropertyChange('showText', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Image Content - Only show if content type is image */}
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
                <input
                  type="text"
                  value={properties.imageSrc || properties.imageUrl || ''}
                  onChange={(e) => {
                    onPropertyChange('imageSrc', e.target.value);
                    onPropertyChange('imageUrl', e.target.value); // Keep both in sync
                  }}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="URL de la imagen..."
                />
                <input
                  type="text"
                  value={properties.imageAlt || ''}
                  onChange={(e) => onPropertyChange('imageAlt', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Texto alternativo..."
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Node Dimensions */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Dimensiones</h6>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Ancho</label>
                <input
                  type="text"
                  value={properties.width || '120px'}
                  onChange={(e) => onPropertyChange('width', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="120px"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Altura</label>
                <input
                  type="text"
                  value={properties.height || '40px'}
                  onChange={(e) => onPropertyChange('height', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="40px"
                />
              </div>
            </div>
            
            {/* Min/Max Dimensions */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Ancho Mínimo</label>
                <input
                  type="text"
                  value={properties.minWidth || ''}
                  onChange={(e) => onPropertyChange('minWidth', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Altura Mínima</label>
                <input
                  type="text"
                  value={properties.minHeight || ''}
                  onChange={(e) => onPropertyChange('minHeight', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="auto"
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Colores</h6>
            
            {/* Background Color */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={properties.backgroundColor || '#3b82f6'}
                      onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={properties.backgroundColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                  />
                  <button
                    onClick={() => onPropertyChange('backgroundColor', 'transparent')}
                    className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
                    title="Hacer transparente"
                  >
                    Transparente
                  </button>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color del Texto</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={properties.textColor || '#ffffff'}
                      onChange={(e) => onPropertyChange('textColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={properties.textColor || '#ffffff'}
                    onChange={(e) => onPropertyChange('textColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Hover Colors */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo al Pasar Mouse</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={properties.hoverBackgroundColor || '#2563eb'}
                      onChange={(e) => onPropertyChange('hoverBackgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={properties.hoverBackgroundColor || '#2563eb'}
                    onChange={(e) => onPropertyChange('hoverBackgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#2563eb"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transparency Controls */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Transparencia</h6>
            
            <div className="space-y-4">
              {/* Enable Transparency Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400">Habilitar Transparencia</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={properties.enableTransparency || false}
                    onChange={(e) => onPropertyChange('enableTransparency', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Transparency Level */}
              {properties.enableTransparency && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Nivel de Transparencia: {properties.transparencyLevel || 0}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={properties.transparencyLevel || 0}
                    onChange={(e) => onPropertyChange('transparencyLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Visible</span>
                    <span>Invisible</span>
                  </div>
                </div>
              )}

              {/* Hide on Transparency */}
              {properties.enableTransparency && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-400">Ocultar Completamente</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={properties.hideOnTransparency || false}
                      onChange={(e) => onPropertyChange('hideOnTransparency', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              )}

              {/* Advanced Transparency Options */}
              {properties.enableTransparency && (
                <div className="space-y-3 border-t border-gray-600 pt-3">
                  <h6 className="text-xs font-medium text-gray-400">Opciones Avanzadas</h6>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">Mantener Fondo</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={properties.overrideTransparentBackground || false}
                        onChange={(e) => onPropertyChange('overrideTransparentBackground', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500">Mantener Sombras</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={properties.enableTransparentShadow || false}
                        onChange={(e) => onPropertyChange('enableTransparentShadow', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Typography */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Tipografía</h6>
            
            <div className="space-y-4">
              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Familia de Fuente</label>
                <select
                  value={properties.fontFamily || 'inherit'}
                  onChange={(e) => onPropertyChange('fontFamily', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="inherit">Heredar</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="GrilledCheese, sans-serif">Grilled Cheese</option>
                </select>
              </div>

              {/* Font Size and Weight */}
              <div className="grid grid-cols-2 gap-4">
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
                    <option value="800">Extra-negrita</option>
                  </select>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Alineación de Texto</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${properties.textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('textAlign', 'left')}
                  >
                    Izq
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${!properties.textAlign || properties.textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('textAlign', 'center')}
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${properties.textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('textAlign', 'right')}
                  >
                    Der
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${properties.textAlign === 'justify' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('textAlign', 'justify')}
                  >
                    Just
                  </button>
                </div>
                {/* Vertical Alignment Button Group - now grouped below horizontal */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${properties.verticalAlign === 'top' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('verticalAlign', 'top')}
                  >
                    Arriba
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${!properties.verticalAlign || properties.verticalAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('verticalAlign', 'center')}
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${properties.verticalAlign === 'bottom' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => onPropertyChange('verticalAlign', 'bottom')}
                  >
                    Abajo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Border and Radius */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Bordes</h6>
            
            <div className="space-y-4">
              {/* Border Radius */}
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
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0px</span>
                  <span>50px</span>
                </div>
              </div>

              {/* Border Width */}
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
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Border Color */}
              {((properties.borderWidth || 0) > 0) && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color del Borde</label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={properties.borderColor || '#e2e8f0'}
                        onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                        className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                        style={{ minWidth: '40px' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={properties.borderColor || '#e2e8f0'}
                      onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                      className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="#e2e8f0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connection Tab */}
      {activeTab === 'connection' && (
        <div className="space-y-6">
          {/* Line Appearance */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Apariencia de Línea</h6>
            
            <div className="space-y-4">
              {/* Line Color */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color de Línea</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={properties.lineColor || '#3b82f6'}
                      onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                      disabled={properties.randomLineColor === true}
                    />
                  </div>
                  <input
                    type="text"
                    value={properties.lineColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                    disabled={properties.randomLineColor === true}
                  />
                </div>
                
                {/* Random Color Toggle */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-300 text-xs">Colores aleatorios por par</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={properties.randomLineColor === true}
                      onChange={(e) => {
                        const useRandom = e.target.checked;
                        onPropertyChange('randomLineColor', useRandom);
                        // Don't generate color here - it will be generated when nodes connect
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {properties.randomLineColor === true && (
                  <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-300">
                    💡 Cada par de nodos conectados recibe automáticamente un color único al conectarse
                  </div>
                )}
              </div>

              {/* Line Width */}
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Grosor de Línea</span>
                  <span>{properties.lineWidth || 2}px</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={properties.lineWidth || 2}
                  onChange={(e) => onPropertyChange('lineWidth', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1px</span>
                  <span>20px</span>
                </div>
              </div>

              {/* Line Style */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Estilo de Línea</label>
                <select
                  value={properties.lineStyle || 'solid'}
                  onChange={(e) => onPropertyChange('lineStyle', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="solid">Sólida</option>
                  <option value="dashed">Discontinua</option>
                  <option value="dotted">Punteada</option>
                  <option value="double">Doble</option>
                  <option value="groove">Acanalada</option>
                  <option value="ridge">Cresta</option>
                </select>
              </div>

              {/* Line Opacity */}
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Opacidad de Línea</span>
                  <span>{Math.round((properties.lineOpacity || 1) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={properties.lineOpacity || 1}
                  onChange={(e) => onPropertyChange('lineOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Connection Points */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Puntos de Conexión</h6>
            
            <div className="space-y-4">
              {/* Connection Point Size */}
              <div>
                <label className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Tamaño del Punto</span>
                  <span>{properties.connectionPointSize || 8}px</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="2"
                  value={properties.connectionPointSize || 8}
                  onChange={(e) => onPropertyChange('connectionPointSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Connection Point Color */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color del Punto</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={properties.connectionPointColor || '#3b82f6'}
                      onChange={(e) => onPropertyChange('connectionPointColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={properties.connectionPointColor || '#3b82f6'}
                    onChange={(e) => onPropertyChange('connectionPointColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              {/* Show Connection Points */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Mostrar Puntos de Conexión
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('showConnectionPoints', !properties.showConnectionPoints)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.showConnectionPoints ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.showConnectionPoints ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Arrow Settings */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Configuración de Flecha</h6>
            
            <div className="space-y-4">
              {/* Show Arrow */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Mostrar Flecha al Final
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('showArrow', !properties.showArrow)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.showArrow ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.showArrow ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Arrow Size */}
              {properties.showArrow && (
                <div>
                  <label className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Tamaño de Flecha</span>
                    <span>{properties.arrowSize || 10}px</span>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="24"
                    step="2"
                    value={properties.arrowSize || 10}
                    onChange={(e) => onPropertyChange('arrowSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Connection State Transparency */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Transparencia por Estado</h6>
            
            <div className="space-y-6">
              {/* Connected State Transparency */}
              <div className="bg-gray-800 p-3 rounded">
                <h6 className="text-xs font-medium text-green-400 mb-3">Estado Conectado</h6>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Transparencia al Conectar: {properties.connectedTransparency || 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={properties.connectedTransparency || 100}
                      onChange={(e) => onPropertyChange('connectedTransparency', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">Ocultar al Conectar</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={properties.hideOnConnectedTransparency || false}
                        onChange={(e) => onPropertyChange('hideOnConnectedTransparency', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Selected State Transparency */}
              <div className="bg-gray-800 p-3 rounded">
                <h6 className="text-xs font-medium text-yellow-400 mb-3">Estado Seleccionado</h6>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Transparencia al Seleccionar: {properties.selectedTransparency || 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={properties.selectedTransparency || 100}
                      onChange={(e) => onPropertyChange('selectedTransparency', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">Ocultar al Seleccionar</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={properties.hideOnSelectedTransparency || false}
                        onChange={(e) => onPropertyChange('hideOnSelectedTransparency', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Connecting State Transparency */}
              <div className="bg-gray-800 p-3 rounded">
                <h6 className="text-xs font-medium text-blue-400 mb-3">Estado Conectando</h6>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Transparencia mientras Conecta: {properties.connectingTransparency || 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={properties.connectingTransparency || 100}
                      onChange={(e) => onPropertyChange('connectingTransparency', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-400">Ocultar mientras Conecta</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={properties.hideOnConnectingTransparency || false}
                        onChange={(e) => onPropertyChange('hideOnConnectingTransparency', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="showConectadoMessage"
              checked={properties.showConectadoMessage !== false}
              onChange={e => onPropertyChange('showConectadoMessage', e.target.checked)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <label htmlFor="showConectadoMessage" className="text-gray-300 text-sm">
              Mostrar mensaje "conectado"
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="pulsarAlConectar"
              checked={properties.enablePulseOnConnect === true}
              onChange={e => onPropertyChange('enablePulseOnConnect', e.target.checked)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <label htmlFor="pulsarAlConectar" className="text-gray-300 text-sm">
              Pulsar al conectar
            </label>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Spacing and Padding */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Espaciado</h6>
            
            <div className="space-y-4">
              {/* Padding */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Relleno Interno (Padding)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={properties.paddingTop || '8px'}
                    onChange={(e) => onPropertyChange('paddingTop', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Superior"
                  />
                  <input
                    type="text"
                    value={properties.paddingRight || '12px'}
                    onChange={(e) => onPropertyChange('paddingRight', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Derecho"
                  />
                  <input
                    type="text"
                    value={properties.paddingBottom || '8px'}
                    onChange={(e) => onPropertyChange('paddingBottom', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Inferior"
                  />
                  <input
                    type="text"
                    value={properties.paddingLeft || '12px'}
                    onChange={(e) => onPropertyChange('paddingLeft', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Izquierdo"
                  />
                </div>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Margen Externo (Margin)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={properties.marginTop || '0px'}
                    onChange={(e) => onPropertyChange('marginTop', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Superior"
                  />
                  <input
                    type="text"
                    value={properties.marginRight || '0px'}
                    onChange={(e) => onPropertyChange('marginRight', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Derecho"
                  />
                  <input
                    type="text"
                    value={properties.marginBottom || '0px'}
                    onChange={(e) => onPropertyChange('marginBottom', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Inferior"
                  />
                  <input
                    type="text"
                    value={properties.marginLeft || '0px'}
                    onChange={(e) => onPropertyChange('marginLeft', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                    placeholder="Izquierdo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shadow and Effects */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Sombras y Efectos</h6>
            
            <div className="space-y-4">
              {/* Box Shadow */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Sombra del Elemento
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('enableBoxShadow', !properties.enableBoxShadow)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.enableBoxShadow ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.enableBoxShadow ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {properties.enableBoxShadow && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Offset X</label>
                      <input
                        type="text"
                        value={properties.boxShadowX || '0px'}
                        onChange={(e) => onPropertyChange('boxShadowX', e.target.value)}
                        className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                        placeholder="0px"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Offset Y</label>
                      <input
                        type="text"
                        value={properties.boxShadowY || '2px'}
                        onChange={(e) => onPropertyChange('boxShadowY', e.target.value)}
                        className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                        placeholder="2px"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Desenfoque</label>
                      <input
                        type="text"
                        value={properties.boxShadowBlur || '4px'}
                        onChange={(e) => onPropertyChange('boxShadowBlur', e.target.value)}
                        className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                        placeholder="4px"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color</label>
                      <input
                        type="color"
                        value={properties.boxShadowColor || '#00000033'}
                        onChange={(e) => onPropertyChange('boxShadowColor', e.target.value)}
                        className="w-full h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Text Shadow */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Sombra del Texto
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('enableTextShadow', !properties.enableTextShadow)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.enableTextShadow ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.enableTextShadow ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {properties.enableTextShadow && (
                <div className="space-y-2 pl-4 border-l-2 border-gray-600">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={properties.textShadowX || '1px'}
                      onChange={(e) => onPropertyChange('textShadowX', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="X"
                    />
                    <input
                      type="text"
                      value={properties.textShadowY || '1px'}
                      onChange={(e) => onPropertyChange('textShadowY', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="Y"
                    />
                    <input
                      type="color"
                      value={properties.textShadowColor || '#000000'}
                      onChange={(e) => onPropertyChange('textShadowColor', e.target.value)}
                      className="w-full h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interaction States */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">Estados de Interacción</h6>
            
            <div className="space-y-4">
              {/* Hover Effects */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Efectos al Pasar Mouse
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('enableHoverEffects', !properties.enableHoverEffects)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.enableHoverEffects ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.enableHoverEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {properties.enableHoverEffects && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-600">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Escala al Hover</label>
                    <input
                      type="text"
                      value={properties.hoverScale || '1.05'}
                      onChange={(e) => onPropertyChange('hoverScale', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="1.05"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Duración de Transición</label>
                    <input
                      type="text"
                      value={properties.transitionDuration || '0.2s'}
                      onChange={(e) => onPropertyChange('transitionDuration', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="0.2s"
                    />
                  </div>
                </div>
              )}

              {/* Click Effects */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Efectos al Hacer Clic
                </label>
                <button
                  type="button"
                  onClick={() => onPropertyChange('enableClickEffects', !properties.enableClickEffects)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.enableClickEffects ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      properties.enableClickEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <div>
            <h6 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-1">CSS Personalizado</h6>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Clases CSS Adicionales</label>
                <input
                  type="text"
                  value={properties.customClasses || ''}
                  onChange={(e) => onPropertyChange('customClasses', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="clase1 clase2 clase3"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Estilos CSS Inline</label>
                <textarea
                  value={properties.customStyles || ''}
                  onChange={(e) => onPropertyChange('customStyles', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="color: red; background: blue;"
                  rows={3}
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
