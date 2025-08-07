import { useEffect } from 'react';
import type { Element } from '../../types';

// Debug state outside of the hook to persist across renders
let propertiesPanelRenderCount = 0;
let lastPropertiesPanelRenderTime = Date.now();

interface UseDebugPropertiesPanelOptions {
  element: Element;
  isThisElementResizing: boolean;
  displayWidth: number;
  displayHeight: number;
  inputWidth: number;
  inputHeight: number;
  resizeStateElementId?: string;
  resizeStateDimensions?: { width: number; height: number };
}

export const useDebugPropertiesPanel = ({
  element,
  isThisElementResizing,
  displayWidth,
  displayHeight,
  inputWidth,
  inputHeight,
  resizeStateElementId,
  resizeStateDimensions,
}: UseDebugPropertiesPanelOptions) => {
    useEffect(() => {
    // Track properties panel re-renders
    propertiesPanelRenderCount++;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastPropertiesPanelRenderTime;
    lastPropertiesPanelRenderTime = currentTime;

    // Debug logging removed for cleaner console
  }, [element.id, isThisElementResizing, displayWidth, displayHeight, inputWidth, inputHeight, element.properties.width, element.properties.height, resizeStateElementId, resizeStateDimensions]);

  return {
    renderCount: propertiesPanelRenderCount,
  };
};
