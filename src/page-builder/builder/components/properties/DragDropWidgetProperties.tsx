import React, { useState } from 'react';
import type { Element } from '../../../types';

interface DragDropWidgetPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const DragDropWidgetProperties: React.FC<DragDropWidgetPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  openImageChoiceModal,
}) => {
  const properties = element.properties || {};
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'advanced'>('basic');

  const handlePropertyChange = (property: string, value: any) => {
    onPropertyChange(property, value);
  };

  const handleImageSelect = () => {
    if (openImageChoiceModal) {
      openImageChoiceModal(element.id, 'SET_BACKGROUND');
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Propiedades de Arrastra y Suelta
      </h3>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
        {['basic', 'styling', 'advanced'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            {tab === 'basic' ? 'Básico' : tab === 'styling' ? 'Estilo' : 'Avanzado'}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          {/* Drop Zone Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Texto del área de soltar
            </label>
            <input
              type="text"
              value={properties.dropZoneText || 'Arrastra elementos aquí'}
              onChange={(e) => handlePropertyChange('dropZoneText', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Arrastra elementos aquí"
            />
          </div>

          {/* Max Items */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Máximo de elementos (0 = ilimitado)
            </label>
            <input
              type="number"
              value={properties.maxItems || 0}
              onChange={(e) => handlePropertyChange('maxItems', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="0"
              max="20"
            />
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Orientación del layout
            </label>
            <select
              value={properties.orientation || 'vertical'}
              onChange={(e) => handlePropertyChange('orientation', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="grid">Grilla</option>
            </select>
          </div>

          {/* Grid Columns (only for grid orientation) */}
          {properties.orientation === 'grid' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Columnas de la grilla
              </label>
              <input
                type="number"
                value={properties.dragDropGridColumns || 2}
                onChange={(e) => handlePropertyChange('dragDropGridColumns', parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                min="1"
                max="6"
              />
            </div>
          )}

          {/* Item Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Espaciado entre elementos (px)
            </label>
            <input
              type="number"
              value={properties.itemSpacing || 8}
              onChange={(e) => handlePropertyChange('itemSpacing', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="0"
              max="50"
            />
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Background Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Fondo</h4>
            
            {/* Background Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Color de fondo</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.backgroundColor || '#f8fafc'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 border border-gray-600 rounded bg-gray-700"
                />
                <input
                  type="text"
                  value={properties.backgroundColor || '#f8fafc'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="#f8fafc"
                />
              </div>
            </div>

            {/* Transparency Toggle */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-300">Fondo transparente</span>
                <button
                  type="button"
                  onClick={() => handlePropertyChange('isTransparent', !properties.isTransparent)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.isTransparent ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={properties.isTransparent || false}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      properties.isTransparent ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Imagen de fondo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={properties.backgroundImage || ''}
                  onChange={(e) => handlePropertyChange('backgroundImage', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="URL de la imagen"
                />
                <button
                  onClick={handleImageSelect}
                  className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Elegir
                </button>
              </div>
            </div>

            {/* Background Size, Position, Repeat */}
            {properties.backgroundImage && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tamaño</label>
                  <select
                    value={properties.backgroundSize || 'cover'}
                    onChange={(e) => handlePropertyChange('backgroundSize', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="cover">Cubrir</option>
                    <option value="contain">Contener</option>
                    <option value="auto">Auto</option>
                    <option value="100% 100%">Estirar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Posición</label>
                  <select
                    value={properties.backgroundPosition || 'center'}
                    onChange={(e) => handlePropertyChange('backgroundPosition', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Repetir</label>
                  <select
                    value={properties.backgroundRepeat || 'no-repeat'}
                    onChange={(e) => handlePropertyChange('backgroundRepeat', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="no-repeat">No repetir</option>
                    <option value="repeat">Repetir</option>
                    <option value="repeat-x">Horizontal</option>
                    <option value="repeat-y">Vertical</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Border Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Bordes</h4>
            
            {/* Border Width */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400 mb-2">Ancho de bordes</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Superior</label>
                  <input
                    type="text"
                    value={properties.borderTopWidth || '2px'}
                    onChange={(e) => handlePropertyChange('borderTopWidth', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="2px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Derecho</label>
                  <input
                    type="text"
                    value={properties.borderRightWidth || '2px'}
                    onChange={(e) => handlePropertyChange('borderRightWidth', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="2px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Inferior</label>
                  <input
                    type="text"
                    value={properties.borderBottomWidth || '2px'}
                    onChange={(e) => handlePropertyChange('borderBottomWidth', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="2px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Izquierdo</label>
                  <input
                    type="text"
                    value={properties.borderLeftWidth || '2px'}
                    onChange={(e) => handlePropertyChange('borderLeftWidth', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="2px"
                  />
                </div>
              </div>
            </div>

            {/* Border Style */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400 mb-2">Estilo de bordes</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Superior</label>
                  <select
                    value={properties.borderTopStyle || 'dashed'}
                    onChange={(e) => handlePropertyChange('borderTopStyle', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">Ninguno</option>
                    <option value="solid">Sólido</option>
                    <option value="dashed">Discontinuo</option>
                    <option value="dotted">Punteado</option>
                    <option value="double">Doble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Derecho</label>
                  <select
                    value={properties.borderRightStyle || 'dashed'}
                    onChange={(e) => handlePropertyChange('borderRightStyle', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">Ninguno</option>
                    <option value="solid">Sólido</option>
                    <option value="dashed">Discontinuo</option>
                    <option value="dotted">Punteado</option>
                    <option value="double">Doble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Inferior</label>
                  <select
                    value={properties.borderBottomStyle || 'dashed'}
                    onChange={(e) => handlePropertyChange('borderBottomStyle', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">Ninguno</option>
                    <option value="solid">Sólido</option>
                    <option value="dashed">Discontinuo</option>
                    <option value="dotted">Punteado</option>
                    <option value="double">Doble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Izquierdo</label>
                  <select
                    value={properties.borderLeftStyle || 'dashed'}
                    onChange={(e) => handlePropertyChange('borderLeftStyle', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">Ninguno</option>
                    <option value="solid">Sólido</option>
                    <option value="dashed">Discontinuo</option>
                    <option value="dotted">Punteado</option>
                    <option value="double">Doble</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400 mb-2">Color de bordes</label>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Superior</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={properties.borderTopColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderTopColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded bg-gray-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={properties.borderTopColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderTopColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="#cbd5e1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Derecho</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={properties.borderRightColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderRightColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded bg-gray-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={properties.borderRightColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderRightColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="#cbd5e1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Inferior</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={properties.borderBottomColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderBottomColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded bg-gray-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={properties.borderBottomColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderBottomColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="#cbd5e1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Izquierdo</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={properties.borderLeftColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderLeftColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded bg-gray-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={properties.borderLeftColor || '#cbd5e1'}
                      onChange={(e) => handlePropertyChange('borderLeftColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="#cbd5e1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Border Radius Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Esquinas redondeadas</h4>
            
            {/* Fully Rounded Toggle */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-sm text-gray-300 block">Elemento completamente redondo</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Cuando está activado, anula las configuraciones individuales de esquina
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePropertyChange('isFullyRounded', !properties.isFullyRounded)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    properties.isFullyRounded ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={properties.isFullyRounded || false}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      properties.isFullyRounded ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Individual Corner Radius (only when not fully rounded) */}
            {!properties.isFullyRounded && (
              <div className="space-y-2">
                <label className="block text-sm text-gray-400 mb-2">Radio de esquinas</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Superior Izq.</label>
                    <input
                      type="text"
                      value={properties.borderTopLeftRadius || '8px'}
                      onChange={(e) => handlePropertyChange('borderTopLeftRadius', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Superior Der.</label>
                    <input
                      type="text"
                      value={properties.borderTopRightRadius || '8px'}
                      onChange={(e) => handlePropertyChange('borderTopRightRadius', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Inferior Izq.</label>
                    <input
                      type="text"
                      value={properties.borderBottomLeftRadius || '8px'}
                      onChange={(e) => handlePropertyChange('borderBottomLeftRadius', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Inferior Der.</label>
                    <input
                      type="text"
                      value={properties.borderBottomRightRadius || '8px'}
                      onChange={(e) => handlePropertyChange('borderBottomRightRadius', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="8px"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Button Transparency */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Botón Agregar</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Transparencia del botón</label>
              <select
                value={properties.buttonTransparency || 'opaque'}
                onChange={(e) => handlePropertyChange('buttonTransparency', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="opaque">Opaco</option>
                <option value="semi-transparent">Semi-transparente</option>
                <option value="transparent">Transparente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          {/* Visual Feedback Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Colores de retroalimentación</h4>
            
            {/* Drag Over Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Color al arrastrar encima
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.dragOverColor || '#e0f2fe'}
                  onChange={(e) => handlePropertyChange('dragOverColor', e.target.value)}
                  className="w-10 h-10 border border-gray-600 rounded bg-gray-700"
                />
                <input
                  type="text"
                  value={properties.dragOverColor || '#e0f2fe'}
                  onChange={(e) => handlePropertyChange('dragOverColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="#e0f2fe"
                />
              </div>
            </div>

            {/* Drag Over Border Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Color de borde al arrastrar encima
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.dragOverBorderColor || '#0284c7'}
                  onChange={(e) => handlePropertyChange('dragOverBorderColor', e.target.value)}
                  className="w-10 h-10 border border-gray-600 rounded bg-gray-700"
                />
                <input
                  type="text"
                  value={properties.dragOverBorderColor || '#0284c7'}
                  onChange={(e) => handlePropertyChange('dragOverBorderColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="#0284c7"
                />
              </div>
            </div>

            {/* Success Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Color de éxito
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.successColor || '#dcfce7'}
                  onChange={(e) => handlePropertyChange('successColor', e.target.value)}
                  className="w-10 h-10 border border-gray-600 rounded bg-gray-700"
                />
                <input
                  type="text"
                  value={properties.successColor || '#dcfce7'}
                  onChange={(e) => handlePropertyChange('successColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="#dcfce7"
                />
              </div>
            </div>

            {/* Success Border Color */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Color de borde de éxito
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.successBorderColor || '#16a34a'}
                  onChange={(e) => handlePropertyChange('successBorderColor', e.target.value)}
                  className="w-10 h-10 border border-gray-600 rounded bg-gray-700"
                />
                <input
                  type="text"
                  value={properties.successBorderColor || '#16a34a'}
                  onChange={(e) => handlePropertyChange('successBorderColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="#16a34a"
                />
              </div>
            </div>
          </div>

          {/* Enable Animations */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-300">Habilitar animaciones</span>
              <button
                type="button"
                onClick={() => handlePropertyChange('enableAnimations', !(properties.enableAnimations !== false))}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  properties.enableAnimations !== false ? 'bg-blue-600' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={properties.enableAnimations !== false}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    properties.enableAnimations !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Allowed Types */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipos de elementos permitidos
            </label>
            <input
              type="text"
              value={(properties.allowedTypes || []).join(', ')}
              onChange={(e) => {
                const types = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                handlePropertyChange('allowedTypes', types);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="button, text, image (vacío = todos)"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separar con comas. Vacío permite todos los tipos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
