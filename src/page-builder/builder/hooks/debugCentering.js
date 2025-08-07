// Centering Debug Tool
// Run this in the browser console to debug centering issues

function debugCanvasCentering() {
  
  // Find the canvas element
  const canvasElement = document.querySelector('[data-canvas]');
  
  if (!canvasElement) {
    return;
  }
  
  // Get all canvas measurements
  const rect = canvasElement.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(canvasElement);
  
  // Find any containers on the canvas
  const containers = document.querySelectorAll('[data-container-id]');
  
  containers.forEach((container, index) => {
    const containerRect = container.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(container);
    
    // Calculate centering
    const canvasWidth = rect.width;
    const containerWidth = containerRect.width;
    const actualLeft = containerRect.left - rect.left; // Relative to canvas
    const expectedCenteredLeft = (canvasWidth - containerWidth) / 2;
    const offset = actualLeft - expectedCenteredLeft;
  });
  
  // Check for any CSS that might affect positioning
}

// Make it available globally
window.debugCanvasCentering = debugCanvasCentering;

// Add manual adaptive resize trigger for testing
window.triggerAdaptiveResize = function() {
  
  // Reset state first in case it's stuck
  if (window.__pageBuilderResetState) {
    window.__pageBuilderResetState();
  }
  
  // Dispatch a custom event that our hook can listen to
  window.dispatchEvent(new CustomEvent('manual-adaptive-resize'));
  
  // Also try to call the PageBuilder's resize function if available
  if (window.__pageBuilderResizeContainers) {
    window.__pageBuilderResizeContainers();
  } else {
  }
};

// Add a reset function for stuck states
window.resetAdaptiveResize = function() {

  
  if (window.__pageBuilderResetState) {
    window.__pageBuilderResetState();
  } else {
  }
};

