import React, { useRef, useEffect } from 'react';
import { Link2, Check } from 'lucide-react';
import type { Element } from '../../../types';
import { useBuilder } from '../../../hooks/useBuilder';
import { useConnectionState } from './hooks/useConnectionState';
import { ConnectionLine } from './components/ConnectionLine';
import { ConnectionControls } from './components/ConnectionControls';
import { ConnectionStyles } from './components/ConnectionStyles';
import { clearGlobalLine, generateRandomLineColor } from './utils';

interface ConnectionTextNodeProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const RefactoredConnectionTextNode: React.FC<ConnectionTextNodeProps> = ({
  element,
  isPreviewMode = false,
  onUpdate,
}) => {
  const { elements } = useBuilder();
  
  const properties = element.properties as any;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useConnectionState({ element, elements, onUpdate });

  // Detect if this is image content (same logic as JSX)
  const isImageContent = Boolean(
    (properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl)) ||
    (properties.imageSrc || properties.imageUrl) ||
    (properties.backgroundImage) ||
    (properties.imageChoice) ||
    (properties.backgroundUrl) // Check for other possible image properties
  );
  
  // EMERGENCY OVERRIDE: Force zero padding for ALL connection nodes with images
  // This is a temporary solution while we figure out the exact property structure
  useEffect(() => {
    const forceZeroPadding = () => {
      if (nodeRef.current) {
        const hasVisualImage = nodeRef.current.style.backgroundImage || 
                              nodeRef.current.querySelector('img') ||
                              window.getComputedStyle(nodeRef.current).backgroundImage !== 'none';
        
        if (hasVisualImage || isImageContent) {
          nodeRef.current.style.setProperty('padding', '0px', 'important');
          nodeRef.current.style.setProperty('margin', '0px', 'important');
          
          const allChildren = nodeRef.current.querySelectorAll('*');
          allChildren.forEach(child => {
            (child as HTMLElement).style.setProperty('padding', '0px', 'important');
            (child as HTMLElement).style.setProperty('margin', '0px', 'important');
          });
        }
      }
    };
    
    forceZeroPadding();
    const timer = setTimeout(forceZeroPadding, 100);
    return () => clearTimeout(timer);
  }, [properties, isConnected]); // Re-run on any changes
  
  // DETECTIVE MODE: Find the source of the mysterious padding
  useEffect(() => {
    if (nodeRef.current) {
      let element = nodeRef.current as HTMLElement | null;
      let level = 0;
      
      while (element && level < 10) {
        const computedStyle = window.getComputedStyle(element);
        
        if (computedStyle.padding.includes('16px')) {
          if (element.classList.contains('resizable-container')) {
            element.style.setProperty('padding', '0px', 'important');
            
            if (nodeRef.current) {
              nodeRef.current.style.setProperty('position', 'absolute', 'important');
              nodeRef.current.style.setProperty('top', '0', 'important');
              nodeRef.current.style.setProperty('left', '0', 'important');
              nodeRef.current.style.setProperty('right', '0', 'important');
              nodeRef.current.style.setProperty('bottom', '0', 'important');
            }
          }
        }
        element = element.parentElement;
        level++;
      }
    }
  }, []);

  const getNodeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: properties.minWidth || '120px',
      minHeight: properties.minHeight || '60px',
      padding: properties.padding || '12px 16px',
      border: properties.border || '2px solid #d1d5db',
      borderRadius: properties.borderRadius || '8px',
      backgroundColor: properties.backgroundColor || '#ffffff',
      color: properties.color || '#374151',
      fontSize: properties.fontSize || '14px',
      fontWeight: properties.fontWeight || '500',
      textAlign: properties.textAlign || 'center',
      cursor: isConnecting ? 'crosshair' : 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      hyphens: 'auto',
      whiteSpace: 'pre-wrap',
      overflow: 'visible',
      zIndex: isConnecting ? 1000 : 'auto',
      pointerEvents: isConnecting ? 'none' : 'auto'
    };

    // Apply hover effects
    if (isHovered && !isConnecting) {
      baseStyles.borderColor = properties.hoverBorderColor || '#3b82f6';
      baseStyles.backgroundColor = properties.hoverBackgroundColor || '#f8fafc';
      baseStyles.transform = 'translateY(-1px)';
      baseStyles.boxShadow = properties.hoverBoxShadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
    }

    // Apply connection state styles
    if (isConnected) {
      baseStyles.borderColor = actualLineColor || properties.lineColor || '#3b82f6';
      baseStyles.borderWidth = '3px';
      baseStyles.backgroundColor = properties.connectedBackgroundColor || '#eff6ff';
      baseStyles.color = properties.connectedTextColor || '#1e40af';
    }

    // Apply connecting state styles
    if (isConnecting) {
      baseStyles.borderColor = '#f59e0b';
      baseStyles.backgroundColor = '#fef3c7';
      baseStyles.animation = 'pulse 1.5s ease-in-out infinite';
    }

    // Apply custom styles
    if (properties.style) {
      Object.assign(baseStyles, properties.style);
    }

    return baseStyles;
  };

  const getCenterPoint = (elementRect: DOMRect) => {
    return {
      x: elementRect.left + elementRect.width / 2,
      y: elementRect.top + elementRect.height / 2
    };
  };

  const getBorderExitPoint = (mouseEvent: React.MouseEvent, elementRect: DOMRect) => {
    const center = getCenterPoint(elementRect);
    const mouseX = mouseEvent.clientX;
    const mouseY = mouseEvent.clientY;
    
    // Calculate angle from center to mouse
    const angle = Math.atan2(mouseY - center.y, mouseX - center.x);
    
    // Calculate intersection with border
    const halfWidth = elementRect.width / 2;
    const halfHeight = elementRect.height / 2;
    
    let exitX, exitY;
    
    if (Math.abs(Math.cos(angle)) * halfHeight > Math.abs(Math.sin(angle)) * halfWidth) {
      // Intersects with left or right border
      exitX = center.x + Math.sign(Math.cos(angle)) * halfWidth;
      exitY = center.y + Math.tan(angle) * (exitX - center.x);
    } else {
      // Intersects with top or bottom border
      exitY = center.y + Math.sign(Math.sin(angle)) * halfHeight;
      exitX = center.x + (exitY - center.y) / Math.tan(angle);
    }
    
    return { x: exitX, y: exitY };
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isConnecting && nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const exitPoint = getBorderExitPoint(e, rect);
      
      persistentLineRef.current.end = exitPoint;
      setCurrentMousePos(exitPoint);
    }
  };

  // Global mouse event handlers for drawing
  useEffect(() => {
    if (!isConnecting) return;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDrawing && drawStartPos) {
        setCurrentMousePos({ x: event.clientX, y: event.clientY });
        persistentLineRef.current.end = { x: event.clientX, y: event.clientY };
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDrawing) {
        setIsDrawing(false);
        setIsConnecting(false);
        setDrawStartPos(null);
        setCurrentMousePos(null);
        
        // Clear the line
        persistentLineRef.current.start = null;
        persistentLineRef.current.end = null;
        
        // Remove global event listeners
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isConnecting, isDrawing, drawStartPos]);

  const generateRandomColor = () => {
    const color = generateRandomLineColor();
    setActualLineColor(color);
    return color;
  };

  const handleReset = () => {
    // Clear connection state
    onUpdate?.({
      connectionState: 'disconnected',
      connectedNodeId: undefined,
      lineColor: undefined
    });
    
    // Clear global line
    clearGlobalLine(element.id);
    
    // Reset local state
    setActualLineColor(null);
    persistentLineRef.current.start = null;
    persistentLineRef.current.end = null;
    
    // Notify paired node
    if (pairedNode) {
      const event = new CustomEvent('connectionReset', {
        detail: { sourceId: element.id, targetId: pairedNode.id }
      });
      document.dispatchEvent(event);
    }
  };

  // Handle mouse down for connection drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode || isConnected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const startPoint = getCenterPoint(rect);
      
      setDrawStartPos(startPoint);
      setCurrentMousePos(startPoint);
      setIsDrawing(true);
      setIsConnecting(true);
      
      persistentLineRef.current.start = startPoint;
      persistentLineRef.current.end = startPoint;
      
      // Generate random color for this connection
      const randomColor = generateRandomColor();
      
      // Dispatch connection attempt event
      const event = new CustomEvent('connectionAttempt', {
        detail: {
          sourceId: element.id,
          targetId: null,
          success: false,
          randomColor
        }
      });
      document.dispatchEvent(event);
    }
  };

  // Handle mouse enter for connection feedback
  const handleMouseEnter = () => {
    if (isPreviewMode) return;
    
    setIsHovered(true);
    
    if (isConnecting && nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const centerPoint = getCenterPoint(rect);
      
      persistentLineRef.current.end = centerPoint;
      setCurrentMousePos(centerPoint);
      
      // Show connection feedback
      setShowFeedback(true);
      
      // Dispatch connection attempt event
      const event = new CustomEvent('connectionAttempt', {
        detail: {
          sourceId: null,
          targetId: element.id,
          success: true,
          randomColor: actualLineColor
        }
      });
      document.dispatchEvent(event);
    }
  };

  // Handle mouse leave
  const handleMouseLeaveEvent = (e: React.MouseEvent) => {
    setIsHovered(false);
    setShowFeedback(false);
    handleMouseLeave(e);
  };

  try {
    return (
      <>
        <div
          ref={nodeRef}
          className="connection-node"
          style={getNodeStyles()}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveEvent}
          data-node-type={isImageContent ? 'image' : 'text'}
          data-image-container={isImageContent ? 'true' : 'false'}
          data-connection-group-id={properties.connectionGroupId}
          data-connection-state={properties.connectionState}
        >
          {/* Content */}
          <div className="connection-content">
            {isImageContent ? (
              <img
                src={properties.imageSrc || properties.imageUrl || properties.backgroundImage || properties.backgroundUrl}
                alt={properties.alt || 'Connection Node Image'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
            ) : (
              <span>{properties.text || properties.content || 'Nodo de Conexión'}</span>
            )}
          </div>

          {/* Connection Icon */}
          {!isImageContent && (
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              fontSize: '12px',
              color: isConnected ? '#3b82f6' : '#9ca3af'
            }}>
              {isConnected ? <Check size={12} /> : <Link2 size={12} />}
            </div>
          )}

          {/* Connection Feedback */}
          {showFeedback && (
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 1001
            }}>
              Conectar
            </div>
          )}

          {/* Connection Controls */}
          <ConnectionControls
            isConnected={isConnected}
            isPreviewMode={isPreviewMode}
            allowRetry={properties.allowRetry}
            onReset={handleReset}
          />
        </div>

        {/* Connection Line */}
        {persistentLineRef.current.start && persistentLineRef.current.end && (
          <ConnectionLine
            start={persistentLineRef.current.start}
            end={persistentLineRef.current.end}
            lineColor={actualLineColor || properties.lineColor || '#3b82f6'}
            lineWidth={properties.lineWidth || 3}
            connectionPointSize={properties.connectionPointSize || 8}
            connectionPointColor={properties.connectionPointColor}
            showArrow={properties.showArrow}
            arrowSize={properties.arrowSize || 10}
          />
        )}

        {/* Connection Styles */}
        <ConnectionStyles />
      </>
    );
  } catch (error) {
    // console.error('❌ Error in ConnectionTextNode:', error);
    return (
      <div style={{
        padding: '8px',
        border: '2px solid red',
        borderRadius: '4px',
        backgroundColor: '#fee',
        color: 'red',
        fontSize: '12px'
      }}>
        Error in ConnectionTextNode: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
}; 