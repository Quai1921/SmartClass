import React from 'react';
import type { Element } from '../../../types';

interface DropAreaContentPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const DropAreaContentProperties: React.FC<DropAreaContentPropertiesProps> = ({
  element,
  onPropertyChange,
  openImageChoiceModal,
}) => {
  const properties = element.properties as any;
  const [activeTab, setActiveTab] = React.useState<'basic' | 'styling' | 'layout' | 'effects'>('basic');

  const handleImageSelect = (src: string, alt?: string) => {
    
    const updatedProperties = {
      ...properties,
      backgroundImage: src,
      backgroundImageAlt: alt || 'Background image',
      backgroundImageFit: properties.backgroundImageFit || 'cover',
      backgroundImagePosition: properties.backgroundImagePosition || 'center',
      backgroundImageOpacity: properties.backgroundImageOpacity ?? 1,
    };
    
    Object.keys(updatedProperties).forEach(key => {
      onPropertyChange(key, updatedProperties[key]);
    });
  };

  const handleOpenImageModal = () => {
    
    // Use the same callback naming convention as ConnectionImageNode
    (window as any).connectionImageCallback = handleImageSelect;
    (window as any).connectionImageElementId = element.id;
    
    if (openImageChoiceModal) {
      // Use 'ADD_ELEMENT' context like ConnectionImageNode
      openImageChoiceModal(element.id, 'ADD_ELEMENT');
    }
  };

  const handleRemoveImage = () => {
    onPropertyChange('backgroundImage', '');
    onPropertyChange('backgroundImageAlt', '');
  };

  return (
    <div className="space-y-4">
      {/* Header - more compact and professional */}
      <div className="border-b border-gray-600 pb-3">
        <h3 className="text-base font-medium text-white">Drop Area Content</h3>
        {properties.belongsToSpecificArea && (
          <p className="text-sm text-blue-400 mt-1">
            Bound to specific area
          </p>
        )}
      </div>

      {/* Tab Navigation - improved styling to match image node */}
      <div className="border-b border-gray-600">
        <nav className="-mb-px flex space-x-0">
          {[
            { key: 'basic', label: 'Básico' },
            { key: 'styling', label: 'Estilo' },
            { key: 'layout', label: 'Diseño' },
            { key: 'effects', label: 'Efectos' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Properties Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Content Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Texto del Contenido
            </label>
            <input
              type="text"
              value={properties.text || ''}
              onChange={(e) => onPropertyChange('text', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el texto del contenido..."
            />
          </div>

          {/* Icon Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Icono
            </label>
            <select
              value={properties.iconType || 'target'}
              onChange={(e) => onPropertyChange('iconType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="target">Objetivo</option>
              <option value="file">Archivo</option>
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="text">Texto</option>
              <option value="quiz">Quiz</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {properties.iconType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL del Icono Personalizado
              </label>
              <input
                type="url"
                value={properties.customIcon || ''}
                onChange={(e) => onPropertyChange('customIcon', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://ejemplo.com/icono.svg"
              />
            </div>
          )}

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen de Fondo
            </label>
            <div className="space-y-3">
              {properties.backgroundImage ? (
                <div className="p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <img 
                    src={properties.backgroundImage} 
                    alt="Background" 
                    className="w-full h-32 object-cover rounded border border-gray-500 mb-3"
                  />
                  <button
                    onClick={handleOpenImageModal}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cambiar Imagen
                  </button>
                  <input
                    type="text"
                    value={properties.backgroundImage}
                    readOnly
                    className="w-full mt-2 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-gray-300 text-sm"
                  />
                  <input
                    type="text"
                    value={properties.backgroundImageAlt || 'Imagen de fondo'}
                    onChange={(e) => onPropertyChange('backgroundImageAlt', e.target.value)}
                    placeholder="Texto alternativo"
                    className="w-full mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <button
                  onClick={handleOpenImageModal}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Elegir Imagen de Fondo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Style Variant */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Variante de Estilo
            </label>
            <select
              value={properties.dropAreaContentStyle || 'card'}
              onChange={(e) => onPropertyChange('dropAreaContentStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="minimal">Mínimo</option>
              <option value="card">Tarjeta</option>
              <option value="outlined">Contorneado</option>
              <option value="filled">Relleno</option>
              <option value="elevated">Elevado</option>
              <option value="gradient">Degradado</option>
            </select>
          </div>

          {/* Background Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Fondo</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Fondo
                </label>
                <select
                  value={properties.backgroundType || 'solid'}
                  onChange={(e) => onPropertyChange('backgroundType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="solid">Color Sólido</option>
                  <option value="gradient">Degradado</option>
                  <option value="pattern">Patrón</option>
                  <option value="image">Imagen</option>
                </select>
              </div>

              {/* Background Color */}
              {(properties.backgroundType === 'solid' || !properties.backgroundType) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color de Fondo
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={properties.backgroundColor || '#f9fafb'}
                      onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                      className="w-12 h-10 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    />
                    <input
                      type="text"
                      value={properties.backgroundColor || '#f9fafb'}
                      onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#f9fafb"
                    />
                  </div>
                </div>
              )}

              {/* Gradient Settings */}
              {properties.backgroundType === 'gradient' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dirección del Degradado
                    </label>
                    <select
                      value={properties.gradientDirection || 'to-bottom-right'}
                      onChange={(e) => onPropertyChange('gradientDirection', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="to-right">Hacia la Derecha</option>
                      <option value="to-left">Hacia la Izquierda</option>
                      <option value="to-bottom">Hacia Abajo</option>
                      <option value="to-top">Hacia Arriba</option>
                      <option value="to-bottom-right">Hacia Abajo-Derecha</option>
                      <option value="to-bottom-left">Hacia Abajo-Izquierda</option>
                      <option value="to-top-right">Hacia Arriba-Derecha</option>
                      <option value="to-top-left">Hacia Arriba-Izquierda</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Inicial
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={properties.gradientStartColor || '#f9fafb'}
                          onChange={(e) => onPropertyChange('gradientStartColor', e.target.value)}
                          className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                        />
                        <input
                          type="text"
                          value={properties.gradientStartColor || '#f9fafb'}
                          onChange={(e) => onPropertyChange('gradientStartColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color Final
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={properties.gradientEndColor || '#f3f4f6'}
                          onChange={(e) => onPropertyChange('gradientEndColor', e.target.value)}
                          className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                        />
                        <input
                          type="text"
                          value={properties.gradientEndColor || '#f3f4f6'}
                          onChange={(e) => onPropertyChange('gradientEndColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Border & Outline Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Bordes</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ancho
                  </label>
                  <input
                    type="number"
                    value={properties.borderWidth || 2}
                    onChange={(e) => onPropertyChange('borderWidth', parseInt(e.target.value))}
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estilo
                  </label>
                  <select
                    value={properties.borderStyle || 'solid'}
                    onChange={(e) => onPropertyChange('borderStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="solid">Sólido</option>
                    <option value="dashed">Discontinuo</option>
                    <option value="dotted">Punteado</option>
                    <option value="double">Doble</option>
                    <option value="none">Ninguno</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color del Borde
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={properties.borderColor || '#e5e7eb'}
                    onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  />
                  <input
                    type="text"
                    value={properties.borderColor || '#e5e7eb'}
                    onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Radio del Borde
                </label>
                <input
                  type="number"
                  value={properties.borderRadius || 8}
                  onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Dimensions Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Dimensiones</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ancho
                  </label>
                  <input
                    type="number"
                    value={properties.width || 120}
                    onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
                    min="50"
                    max="500"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Altura
                  </label>
                  <input
                    type="number"
                    value={properties.height || 100}
                    onChange={(e) => onPropertyChange('height', parseInt(e.target.value))}
                    min="50"
                    max="500"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ancho Mín
                  </label>
                  <input
                    type="number"
                    value={properties.minWidth || 80}
                    onChange={(e) => onPropertyChange('minWidth', parseInt(e.target.value))}
                    min="50"
                    max="300"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Altura Mín
                  </label>
                  <input
                    type="number"
                    value={properties.minHeight || 60}
                    onChange={(e) => onPropertyChange('minHeight', parseInt(e.target.value))}
                    min="50"
                    max="300"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Alignment Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Alineación</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horizontal
                </label>
                <select
                  value={properties.contentAlignment || 'center'}
                  onChange={(e) => onPropertyChange('contentAlignment', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Izquierda</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecha</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vertical
                </label>
                <select
                  value={properties.verticalAlignment || 'center'}
                  onChange={(e) => onPropertyChange('verticalAlignment', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="top">Arriba</option>
                  <option value="center">Centro</option>
                  <option value="bottom">Abajo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Espaciado</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Padding
                  </label>
                  <input
                    type="number"
                    value={properties.contentPadding || properties.padding || 16}
                    onChange={(e) => onPropertyChange('contentPadding', parseInt(e.target.value))}
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Margin
                  </label>
                  <input
                    type="number"
                    value={properties.contentMargin || properties.margin || 0}
                    onChange={(e) => onPropertyChange('contentMargin', parseInt(e.target.value))}
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Espacio Interno
                </label>
                <input
                  type="number"
                  value={properties.contentGap || 8}
                  onChange={(e) => onPropertyChange('contentGap', parseInt(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Icon Configuration */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Configuración del Icono</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Posición del Icono
                </label>
                <select
                  value={properties.iconPosition || 'top'}
                  onChange={(e) => onPropertyChange('iconPosition', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">Ninguno</option>
                  <option value="top">Arriba</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                  <option value="bottom">Abajo</option>
                  <option value="center">Centro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tamaño
                  </label>
                  <input
                    type="number"
                    value={properties.iconSize || 24}
                    onChange={(e) => onPropertyChange('iconSize', parseInt(e.target.value))}
                    min="12"
                    max="64"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={properties.iconColor || '#6b7280'}
                    onChange={(e) => onPropertyChange('iconColor', e.target.value)}
                    className="w-full h-10 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          {/* Hover Effects */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Efectos de Hover</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Efecto de Hover
                </label>
                <select
                  value={properties.hoverEffect || 'scale'}
                  onChange={(e) => onPropertyChange('hoverEffect', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">Ninguno</option>
                  <option value="scale">Escalar</option>
                  <option value="shadow">Sombra</option>
                  <option value="glow">Brillo</option>
                  <option value="rotate">Rotar</option>
                  <option value="bounce">Rebote</option>
                </select>
              </div>

              {properties.hoverEffect === 'scale' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Factor de Escala
                  </label>
                  <input
                    type="number"
                    value={properties.hoverScale || 1.02}
                    onChange={(e) => onPropertyChange('hoverScale', parseFloat(e.target.value))}
                    min="0.8"
                    max="1.5"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {properties.hoverEffect === 'shadow' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sombra al Hover
                  </label>
                  <input
                    type="text"
                    value={properties.hoverShadow || '0 4px 12px rgba(0,0,0,0.15)'}
                    onChange={(e) => onPropertyChange('hoverShadow', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 4px 12px rgba(0,0,0,0.15)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Animations */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Animaciones</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Animación
                </label>
                <select
                  value={properties.animation || 'none'}
                  onChange={(e) => onPropertyChange('animation', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">Ninguna</option>
                  <option value="pulse">Pulso</option>
                  <option value="bounce">Rebote</option>
                  <option value="spin">Girar</option>
                  <option value="fade">Desvanecer</option>
                  <option value="slide">Deslizar</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración (ms)
                  </label>
                  <input
                    type="number"
                    value={properties.animationDuration || 200}
                    onChange={(e) => onPropertyChange('animationDuration', parseInt(e.target.value))}
                    min="100"
                    max="3000"
                    step="100"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Retraso (ms)
                  </label>
                  <input
                    type="number"
                    value={properties.animationDelay || 0}
                    onChange={(e) => onPropertyChange('animationDelay', parseInt(e.target.value))}
                    min="0"
                    max="2000"
                    step="100"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shadows & Visual Effects */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Sombras y Efectos Visuales</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sombra de Caja
                </label>
                <input
                  type="text"
                  value={properties.boxShadow || ''}
                  onChange={(e) => onPropertyChange('boxShadow', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sombra de Texto
                </label>
                <input
                  type="text"
                  value={properties.textShadow || 'none'}
                  onChange={(e) => onPropertyChange('textShadow', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1px 1px 2px rgba(0,0,0,0.1)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filtro CSS
                </label>
                <input
                  type="text"
                  value={properties.filter || 'none'}
                  onChange={(e) => onPropertyChange('filter', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="blur(2px) brightness(1.1)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Opacidad: {Math.round((properties.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  value={properties.opacity || 1}
                  onChange={(e) => onPropertyChange('opacity', parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.1"
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(properties.opacity || 1) * 100}%, #4b5563 ${(properties.opacity || 1) * 100}%, #4b5563 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
