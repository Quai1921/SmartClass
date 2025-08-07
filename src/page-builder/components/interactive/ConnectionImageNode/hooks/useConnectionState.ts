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
  
  const [isTargeted, setIsTargeted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [targetFeedbackColor, setTargetFeedbackColor] = useState<string>('#22c55e');
  const [isShaking, setIsShaking] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  
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

  // Handle shake events
  useEffect(() => {
    const handleShakeEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.targetId === element.id) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    };

    const handleGlobalShakeEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.targetId === element.id) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    };

    document.addEventListener('triggerShake', handleShakeEvent);
    window.addEventListener('globalShake', handleGlobalShakeEvent);
    
    return () => {
      document.removeEventListener('triggerShake', handleShakeEvent);
      window.removeEventListener('globalShake', handleGlobalShakeEvent);
    };
  }, [element.id]);

  // Handle connection attempt events from other nodes
  useEffect(() => {
    const handleConnectionAttempt = (event: CustomEvent) => {
      const { sourceId, targetId, success, randomColor } = event.detail;
      
      if (targetId === element.id && success) {
        
        let connectionUpdates: Partial<Element['properties']> = {
          connectionState: 'connected' as const,
          connectedNodeId: sourceId
        };
        
        // Always apply the random color from the source node
        if (randomColor) {
          connectionUpdates.lineColor = randomColor;
        }
        
        onUpdate?.(connectionUpdates);
      }
    };

    const handleTargetFeedback = (event: CustomEvent) => {
      const { targetId, color, feedbackType: type } = event.detail;
      
      if (targetId === element.id) {
        setIsTargeted(true);
        if (color) setTargetFeedbackColor(color);
        if (type) setFeedbackType(type);
        
        setTimeout(() => {
          setIsTargeted(false);
          setFeedbackType(null);
        }, 2000);
      }
    };

    const handleForceConnect = (event: CustomEvent) => {
      const { targetId, sourceId } = event.detail;
      
      if (targetId === element.id) {
        
        const connectionUpdates: Partial<Element['properties']> = {
          connectionState: 'connected' as const,
          connectedNodeId: sourceId
        };
        
        onUpdate?.(connectionUpdates);
      }
    };

    document.addEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    document.addEventListener('targetFeedback', handleTargetFeedback as EventListener);
    document.addEventListener('forceConnect', handleForceConnect as EventListener);
    
    return () => {
      document.removeEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
      document.removeEventListener('targetFeedback', handleTargetFeedback as EventListener);
      document.removeEventListener('forceConnect', handleForceConnect as EventListener);
    };
  }, [element.id, onUpdate]);

  return {
    isTargeted,
    setIsTargeted,
    showFeedback,
    setShowFeedback,
    targetFeedbackColor,
    setTargetFeedbackColor,
    isShaking,
    setIsShaking,
    feedbackType,
    setFeedbackType,
    persistentLineRef,
    pairedNode,
    isConnected
  };
}; 