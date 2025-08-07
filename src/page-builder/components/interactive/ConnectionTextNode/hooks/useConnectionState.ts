import { useState, useRef, useEffect } from 'react';
import type { Element } from '../../../../types';
import { findPairedNode } from '../utils';

interface UseConnectionStateProps {
  element: Element;
  elements: Element[];
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const useConnectionState = ({ element, elements, onUpdate }: UseConnectionStateProps) => {
  const properties = element.properties as any;
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [actualLineColor, setActualLineColor] = useState<string | null>(null);
  
  // Use a persistent ref to store line coordinates that survives re-renders
  const persistentLineRef = useRef<{
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
  }>({
    start: null,
    end: null
  });

  // Find paired node
  const pairedNode = properties.connectionGroupId 
    ? findPairedNode(elements, element.id, properties.connectionGroupId)
    : null;

  // Check if connected
  const isConnected = Boolean(
    pairedNode && 
    (pairedNode.properties as any).connectionState === 'connected' &&
    properties.connectionState === 'connected'
  );

  // Handle connection attempt events from other nodes
  useEffect(() => {
    const handleConnectionAttempt = (event: CustomEvent) => {
      const { sourceId, targetId, success, randomColor } = event.detail;
      
      if (targetId === element.id && success) {
        
        let connectionUpdates: any = {
          connectionState: 'connected',
          connectedNodeId: sourceId
        };
        
        // Always apply the random color from the source node
        if (randomColor) {
          connectionUpdates.lineColor = randomColor;
        }
        
        onUpdate?.(connectionUpdates);
      }
    };

    document.addEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    return () => {
      document.removeEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    };
  }, [element.id, onUpdate]);

  return {
    isConnecting,
    setIsConnecting,
    showFeedback,
    setShowFeedback,
    isDrawing,
    setIsDrawing,
    drawStartPos,
    setDrawStartPos,
    currentMousePos,
    setCurrentMousePos,
    isMouseDown,
    setIsMouseDown,
    isHovered,
    setIsHovered,
    actualLineColor,
    setActualLineColor,
    persistentLineRef,
    pairedNode,
    isConnected
  };
}; 