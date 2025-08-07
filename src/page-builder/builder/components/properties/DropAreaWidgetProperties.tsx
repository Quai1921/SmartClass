import React from 'react';
import type { Element } from '../../../types';

interface DropAreaWidgetPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const DropAreaWidgetProperties: React.FC<DropAreaWidgetPropertiesProps> = ({
  element,
  onPropertyChange,
  openImageChoiceModal,
}) => {
  
  const properties = element.properties as any;
  const [activeTab, setActiveTab] = React.useState<'basic' | 'styling' | 'advanced'>('basic');
  const [imageModalOpen, setImageModalOpen] = React.useState(false);

  const handleImageSelect = (src: string, alt?: string) => {
    
    // Update using both new and old property names for compatibility
    onPropertyChange('imageSrc', src);
    onPropertyChange('imageUrl', src);
    onPropertyChange('imageAlt', alt || 'Widget image');
    // Backward compatibility
    onPropertyChange('backgroundImage', src);
    onPropertyChange('backgroundImageAlt', alt || 'Widget image');
    
    
    // Force a small delay to check if properties were updated
    setTimeout(() => {
    }, 100);
    
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
      {/* Header and Tab Navigation */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Drop Area Widget</h4>
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
          {/* Widget Information */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-300 mb-3">Información del Widget</h5>
            <div className="space-y-2 text-sm text-gray-400">
              <div>ID: {element.id}</div>
              <div>Tipo: Drop Area Widget</div>
              <div>Estado: Activo</div>
            </div>
          </div>

          {/* Image Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del Nodo</label>
            <div className="space-y-3">
              {(properties.imageUrl || properties.imageSrc || properties.backgroundImage) && (
                <div className="relative">
                  <img
                    src={properties.imageUrl || properties.imageSrc || properties.backgroundImage}
                    alt={properties.imageAlt || properties.backgroundImageAlt || 'Preview'}
                    className="w-full h-32 object-cover rounded border border-gray-600"
                  />
                </div>
              )}
              <button
                onClick={handleOpenImageModal}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                {(properties.imageUrl || properties.imageSrc || properties.backgroundImage) ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </button>
              
              <input
                type="text"
                value={properties.imageSrc || properties.imageUrl || properties.backgroundImage || ''}
                onChange={(e) => {
                  onPropertyChange('imageSrc', e.target.value);
                  onPropertyChange('imageUrl', e.target.value);
                  onPropertyChange('backgroundImage', e.target.value); // backward compatibility
                }}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="O ingresa URL manualmente..."
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">Texto Alternativo</label>
              <input
                type="text"
                value={properties.imageAlt || properties.backgroundImageAlt || ''}
                onChange={(e) => {
                  onPropertyChange('imageAlt', e.target.value);
                  onPropertyChange('backgroundImageAlt', e.target.value); // backward compatibility
                }}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Descripción de la imagen..."
              />
            </div>
          </div>

          {/* Widget Behavior */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">Comportamiento</h5>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Permitir arrastrar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={properties.draggable !== false}
                  onChange={e => onPropertyChange('draggable', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Visible</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={properties.visible !== false}
                  onChange={e => onPropertyChange('visible', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Dimensions */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">Dimensiones</h5>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ancho</label>
                <input
                  type="number"
                  value={properties.width || ''}
                  onChange={(e) => onPropertyChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Auto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Altura</label>
                <input
                  type="number"
                  value={properties.height || ''}
                  onChange={(e) => onPropertyChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ancho Mín</label>
                <input
                  type="number"
                  value={properties.minWidth || ''}
                  onChange={(e) => onPropertyChange('minWidth', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Altura Mín</label>
                <input
                  type="number"
                  value={properties.minHeight || ''}
                  onChange={(e) => onPropertyChange('minHeight', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">Espaciado</h5>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Padding</label>
                <input
                  type="number"
                  value={properties.padding || 16}
                  onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Margin</label>
                <input
                  type="number"
                  value={properties.margin || 0}
                  onChange={(e) => onPropertyChange('margin', parseInt(e.target.value))}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Border */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">Bordes</h5>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ancho</label>
                <input
                  type="number"
                  value={properties.borderWidth || 2}
                  onChange={(e) => onPropertyChange('borderWidth', parseInt(e.target.value))}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estilo</label>
                <select
                  value={properties.borderStyle || 'dashed'}
                  onChange={(e) => onPropertyChange('borderStyle', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
              <input
                type="color"
                value={properties.borderColor || '#d1d5db'}
                onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                className="w-full h-10 border border-gray-600 bg-gray-700 rounded px-1 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Radio</label>
              <input
                type="number"
                value={properties.borderRadius || 8}
                onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                min="0"
              />
            </div>
          </div>

          {/* Background */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">Fondo</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
              <input
                type="color"
                value={properties.backgroundColor || '#f9fafb'}
                onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                className="w-full h-10 border border-gray-600 bg-gray-700 rounded px-1 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Opacidad: {Math.round((properties.opacity ?? 1) * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={properties.opacity ?? 1}
                onChange={(e) => onPropertyChange('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Debug Information */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-300 mb-3">Información de Debug</h5>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Elemento ID: {element.id}</div>
              <div>Posición: ({properties.left || 0}, {properties.top || 0})</div>
              <div>Tamaño: {properties.width || 'auto'} x {properties.height || 'auto'}</div>
              <div>Z-Index: {properties.zIndex || 'auto'}</div>
            </div>
          </div>

          {/* Custom CSS */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-300">CSS Personalizado</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Clases CSS</label>
              <input
                type="text"
                value={properties.customClassName || ''}
                onChange={(e) => onPropertyChange('customClassName', e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="clase-personalizada otra-clase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estilos CSS</label>
              <textarea
                value={properties.customStyles || ''}
                onChange={(e) => onPropertyChange('customStyles', e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={4}
                placeholder="color: red; font-size: 16px;"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
