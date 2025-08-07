import React from 'react';
import type { Element } from '../types';

// Import all the modular components
import {
  ContainerNameSection,
  SpacingSection,
  DimensionsSection,
  PositioningSection,
  VisualStylingSection,
} from './components/properties';
import { BackgroundImageSection } from './components/properties/BackgroundImageSection';
import { FlexboxControls } from './components/properties/FlexboxControls';
import { ResponsivePositioningControls } from './components/properties/ResponsivePositioningControls';

// Import custom hooks for logic separation
import {
  useContainerPropertiesPanel,
  usePropertyHandlers,
  useDebugPropertiesPanel,
} from './hooks';

interface ContainerPropertiesPanelProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  resizeState?: {
    elementId: string | null;
    dimensions: { width: number; height: number } | null;
    isResizing: boolean;
  };
}

const ContainerPropertiesPanelComponent: React.FC<ContainerPropertiesPanelProps> = ({
  element,
  onPropertyChange,
  resizeState,
}) => {
  // Use custom hooks to extract logic
  const {
    updateElement,
    isThisElementResizing,
    displayWidth,
    displayHeight,
    inputWidth,
    inputHeight,
  } = useContainerPropertiesPanel({ element, resizeState });

  const {
    handleBackgroundColorChange,
    handleBorderWidthChange,
    handleBorderColorChange,
    handleWidthUnitChange,
    handleHeightUnitChange,
  } = usePropertyHandlers({ element, onPropertyChange });
  // Debug tracking
  useDebugPropertiesPanel({
    element,
    isThisElementResizing,    displayWidth,
    displayHeight,
    inputWidth,
    inputHeight,
    resizeStateElementId: resizeState?.elementId || undefined,
    resizeStateDimensions: resizeState?.dimensions || undefined,
  });

  return (
    <div className="container-properties-panel space-y-8">
      {/* Container Name Section */}
      <ContainerNameSection 
        element={element} 
        updateElement={updateElement} 
      />

      {/* Flexbox Controls Section */}
      <FlexboxControls 
        element={element} 
        onPropertyChange={onPropertyChange} 
      />      {/* Positioning Section */}
      <PositioningSection 
        element={element} 
        onPropertyChange={onPropertyChange} 
      />

      {/* Background Image Section */}
      <BackgroundImageSection 
        element={element} 
        onPropertyChange={onPropertyChange} 
      />

      {/* Spacing Section */}
      <SpacingSection 
        element={element} 
        onPropertyChange={onPropertyChange} 
      />

      {/* Dimensions Section */}
      <DimensionsSection 
        element={element}
        onPropertyChange={onPropertyChange}
        isThisElementResizing={isThisElementResizing}
        displayWidth={displayWidth}
        displayHeight={displayHeight}
        inputWidth={inputWidth}
        inputHeight={inputHeight}
        handleWidthUnitChange={handleWidthUnitChange}
        handleHeightUnitChange={handleHeightUnitChange}
      />      {/* Visual Styling Section */}
      <VisualStylingSection 
        element={element}
        onPropertyChange={onPropertyChange}
        handleBackgroundColorChange={handleBackgroundColorChange}
        handleBorderWidthChange={handleBorderWidthChange}
        handleBorderColorChange={handleBorderColorChange}
      />

      {/* Responsive Positioning Controls */}
      <ResponsivePositioningControls 
        containerId={element.id} 
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ContainerPropertiesPanel = React.memo(ContainerPropertiesPanelComponent, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if element properties or onPropertyChange reference changes
  return (
    prevProps.element.id === nextProps.element.id &&
    JSON.stringify(prevProps.element.properties) === JSON.stringify(nextProps.element.properties) &&
    prevProps.element.name === nextProps.element.name &&
    prevProps.onPropertyChange === nextProps.onPropertyChange
  );
});
