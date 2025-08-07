import React, { memo } from 'react';
import { useElementSelection, usePropertyUpdates } from './hooks';
import { useBuilder } from '../hooks/useBuilder';
import { ContainerPropertiesPanel } from './ContainerPropertiesPanel';
import { TextElementProperties } from './components/properties/TextElementProperties';
import { ButtonElementProperties } from './components/properties/ButtonElementProperties';
import { ImageElementProperties } from './components/properties/ImageElementProperties';
import { TextStatementProperties } from './components/properties/TextStatementProperties';
import { ImageChoiceProperties } from './components/properties/ImageChoiceProperties';
import { ImageComparisonProperties } from './components/properties/ImageComparisonProperties';
import { AudioComparisonProperties } from './components/properties/AudioComparisonProperties';
import { AudioProperties } from './components/properties/AudioProperties';
import { AudioTrueFalseProperties } from './components/properties/AudioTrueFalseProperties';
import { AreaTrueFalseProperties } from './components/properties/AreaTrueFalseProperties';
import { SpeechRecognitionProperties } from './components/properties/SpeechRecognitionProperties';
import { ConnectionWidgetProperties } from './components/properties/ConnectionWidgetProperties';
import { ConnectionTextNodeProperties } from './components/properties/ConnectionTextNodeProperties';
import { ConnectionImageNodeProperties } from './components/properties/ConnectionImageNodeProperties';
import { DragDropWidgetProperties } from './components/properties/DragDropWidgetProperties';
import { FillInBlanksProperties } from './components/properties/FillInBlanksProperties';
import { SingleChoiceProperties } from './components/properties/SingleChoiceProperties';
import { MathCalculatorProperties } from './components/properties/MathCalculatorProperties';
import { StandaloneImageElementProperties } from './components/properties/StandaloneImageElementProperties';
import { CommonLayoutProperties } from './components/properties/CommonLayoutProperties';

// 🔍 DEBUG: Performance tracking for PropertyPanel
let propertyPanelRenderCount = 0;
let lastPropertyPanelRenderTime = Date.now();

/**
 * Partitioned PropertyPanel component with extracted hooks and modular components
 * This component coordinates different property sections based on element type
 */
interface PropertyPanelProps {
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
  openAudioChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND', elementType?: 'audio' | 'audio-true-false') => void;
}

const PropertyPanelComponent: React.FC<PropertyPanelProps> = ({ openImageChoiceModal, openAudioChoiceModal }) => {
  // 🔍 DEBUG: Track PropertyPanel re-renders
  propertyPanelRenderCount++;
  const currentTime = Date.now();
  const timeSinceLastRender = currentTime - lastPropertyPanelRenderTime;
  lastPropertyPanelRenderTime = currentTime;
  const { selectedElement, elementTypeInfo, hasSelectedElement } = useElementSelection();
  const { handlePropertyChange, handleElementUpdate } = usePropertyUpdates(selectedElement);
  const { textElementTab } = useBuilder();

  // Debug: Log when PropertyPanel renders with a selected element
  React.useEffect(() => {
    if (selectedElement) {

    }
  }, [selectedElement?.id, selectedElement?.type]);

  // Debug logging for textElementTab changes
  React.useEffect(() => {

  }, [textElementTab]);

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
  
  // Elements that need wider property panel due to complex properties
  const isWideElement = selectedElement.type === 'container' ||
                       selectedElement.type === 'simple-container' ||
                       selectedElement.type === 'audio-true-false' ||
                       selectedElement.type === 'area-true-false' ||
                       selectedElement.type === 'fill-in-blanks' ||
                       selectedElement.type === 'single-choice';

  return (
    <div className={`${isWideElement ? 'property-panel-wide' : 'property-panel'} h-full max-h-full flex flex-col`}>
      {/* Header Section with responsive padding and text */}
      <div className="property-panel-header bg-gray-700 border-b border-gray-600 px-4 py-2 flex-shrink-0">
        <h3 className="text-2xl font-semibold text-white">
          {displayName}
        </h3>
      </div>

      {/* Content Section with responsive spacing */}
      <div className="property-panel-content p-3 sm:p-4 space-y-4 sm:space-y-8 overflow-y-auto flex-1 pb-20">        
        
        {/* Container Properties */}
        {(selectedElement.type === 'container' || selectedElement.type === 'simple-container') && (
          <ContainerPropertiesPanel 
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
          />
        )}

        {/* Text Element Properties */}        {isTextElement && (
          <>

          <TextElementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_: string, updates: any) => handleElementUpdate(updates)}
            initialTab={textElementTab || 'basic'}
          />
          </>
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

        {/* Interactive Widget Properties */}
        {selectedElement.type === 'text-statement' && (
          <TextStatementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'image-choice' && (
          <ImageChoiceProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
          />
        )}

        {selectedElement.type === 'image-comparison' && (
          <ImageComparisonProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
          />
        )}

        {selectedElement.type === 'audio-comparison' && (
          <AudioComparisonProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
            openAudioChoiceModal={openAudioChoiceModal}
          />
        )}

        {selectedElement.type === 'audio' && (
          <AudioProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            openAudioChoiceModal={openAudioChoiceModal}
          />
        )}

        {selectedElement.type === 'audio-true-false' && (
          <AudioTrueFalseProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'area-true-false' && (
          <AreaTrueFalseProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'speech-recognition' && (
          <SpeechRecognitionProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'connection-widget' && (
          <ConnectionWidgetProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'connection-text-node' && (
          <ConnectionTextNodeProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
          />
        )}

        {selectedElement.type === 'connection-image-node' && (
          <ConnectionImageNodeProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
          />
        )}

        {selectedElement.type === 'drag-drop-widget' && (
          <DragDropWidgetProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
          />
        )}

        {selectedElement.type === 'fill-in-blanks' && (
          <FillInBlanksProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'single-choice' && (
          <SingleChoiceProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {selectedElement.type === 'math-calculator' && (
          <MathCalculatorProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
          />
        )}

        {/* Standalone Image Element Properties - show for elements with standalone properties */}
        {(selectedElement.properties?.standaloneElementType || selectedElement.properties?.ownedBy || selectedElement.properties?.dragDropOwner) && (
          <StandaloneImageElementProperties
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onElementUpdate={(_, updates) => handleElementUpdate(updates)}
            openImageChoiceModal={openImageChoiceModal}
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
