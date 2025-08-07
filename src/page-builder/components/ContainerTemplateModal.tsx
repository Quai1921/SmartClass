import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { containerTemplates, type ContainerTemplate } from '../utils/containerTemplates';

type LayoutType = 'flexbox' | 'grid';

interface ContainerTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ContainerTemplate) => void;
}

export const ContainerTemplateModal: React.FC<ContainerTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateSelect
}) => {
  const [selectedLayoutType, setSelectedLayoutType] = useState<LayoutType | null>(null);

  // Reset selection when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedLayoutType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLayoutTypeSelect = (layoutType: LayoutType) => {
    setSelectedLayoutType(layoutType);
  };

  const handleBackToLayoutSelection = () => {
    setSelectedLayoutType(null);
  };

  const filteredTemplates = selectedLayoutType 
    ? containerTemplates.filter(template => 
        template.layoutType === selectedLayoutType || 
        (!template.layoutType && selectedLayoutType === 'flexbox') // Default to flexbox for templates without layoutType
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10000]">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 border border-gray-700 shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {selectedLayoutType && (
              <button
                onClick={handleBackToLayoutSelection}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ←
              </button>
            )}
            <h2 className="text-xl font-semibold text-white">
              {selectedLayoutType ? 'Selecciona la estructura' : '¿Qué diseño te gustaría utilizar?'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!selectedLayoutType ? (
          <>
            {/* Layout Type Selection */}
            <p className="text-gray-300 mb-8 text-center">
              Elige el tipo de diseño que mejor se adapte a tu contenido:
            </p>

            <div className="flex justify-center gap-8">
              <button
                onClick={() => handleLayoutTypeSelect('flexbox')}
                className="group flex flex-col items-center p-8 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 hover:scale-105 min-w-[200px]"
              >
                {/* Flexbox Icon */}
                <div className="mb-4 p-4 bg-gray-600 group-hover:bg-gray-500 rounded-lg transition-colors">
                  <div className="flex gap-1 w-12 h-8">
                    <div className="flex-1 bg-gray-300 rounded"></div>
                    <div className="flex-1 bg-gray-300 rounded"></div>
                    <div className="flex-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">Flexbox</h3>
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  Diseños flexibles y adaptativos. Ideal para columnas, filas y layouts responsivos.
                </p>
              </button>

              <button
                onClick={() => handleLayoutTypeSelect('grid')}
                className="group flex flex-col items-center p-8 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 hover:scale-105 min-w-[200px]"
              >
                {/* Grid Icon */}
                <div className="mb-4 p-4 bg-gray-600 group-hover:bg-gray-500 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 gap-1 w-12 h-8">
                    <div className="bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">Grid</h3>
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  Cuadrículas precisas y estructuradas. Perfecto para galerías y layouts complejos.
                </p>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Template Selection */}
            <p className="text-gray-300 mb-6 text-center">
              Elige una plantilla de <span className="text-blue-400 font-medium">{selectedLayoutType}</span> para organizar tu contenedor:
            </p>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="group flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-blue-500 transition-all duration-200 hover:scale-105"
                >
                  {/* Template Icon */}
                  <div className="mb-3 p-3 bg-gray-600 group-hover:bg-gray-500 rounded-lg transition-colors">
                    {template.icon}
                  </div>
                  
                  {/* Template Name */}
                  <h3 className="text-sm font-medium text-white mb-1 text-center">
                    {template.name}
                  </h3>
                  
                  {/* Template Description */}
                  <p className="text-xs text-gray-400 text-center">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <p className="text-sm text-blue-200 text-center">
                💡 Los contenedores se organizarán automáticamente según la plantilla seleccionada
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
