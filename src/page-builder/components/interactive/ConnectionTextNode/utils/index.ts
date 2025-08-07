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