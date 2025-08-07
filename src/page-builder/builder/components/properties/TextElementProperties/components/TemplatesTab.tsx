import React, { useState } from 'react';
import { TEXT_TEMPLATES, scaleTemplateForHeading } from '../utils';
import type { Element } from '../../../../types';

interface TemplatesTabProps {
  element: Element;
  onPropertyChange: (property: string, value: unknown) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  element,
  onPropertyChange
}) => {
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);

  // Get templates for current element type
  const currentTemplates = TEXT_TEMPLATES[element.type as keyof typeof TEXT_TEMPLATES] || TEXT_TEMPLATES.quote;

  // Helper function to apply template
  const applyTemplate = (template: typeof currentTemplates[0]) => {
    // First, clear all text style-related properties to avoid conflicts
    const clearedProperties = {
      ...element.properties,
      // Clear all text styling properties
      fontSize: undefined,
      fontWeight: undefined,
      fontFamily: undefined,
      fontStyle: undefined,
      color: undefined,
      textAlign: undefined,
      lineHeight: undefined,
      letterSpacing: undefined,
      wordSpacing: undefined,
      textDecoration: undefined,
      textDecorationColor: undefined,
      textDecorationStyle: undefined,
      textDecorationThickness: undefined,
      textTransform: undefined,
      textIndent: undefined,
      textShadow: undefined,
      whiteSpace: undefined,
      wordBreak: undefined,
      textOverflow: undefined,
      // Clear background and border properties
      backgroundColor: undefined,
      background: undefined,
      backgroundImage: undefined,
      backgroundSize: undefined,
      backgroundPosition: undefined,
      backgroundRepeat: undefined,
      border: undefined,
      borderLeft: undefined,
      borderRight: undefined,
      borderTop: undefined,
      borderBottom: undefined,
      borderRadius: undefined,
      borderWidth: undefined,
      borderColor: undefined,
      borderStyle: undefined,
      // Clear spacing properties
      padding: undefined,
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
      margin: undefined,
      marginTop: undefined,
      marginRight: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
      // Clear advanced properties
      boxShadow: undefined,
      maxWidth: undefined,
      minWidth: undefined,
      // NOTE: Removed width/height clearing to prevent interference with resize functionality
      // width: undefined,
      // height: undefined,
      // Clear webkit properties for gradient text
      WebkitBackgroundClip: undefined,
      WebkitTextFillColor: undefined
    };

    // Prepare template properties with scaling for heading elements
    let templateProperties = { ...template.properties } as Record<string, unknown>;
    
    if (element.type === 'heading' && templateProperties.fontSize) {
      const templateFontSize = templateProperties.fontSize as number;
      const headingLevel = element.properties.level || 1;
      templateProperties.fontSize = scaleTemplateForHeading(templateFontSize, headingLevel);
    }

    // Apply template properties
    Object.entries(templateProperties).forEach(([property, value]) => {
      if (value !== undefined) {
        onPropertyChange(property, value);
      }
    });

    // Clear cleared properties
    Object.entries(clearedProperties).forEach(([property, value]) => {
      if (value === undefined) {
        onPropertyChange(property, undefined);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-200">Plantillas de Estilo</h4>
        <button
          onClick={() => setTemplatePreviewOpen(!templatePreviewOpen)}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          {templatePreviewOpen ? 'Ocultar' : 'Mostrar'} Vista Previa
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Selecciona una plantilla para aplicar un estilo predefinido al texto. Las plantillas incluyen configuraciones optimizadas de tipografía, colores y espaciado.
      </p>

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
        {currentTemplates.map((template) => (
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
              <div className="flex justify-center p-3 bg-gray-800 rounded">
                <div
                  style={{
                    ...(template.preview as React.CSSProperties),
                    // Scale font size for heading templates based on current level
                    ...(element.type === 'heading' && template.preview.fontSize ? {
                      fontSize: `${scaleTemplateForHeading(
                        parseFloat(template.preview.fontSize.toString().replace('rem', '').replace('px', '')) * 
                        (template.preview.fontSize.toString().includes('rem') ? 16 : 1), // Convert rem to px
                        element.properties.level || 1
                      )}px`
                    } : {})
                  }}
                  className="pointer-events-none text-center"
                >
                  {element.properties.text || (element.type === 'heading' ? `Título H${element.properties.level || 1} de Ejemplo` : element.type === 'paragraph' ? 'Este es un párrafo de ejemplo que muestra cómo se verá el texto con este estilo aplicado.' : 'Texto de ejemplo')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 