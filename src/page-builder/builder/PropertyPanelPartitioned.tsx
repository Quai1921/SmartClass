import React, { memo } from 'react';
import { useElementSelection, usePropertyUpdates } from './hooks';
import { ContainerPropertiesPanel } from './ContainerPropertiesPanel';
import { TextElementProperties } from './components/properties/TextElementProperties';
import { ButtonElementProperties } from './components/properties/ButtonElementProperties';
import { ImageElementProperties } from './components/properties/ImageElementProperties';
import { CommonLayoutProperties } from './components/properties/CommonLayoutProperties';

/**
 * Partitioned PropertyPanel component with extracted hooks and modular components
 * This component coordinates different property sections based on element type
 */
const PropertyPanelComponent: React.FC = () => {
  // Use partitioned hooks
  const { selectedElement, elementTypeInfo, hasSelectedElement } = useElementSelection();
  const { handlePropertyChange, handleElementUpdate } = usePropertyUpdates(selectedElement);

  // No element selected state
  if (!hasSelectedElement || !selectedElement || !elementTypeInfo) {
    return (
      <div className="property-panel">
        <div className="p-4 text-center text-gray-400">
          <p>Selecciona un elemento para ver sus propiedades</p>
        </div>
      </div>
    );
  }

  const { displayName, isTextElement } = elementTypeInfo;

  return (
    <div className={`${isTextElement ? 'property-panel-wide' : 'property-panel'} overflow-y-auto h-full max-h-full pb-20`}>
      {/* Header Section */}
      <div className="property-panel-header p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100">
          {displayName}
        </h3>
      </div>

      {/* Content Section */}
      <div className="property-panel-content p-4 space-y-8">        {/* Container Properties */}
        {selectedElement.type === 'container' && (
          <ContainerPropertiesPanel 
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
          />
        )}

        {/* Text Element Properties */}        {isTextElement && (
          <TextElementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_: string, updates: any) => handleElementUpdate(updates)}
          />
        )}{/* Button Element Properties */}
        {selectedElement.type === 'button' && (
          <ButtonElementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {/* Image Element Properties */}
        {selectedElement.type === 'image' && (
          <ImageElementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {/* Common Layout Properties for all elements */}
        <CommonLayoutProperties
          element={selectedElement}
          onPropertyChange={handlePropertyChange}
        />
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const PropertyPanel = memo(PropertyPanelComponent);
