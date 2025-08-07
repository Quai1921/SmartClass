import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Element } from '../../types';

interface ConnectionWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

interface Point {
  x: number;
  y: number;
}

interface ConnectionExtendedProps {
  text?: string;
  imageUrl?: string;
  imageAlt?: string;
  allowRetry?: boolean;
  showFeedback?: boolean;
  lineColor?: string;
  lineWidth?: number;
  isConnected?: boolean;
  userConnected?: boolean;
  showResult?: boolean;
  connectionPoints?: 'center' | 'edges' | 'auto';
  connectFromSide?: 'any' | 'specific';
  feedbackMessage?: string;
  successMessage?: string;
  retryMessage?: string;
}

export default function ConnectionWidget({ 
  element, 
  isSelected = false,
  isPreviewMode = false,
  onUpdate 
}: ConnectionWidgetProps) {
  const properties = element.properties;
  const extendedProps = properties as ConnectionExtendedProps;
  
  // Refs for the text and image nodes
  const textNodeRef = useRef<HTMLDivElement>(null);
  const imageNodeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // State for line drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [currentMousePoint, setCurrentMousePoint] = useState<Point | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Get connection state from properties
  const isConnected = extendedProps.userConnected || false;
  const showingResult = extendedProps.showResult || false;

  // Dynamic sizing logic based on widget dimensions
  const dynamicStyles = useMemo(() => {
    const widgetWidth = parseInt(element.properties.width?.toString() || '400');
    const widgetHeight = parseInt(element.properties.height?.toString() || '250');
    
    // Determine if we need compact layout
    const needsCompactLayout = widgetWidth < 350 || widgetHeight < 200;
    
    // Calculate responsive values
    const basePadding = Math.max(8, Math.min(20, widgetWidth * 0.05));
    const nodeSize = needsCompactLayout ? 
      Math.max(60, Math.min(80, widgetWidth * 0.15)) : 
      Math.max(80, Math.min(120, widgetWidth * 0.2));
    const fontSize = needsCompactLayout ? 
      Math.max(12, Math.min(14, widgetWidth * 0.035)) : 
      Math.max(14, Math.min(18, widgetWidth * 0.04));
    
    return {
      padding: `${basePadding}px`,
      nodeSize,
      fontSize: `${fontSize}px`,
      needsCompactLayout
    };
  }, [element.properties.width, element.properties.height]);

  // Get center point of an element relative to widget container
  const getElementCenter = (element: HTMLElement): Point => {
    if (!widgetRef.current) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    const containerRect = widgetRef.current.getBoundingClientRect();
    
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  };

  // Calculate connection points based on configuration
  const getConnectionPoint = (element: HTMLElement, side?: 'left' | 'right' | 'top' | 'bottom'): Point => {
    if (!widgetRef.current) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    const containerRect = widgetRef.current.getBoundingClientRect();
    
    const relativeX = rect.left - containerRect.left;
    const relativeY = rect.top - containerRect.top;
    
    switch (side) {
      case 'left':
        return { x: relativeX, y: relativeY + rect.height / 2 };
      case 'right':
        return { x: relativeX + rect.width, y: relativeY + rect.height / 2 };
      case 'top':
        return { x: relativeX + rect.width / 2, y: relativeY };
      case 'bottom':
        return { x: relativeX + rect.width / 2, y: relativeY + rect.height };
      default:
        return { x: relativeX + rect.width / 2, y: relativeY + rect.height / 2 };
    }
  };

  // Start drawing line
  const handleMouseDown = (e: React.MouseEvent, isTextNode: boolean) => {
    if (isConnected && !extendedProps.allowRetry) return;
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!widgetRef.current) return;
    
    const rect = widgetRef.current.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentMousePoint(point);
    setShowSuccess(false);
    setShowError(false);
  };

  // Update line while drawing
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || isPreviewMode) return;
    if (!widgetRef.current) return;
    
    const rect = widgetRef.current.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setCurrentMousePoint(point);
  };

  // Check if connection is valid when releasing mouse
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || isPreviewMode) return;
    
    const textNode = textNodeRef.current;
    const imageNode = imageNodeRef.current;
    
    if (textNode && imageNode && widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      const mousePoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Check if line connects text and image nodes
      const isNearText = isPointNearElement(mousePoint, textNode);
      const isNearImage = isPointNearElement(mousePoint, imageNode);
      
      const isValidConnection = (isNearText && !isNearImage) || (!isNearText && isNearImage);
      
      if (isValidConnection) {
        // Create successful connection
        const textCenter = getElementCenter(textNode);
        const imageCenter = getElementCenter(imageNode);
        
        setStartPoint(textCenter);
        setEndPoint(imageCenter);
        setShowSuccess(true);
        
        // Update element state
        onUpdate?.({
          isConnected: true,
          showResult: true
        });
        
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        // Invalid connection
        setShowError(true);
        setTimeout(() => setShowError(false), 1500);
        
        // Clear drawing
        setStartPoint(null);
        setEndPoint(null);
      }
    }
    
    setIsDrawing(false);
    setCurrentMousePoint(null);
  };

  // Helper to check if a point is near an element
  const isPointNearElement = (point: Point, element: HTMLElement) => {
    if (!widgetRef.current) return false;
    
    const rect = element.getBoundingClientRect();
    const containerRect = widgetRef.current.getBoundingClientRect();
    
    const elementX = rect.left + rect.width / 2 - containerRect.left;
    const elementY = rect.top + rect.height / 2 - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(point.x - elementX, 2) + Math.pow(point.y - elementY, 2)
    );
    
    return distance < 60; // Slightly larger threshold for better UX
  };

  // Reset connection
  const handleReset = () => {
    if (isPreviewMode) return;
    
    setStartPoint(null);
    setEndPoint(null);
    setShowSuccess(false);
    setShowError(false);
    
    onUpdate?.({
      isConnected: false,
      showResult: false
    });
  };

  // Initialize connection line if already connected
  useEffect(() => {
    if (isConnected && textNodeRef.current && imageNodeRef.current) {
      const textCenter = getElementCenter(textNodeRef.current);
      const imageCenter = getElementCenter(imageNodeRef.current);
      setStartPoint(textCenter);
      setEndPoint(imageCenter);
    }
  }, [isConnected]);

  // Trigger border update when content state changes
  useEffect(() => {
    if (isSelected && widgetRef.current) {
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          // Force reflow to update selection border
          const element = widgetRef.current;
          void element.offsetHeight;
          void element.getBoundingClientRect();
          
          // Dispatch a custom event to notify about content change
          const contentChangeEvent = new CustomEvent('elementContentChanged', {
            detail: { elementId: element.id, showingResult }
          });
          window.dispatchEvent(contentChangeEvent);
          
          // Also dispatch a resize event to update selection borders
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showingResult, isSelected, element.id]);

  return (
    <div 
      ref={widgetRef}
      className={`connection-widget ${properties.className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        padding: dynamicStyles.padding,
        backgroundColor: properties.backgroundColor || '#f8fafc',
        borderRadius: properties.borderRadius ? `${properties.borderRadius}px` : '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        ...(properties.style || {})
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isDrawing) {
          setIsDrawing(false);
          setCurrentMousePoint(null);
        }
      }}
    >
      {/* Text Node */}
      <div
        ref={textNodeRef}
        className={`text-node ${isConnected ? 'connected' : ''}`}
        style={{
          width: `${dynamicStyles.nodeSize}px`,
          minHeight: `${Math.max(60, dynamicStyles.nodeSize * 0.6)}px`,
          padding: '12px',
          border: `3px solid ${isConnected ? '#22c55e' : extendedProps.lineColor || '#3b82f6'}`,
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          cursor: isPreviewMode || (isConnected && !extendedProps.allowRetry) ? 'default' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: dynamicStyles.fontSize,
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.3s ease',
          boxShadow: isConnected ? '0 4px 12px rgba(34, 197, 94, 0.2)' : '0 2px 8px rgba(59, 130, 246, 0.1)',
          transform: isConnected ? 'scale(1.02)' : 'scale(1)',
          zIndex: 2
        }}
        onMouseDown={(e) => handleMouseDown(e, true)}
      >
        {extendedProps.text || properties.text || 'Connect me!'}
      </div>

      {/* Image Node */}
      <div
        ref={imageNodeRef}
        className={`image-node ${isConnected ? 'connected' : ''}`}
        style={{
          width: `${dynamicStyles.nodeSize}px`,
          height: `${dynamicStyles.nodeSize}px`,
          border: `3px solid ${isConnected ? '#22c55e' : extendedProps.lineColor || '#3b82f6'}`,
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: isPreviewMode || (isConnected && !extendedProps.allowRetry) ? 'default' : 'grab',
          transition: 'all 0.3s ease',
          boxShadow: isConnected ? '0 4px 12px rgba(34, 197, 94, 0.2)' : '0 2px 8px rgba(59, 130, 246, 0.1)',
          transform: isConnected ? 'scale(1.02)' : 'scale(1)',
          zIndex: 2
        }}
        onMouseDown={(e) => handleMouseDown(e, false)}
      >
        {extendedProps.imageUrl || properties.imageUrl ? (
          <img
            src={extendedProps.imageUrl || properties.imageUrl}
            alt={extendedProps.imageAlt || properties.imageAlt || 'Connection target'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            draggable={false}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: dynamicStyles.needsCompactLayout ? '12px' : '14px',
            textAlign: 'center'
          }}>
            {dynamicStyles.needsCompactLayout ? 'Image' : 'No Image'}
          </div>
        )}
      </div>

      {/* SVG for line drawing */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {/* Connection line */}
        {((startPoint && endPoint) || (isDrawing && startPoint && currentMousePoint)) && (
          <line
            x1={startPoint?.x || 0}
            y1={startPoint?.y || 0}
            x2={isDrawing ? (currentMousePoint?.x || 0) : (endPoint?.x || 0)}
            y2={isDrawing ? (currentMousePoint?.y || 0) : (endPoint?.y || 0)}
            stroke={isConnected ? '#22c55e' : extendedProps.lineColor || '#3b82f6'}
            strokeWidth={extendedProps.lineWidth || 3}
            strokeLinecap="round"
            strokeDasharray={isDrawing && !isConnected ? '8,4' : 'none'}
            style={{
              filter: isConnected ? 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))' : 'none',
              opacity: isDrawing && !isConnected ? 0.7 : 1
            }}
          />
        )}
        
        {/* Animated connection indicator */}
        {isConnected && startPoint && endPoint && (
          <circle
            r="4"
            fill={extendedProps.lineColor || '#3b82f6'}
            style={{
              opacity: 0.8
            }}
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`}
            />
          </circle>
        )}
      </svg>

      {/* Success Message */}
      {showSuccess && extendedProps.showFeedback !== false && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
          zIndex: 10,
          animation: 'fadeInOut 2s ease-in-out'
        }}>
          {extendedProps.successMessage || '¡Excelente conexión!'}
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
          zIndex: 10,
          animation: 'shake 0.5s ease-in-out'
        }}>
          Intenta conectar los elementos
        </div>
      )}

      {/* Instructions */}
      {!isConnected && !isPreviewMode && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#6b7280',
          fontSize: dynamicStyles.needsCompactLayout ? '11px' : '12px',
          textAlign: 'center',
          zIndex: 3
        }}>
          Arrastra para conectar
        </div>
      )}

      {/* Reset Button */}
      {!isPreviewMode && extendedProps.allowRetry !== false && isConnected && (
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#6b7280',
            transition: 'all 0.2s ease',
            zIndex: 3
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          <RotateCcw size={12} />
          {!dynamicStyles.needsCompactLayout && 'Reset'}
        </button>
      )}

      {/* Feedback Message */}
      {isConnected && showingResult && extendedProps.feedbackMessage && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#eff6ff',
          color: '#1e40af',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: '80%',
          zIndex: 3
        }}>
          {extendedProps.feedbackMessage}
        </div>
      )}

      {/* Inline styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            15%, 85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(-50%); }
            25% { transform: translateX(-50%) translateX(-5px); }
            75% { transform: translateX(-50%) translateX(5px); }
          }
          
          .connection-widget .text-node:hover, 
          .connection-widget .image-node:hover {
            transform: scale(1.05) !important;
          }
          
          .connection-widget .text-node.connected, 
          .connection-widget .image-node.connected {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1.02); }
            50% { transform: scale(1.05); }
          }
        `
      }} />
    </div>
  );
}
