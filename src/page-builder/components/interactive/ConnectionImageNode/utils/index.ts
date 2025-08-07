import type { Element } from '../../../../types';

/**
 * Generate a bright, vibrant random color for connection lines
 */
export const generateRandomLineColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECCA7',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#54A0FF', '#5F27CD', '#A55EEA', '#26DE81', '#FD79A8',
    '#FDCB6E', '#6C5CE7', '#A29BFE', '#74B9FF', '#00B894'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Global storage for persistent connection lines - survives ALL re-renders and selections
// Store on window object to make it truly global across all components
declare global {
  interface Window {
    globalConnectionLines: Map<string, {
      start: { x: number; y: number };
      end: { x: number; y: number };
      color: string;
      isConnected: boolean;
    }>;
  }
}

// Initialize global storage
if (typeof window !== 'undefined' && !window.globalConnectionLines) {
  window.globalConnectionLines = new Map();
}

// Helper functions to manage global storage
export const saveGlobalLine = (elementId: string, start: { x: number; y: number }, end: { x: number; y: number }, color: string) => {
  if (typeof window !== 'undefined') {
    window.globalConnectionLines.set(elementId, { start, end, color, isConnected: true });
  }
};

export const getGlobalLine = (elementId: string) => {
  if (typeof window !== 'undefined') {
    return window.globalConnectionLines.get(elementId);
  }
  return undefined;
};

export const clearGlobalLine = (elementId: string) => {
  if (typeof window !== 'undefined') {
    window.globalConnectionLines.delete(elementId);
  }
};

// Helper function to find paired connection node
export const findPairedNode = (elements: Element[], currentElementId: string, connectionGroupId: string): Element | null => {
  return elements.find(el => 
    el.id !== currentElementId && 
    (el.type === 'connection-text-node' || el.type === 'connection-image-node') &&
    (el.properties as any).connectionGroupId === connectionGroupId
  ) || null;
};

// Helper function to check if node has image content
export const hasImageContent = (properties: any): boolean => {
  return Boolean(
    (properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl)) ||
    (properties.imageSrc || properties.imageUrl) ||
    (properties.backgroundImage) ||
    (properties.imageChoice) ||
    (properties.backgroundUrl)
  );
};

// Helper function to get image URL with fallbacks
export const getImageUrl = (properties: any): string => {
  return properties.imageUrl || 
         properties.imageSrc || 
         properties.backgroundImage || 
         properties.backgroundUrl || 
         '/api/placeholder/100/100';
};

// Helper function to calculate opacity with transparency controls
export const calculateOpacity = (properties: any, isConnected: boolean, isTargeted: boolean): number => {
  const props = properties;
  let baseOpacity = props.imageOpacity ?? 1;
  
  // Connection state transparency overrides
  if (isConnected && props.connectedTransparency !== undefined) {
    return (props.connectedTransparency / 100) * baseOpacity;
  }
  if (isTargeted && props.targetedTransparency !== undefined) {
    return (props.targetedTransparency / 100) * baseOpacity;
  }
  // Base transparency controls - multiply with image opacity
  if (props.enableTransparency && props.transparencyLevel !== undefined) {
    return ((props.transparencyLevel || 0) / 100) * baseOpacity;
  }
  // Default image opacity
  return baseOpacity;
};

// Helper function to check visibility with transparency controls
export const calculateVisibility = (properties: any, isConnected: boolean, isTargeted: boolean): 'visible' | 'hidden' => {
  const props = properties;
  if (isConnected && props.hideOnConnectedTransparency) return 'hidden';
  if (isTargeted && props.hideOnTargetedTransparency) return 'hidden';
  if (props.enableTransparency && props.hideOnTransparency) return 'hidden';
  return 'visible';
}; 