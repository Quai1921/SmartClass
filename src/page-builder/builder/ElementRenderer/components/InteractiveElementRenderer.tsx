import React from 'react';
import { 
  TextStatementWidget,
  ImageChoiceWidget,
  ImageComparisonWidget,
  AudioComparisonWidget,
  AudioTrueFalseWidget,
  AreaTrueFalseWidget,
  ConnectionWidget
} from '../components/interactive';
import { FillInTheBlanksWidget } from '../components/interactive/FillInTheBlanksWidget';
import { SingleChoiceWidget } from '../components/interactive/SingleChoiceWidget';
import { ConnectionTextNode } from '../components/interactive/ConnectionTextNode';
import { ConnectionImageNode } from '../components/interactive/ConnectionImageNode';
import { DragDropWidget } from '../components/interactive/DragDropWidget';
import { StandaloneWidget } from '../components/interactive/StandaloneWidget';
import { MathCalculatorWidget } from '../components/interactive/MathCalculatorWidget';
import SpeechRecognitionWidget from '../components/interactive/SpeechRecognitionWidget';
import type { Element } from '../types';

interface InteractiveElementRendererProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Record<string, any>) => void;
}

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  isSelected,
  isPreviewMode,
  onUpdate
}) => {
  const { type, properties } = element;

  switch (type) {
    case 'text-statement':
      return (
        <TextStatementWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'image-choice':
      return (
        <div className="element-content" style={{
          width: properties.width ? `${properties.width}px` : undefined,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
          <ImageChoiceWidget
            element={element}
            isSelected={isSelected}
            isPreviewMode={isPreviewMode}
            onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
          />
        </div>
      );

    case 'image-comparison':
      return (
        <ImageComparisonWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'audio-comparison':
      return (
        <AudioComparisonWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'audio-true-false':
      return (
        <div className="element-content" style={{
          width: undefined,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
          <AudioTrueFalseWidget element={element} isSelected={isSelected} />
        </div>
      );

    case 'fill-in-blanks':
      return (
        <FillInTheBlanksWidget
          element={element}
          isSelected={isSelected}
        />
      );

    case 'single-choice':
      return (
        <SingleChoiceWidget
          element={element}
          isSelected={isSelected}
        />
      );

    case 'math-calculator':
      return (
        <MathCalculatorWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'area-true-false':
      return (
        <AreaTrueFalseWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'speech-recognition':
      return (
        <SpeechRecognitionWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'connection-widget':
      return (
        <ConnectionWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'connection-text-node':
      return (
        <ConnectionTextNode
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'connection-image-node':
      return (
        <ConnectionImageNode
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    case 'drag-drop-widget':
      return (
        <DragDropWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'standalone-widget':
      return (
        <StandaloneWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    default:
      return null;
  }
}; 