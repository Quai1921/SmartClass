import React from 'react';
import { ImageUploadModal } from '../../../components/ImageWidget';
import type { Element } from '../../../types';

interface ConnectionWidgetPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const ConnectionWidgetProperties: React.FC<ConnectionWidgetPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.properties;
  const [imageModalOpen, setImageModalOpen] = React.useState(false);

  const handleImageSelect = (src: string, alt?: string) => {
    onPropertyChange('imageUrl', src);
    if (alt) {
      onPropertyChange('imageAlt', alt);
    }
    setImageModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Conexión</h4>
        </div>

        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Texto a Conectar</label>
          <input
            type="text"
            value={properties.text || ''}
            onChange={(e) => onPropertyChange('text', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Escribe el texto que el usuario debe conectar..."
          />
        </div>

        {/* Image Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Destino</label>
          <div className="space-y-3">
            {properties.imageUrl && (
              <div className="relative">
                <img
                  src={properties.imageUrl}
                  alt={properties.imageAlt || 'Preview'}
                  className="w-full h-32 object-cover rounded border border-gray-600"
                />
              </div>
            )}
            <button
              onClick={() => setImageModalOpen(true)}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              {properties.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </button>
          </div>
        </div>

        {/* Image Alt Text */}
        {properties.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto Alternativo</label>
            <input
              type="text"
              value={properties.imageAlt || ''}
              onChange={(e) => onPropertyChange('imageAlt', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Descripción de la imagen..."
            />
          </div>
        )}

        {/* Line Configuration */}
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-300">Configuración de Línea</h5>
          
          {/* Line Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de Línea</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={properties.lineColor || '#3b82f6'}
                onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                className="w-12 h-8 border border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={properties.lineColor || '#3b82f6'}
                onChange={(e) => onPropertyChange('lineColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          {/* Line Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grosor de Línea: {properties.lineWidth || 3}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={properties.lineWidth || 3}
              onChange={(e) => onPropertyChange('lineWidth', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Interaction Configuration */}
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-300">Configuración de Interacción</h5>
          
          {/* Allow Retry */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowRetry"
              checked={properties.allowRetry !== false}
              onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <label htmlFor="allowRetry" className="text-gray-300 text-sm">
              Permitir reintentos
            </label>
          </div>

          {/* Show Feedback */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showFeedback"
              checked={properties.showFeedback !== false}
              onChange={(e) => onPropertyChange('showFeedback', e.target.checked)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <label htmlFor="showFeedback" className="text-gray-300 text-sm">
              Mostrar retroalimentación
            </label>
          </div>
        </div>

        {/* Custom Messages */}
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-300">Mensajes Personalizados</h5>
          
          {/* Success Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Éxito</label>
            <input
              type="text"
              value={properties.successMessage || ''}
              onChange={(e) => onPropertyChange('successMessage', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="¡Excelente conexión!"
            />
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
            <textarea
              value={properties.feedbackMessage || ''}
              onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Mensaje adicional después de conectar..."
              rows={2}
            />
          </div>
        </div>

        {/* Reset Connection (for testing) */}
        {properties.isConnected && (
          <div>
            <button
              onClick={() => {
                onPropertyChange('isConnected', false);
                onPropertyChange('showResult', false);
              }}
              className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
            >
              Resetear Conexión (Modo Edición)
            </button>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </>
  );
};