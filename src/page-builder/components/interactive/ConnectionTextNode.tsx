import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link2, Zap, Check, X } from 'lucide-react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

/**
 * Generate a bright, vibrant random color for connection lines
 */
const generateRandomLineColor = (): string => {
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
const saveGlobalLine = (elementId: string, start: { x: number; y: number }, end: { x: number; y: number }, color: string) => {
  if (typeof window !== 'undefined') {
    window.globalConnectionLines.set(elementId, { start, end, color, isConnected: true });
  }
};

const getGlobalLine = (elementId: string) => {
  if (typeof window !== 'undefined') {
    return window.globalConnectionLines.get(elementId);
  }
  return undefined;
};

const clearGlobalLine = (elementId: string) => {
  if (typeof window !== 'undefined') {
    window.globalConnectionLines.delete(elementId);
  }
};

// Helper function to find paired connection node
const findPairedNode = (elements: Element[], currentElementId: string, connectionGroupId: string): Element | null => {
  return elements.find(el => 
    el.id !== currentElementId && 
    (el.type === 'connection-text-node' || el.type === 'connection-image-node') &&
    (el.properties as any).connectionGroupId === connectionGroupId
  ) || null;
};

interface ConnectionTextNodeProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const ConnectionTextNode: React.FC<ConnectionTextNodeProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate,
}) => {
  const { elements, updateElement, removeElement } = useBuilder();
  
  const properties = element.properties as any;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  // Hover state management for advanced styling
  const [isHovered, setIsHovered] = useState(false);
  
  // Store the actual line color (from global storage or random generation)
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
  const isConnected = pairedNode && 
    (pairedNode.properties as any).connectionState === 'connected' &&
    properties.connectionState === 'connected';

  // Detect if this is image content (same logic as JSX)
  const isImageContent = (properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl)) ||
                        (properties.imageSrc || properties.imageUrl) ||
                        (properties.backgroundImage) ||
                        (properties.imageChoice) ||
                        (properties.backgroundUrl); // Check for other possible image properties
  
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

    window.addEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    
    return () => {
      window.removeEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    };
  }, [element.id, onUpdate]);
  
  // Enhanced getNodeStyles with comprehensive customization
  const getNodeStyles = (): React.CSSProperties => {
    const props = properties;
    
    // Check text mode for different styling approaches
    const textMode = props.textMode || 'styled';
    const isPlainText = textMode === 'plain';
    const isMinimal = textMode === 'minimal';
    
    // Transparency controls - check for transparency toggle
    const isTransparent = props.enableTransparency === true;
    const transparencyLevel = props.transparencyLevel || 0; // 0-100 scale
    const hideOnTransparency = props.hideOnTransparency === true;
    
    // Build box shadow if enabled
    let boxShadow = 'none';
    if (props.enableBoxShadow && !isPlainText) {
      const x = props.boxShadowX || '0px';
      const y = props.boxShadowY || '2px';
      const blur = props.boxShadowBlur || '4px';
      const color = props.boxShadowColor || '#00000033';
      boxShadow = `${x} ${y} ${blur} ${color}`;
    }

    // Build text shadow if enabled
    let textShadow = 'none';
    if (props.enableTextShadow) {
      const x = props.textShadowX || '1px';
      const y = props.textShadowY || '1px';
      const color = props.textShadowColor || '#000000';
      textShadow = `${x} ${y} ${color}`;
    }

    // Build padding from individual values or unified X/Y values - different for each text mode
    // For image content, remove padding to allow full container coverage
    // Use the same logic as JSX to detect if this is showing an image
    const isImageContent = (properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl)) ||
                          (properties.imageSrc || properties.imageUrl); // Also true if image properties exist
    
    const paddingY = isImageContent ? '0px' : (props.paddingY || (isPlainText ? '0px' : isMinimal ? '4px' : '8px'));
    const paddingX = isImageContent ? '0px' : (props.paddingX || (isPlainText ? '0px' : isMinimal ? '6px' : '12px'));
    
    const paddingTop = isImageContent ? '0px' : (props.paddingTop || paddingY);
    const paddingRight = isImageContent ? '0px' : (props.paddingRight || paddingX);
    const paddingBottom = isImageContent ? '0px' : (props.paddingBottom || paddingY);
    const paddingLeft = isImageContent ? '0px' : (props.paddingLeft || paddingX);
    const padding = isImageContent ? '0px 0px 0px 0px' : `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
    
    // Build margin from individual values
    const marginTop = props.marginTop || '0px';
    const marginRight = props.marginRight || '0px';
    const marginBottom = props.marginBottom || '0px';
    const marginLeft = props.marginLeft || '0px';
    const margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;
    
    const baseStyles: React.CSSProperties = {
      // Basic layout
      display: props.display || 'flex',
      alignItems: props.alignItems || 'stretch',
      justifyContent: props.justifyContent || 'center',
      position: isImageContent ? 'relative' : 'static',
      overflow: isImageContent ? 'hidden' : 'visible',
      
      // Size and constraints - ensure strict sizing for image content
      width: props.width || '120px',
      height: props.height || '40px',
      minWidth: isImageContent ? (props.width || '120px') : (props.minWidth || '100px'),
      maxWidth: isImageContent ? (props.width || '120px') : (props.maxWidth || 'none'),
      minHeight: isImageContent ? (props.height || '40px') : (props.minHeight || '35px'),
      maxHeight: isImageContent ? (props.height || '40px') : (props.maxHeight || 'none'),
      
      // Spacing - Force zero padding for images
      padding: isImageContent ? '0px' : padding,
      paddingTop: isImageContent ? '0px' : undefined,
      paddingRight: isImageContent ? '0px' : undefined,
      paddingBottom: isImageContent ? '0px' : undefined,
      paddingLeft: isImageContent ? '0px' : undefined,
      margin,
      // Force box-sizing for images to prevent any padding/border issues
      boxSizing: isImageContent ? 'border-box' : 'content-box',
      
      // Typography
      fontFamily: props.fontFamily || 'inherit',
      fontSize: props.fontSize || '14px',
      fontWeight: props.fontWeight || '500',
      textAlign: props.textAlign || 'center',
      lineHeight: props.lineHeight || (isPlainText ? '1.5' : '1.4'),
      letterSpacing: props.letterSpacing || 'normal',
      textDecoration: isPlainText ? (props.textDecoration || 'none') : 'none',
      textTransform: isPlainText ? (props.textTransform || 'none') : 'none',
      color: isHovered && isPlainText && props.hoverTextColor
        ? props.hoverTextColor
        : props.textColor || (isPlainText ? '#374151' : isMinimal ? '#4b5563' : '#ffffff'),
      // Enhanced opacity with transparency controls
      opacity: (() => {
        // If completely transparent mode is enabled
        if (isTransparent) {
          if (hideOnTransparency) return 0; // Completely hidden
          return transparencyLevel / 100; // Use transparency level (0-100 -> 0-1)
        }
        // Default opacity behavior
        return isPlainText ? (props.textOpacity || 1) : (props.opacity || 1);
      })(),
      // Visibility control for complete transparency
      visibility: (isTransparent && hideOnTransparency) ? 'hidden' as const : 'visible' as const,
      textShadow,
      
      // Comprehensive Border System - respects enableBorder toggle
      ...(props.enableBorder && !isPlainText ? {
        // Individual border widths
        borderTopWidth: `${props.borderTopWidth || props.borderWidth || 1}px`,
        borderRightWidth: `${props.borderRightWidth || props.borderWidth || 1}px`,
        borderBottomWidth: `${props.borderBottomWidth || props.borderWidth || 1}px`,
        borderLeftWidth: `${props.borderLeftWidth || props.borderWidth || 1}px`,
        // Individual border styles
        borderTopStyle: props.borderTopStyle || props.borderStyle || 'solid',
        borderRightStyle: props.borderRightStyle || props.borderStyle || 'solid',
        borderBottomStyle: props.borderBottomStyle || props.borderStyle || 'solid',
        borderLeftStyle: props.borderLeftStyle || props.borderStyle || 'solid',
        // Individual border colors
        borderTopColor: props.borderTopColor || props.borderColor || '#e2e8f0',
        borderRightColor: props.borderRightColor || props.borderColor || '#e2e8f0',
        borderBottomColor: props.borderBottomColor || props.borderColor || '#e2e8f0',
        borderLeftColor: props.borderLeftColor || props.borderColor || '#e2e8f0',
        // Individual border radius
        borderTopLeftRadius: props.borderTopLeftRadius || props.borderRadius || '8px',
        borderTopRightRadius: props.borderTopRightRadius || props.borderRadius || '8px',
        borderBottomLeftRadius: props.borderBottomLeftRadius || props.borderRadius || '8px',
        borderBottomRightRadius: props.borderBottomRightRadius || props.borderRadius || '8px',
      } : {
        border: 'none',
        borderRadius: isPlainText ? '0px' : isMinimal ? '4px' : '0px',
      }),
      
      // Background and effects - conditional based on text mode and transparency
      backgroundColor: (() => {
        // If transparency is enabled, make background transparent unless specifically overridden
        if (isTransparent && !props.overrideTransparentBackground) {
          return 'transparent';
        }
        
        // Default background behavior
        if (isPlainText) return 'transparent';
        
        if (isMinimal) {
          return isHovered && props.enableHoverEffects 
            ? (props.hoverBackgroundColor || props.backgroundColor || '#f3f4f6')
            : (props.backgroundColor || '#f3f4f6');
        }
        
        return isHovered && props.enableHoverEffects 
          ? (props.hoverBackgroundColor || props.backgroundColor || '#3b82f6')
          : (props.backgroundColor || '#3b82f6');
      })(),
      boxShadow: (isPlainText || isMinimal || (isTransparent && !props.enableTransparentShadow)) ? 'none' : boxShadow,
      
      // Interaction and behavior
      userSelect: 'none',
      cursor: 'pointer',
      
      // Transitions and Transform
      transition: props.enableHoverEffects 
        ? `all ${props.transitionDuration || '0.2s'} ease`
        : isPlainText
          ? 'color 0.2s ease, text-decoration 0.2s ease'
          : 'all 0.3s ease',
      transform: (() => {
        if (isHovered && props.enableHoverEffects && props.hoverScale && !isPlainText) {
          return `scale(${props.hoverScale})`;
        }
        return 'none';
      })(),
    };

    // State-specific modifications - respect text mode, border system, and transparency
    if (isConnected) {
      const connectedStyles = {
        ...baseStyles,
        transform: props.connectedTransform || (isPlainText ? 'none' : 'scale(1.02)'),
        // For plain text and minimal, use text color changes instead of background changes
        color: (isPlainText || isMinimal) ? (props.connectedTextColor || '#22c55e') : baseStyles.color,
        
        // Enhanced connected transparency controls
        opacity: (() => {
          // Connected transparency override
          if (props.connectedTransparency !== undefined) {
            if (props.hideOnConnectedTransparency) return 0;
            return props.connectedTransparency / 100;
          }
          // Fallback to base transparency if connected transparency not set
          return baseStyles.opacity;
        })(),
        visibility: (props.connectedTransparency !== undefined && props.hideOnConnectedTransparency) ? 'hidden' as const : 'visible' as const,
      };

      // Apply connected border styles only if borders are enabled and not plain text and not in full transparency mode
      if (props.enableBorder && !isPlainText && !(props.connectedTransparency === 0 && props.hideOnConnectedTransparency)) {
        Object.assign(connectedStyles, {
          borderColor: props.connectedBorderColor || '#22c55e',
          boxShadow: props.enableConnectedBoxShadow === false ? 'none' : (props.connectedBoxShadow || '0 4px 12px rgba(34, 197, 94, 0.2)'),
        });
      }

      // Apply connected background for minimal and normal modes - respect transparency
      if (!isPlainText) {
        if (props.connectedTransparency !== undefined && !props.overrideTransparentBackground) {
          connectedStyles.backgroundColor = 'transparent';
        } else {
          connectedStyles.backgroundColor = isMinimal 
            ? (props.connectedBackgroundColor || '#f0fdf4') 
            : (props.connectedBackgroundColor || baseStyles.backgroundColor);
        }
      }

      // Only apply pulse animation if enabled
      if (props.enablePulseOnConnect === true) {
        connectedStyles.animation = 'pulse 2s infinite';
      } else {
        connectedStyles.animation = undefined;
      }

      return connectedStyles;
    }

    if (isSelected) {
      const selectedStyles = {
        ...baseStyles,
        // For plain text and minimal, use text color changes instead of background changes
        color: (isPlainText || isMinimal) ? (props.selectedTextColor || '#f59e0b') : baseStyles.color,
        
        // Enhanced selected transparency controls
        opacity: (() => {
          // Selected transparency override
          if (props.selectedTransparency !== undefined) {
            if (props.hideOnSelectedTransparency) return 0;
            return props.selectedTransparency / 100;
          }
          // Fallback to base transparency if selected transparency not set
          return baseStyles.opacity;
        })(),
        visibility: (props.selectedTransparency !== undefined && props.hideOnSelectedTransparency) ? 'hidden' as const : 'visible' as const,
      };

      // Apply selected border styles only if borders are enabled and not plain text and not in full transparency mode
      if (props.enableBorder && !isPlainText && !(props.selectedTransparency === 0 && props.hideOnSelectedTransparency)) {
        Object.assign(selectedStyles, {
          borderColor: props.selectedBorderColor || '#f59e0b',
          boxShadow: props.selectedBoxShadow || '0 4px 12px rgba(245, 158, 11, 0.3)',
        });
      }

      // Apply selected background for minimal and normal modes - respect transparency
      if (!isPlainText) {
        if (props.selectedTransparency !== undefined && !props.overrideTransparentBackground) {
          selectedStyles.backgroundColor = 'transparent';
        } else {
          selectedStyles.backgroundColor = isMinimal 
            ? (props.selectedBackgroundColor || '#fefce8') 
            : (props.selectedBackgroundColor || baseStyles.backgroundColor);
        }
      }

      return selectedStyles;
    }

    if (isConnecting) {
      const connectingStyles = {
        ...baseStyles,
        animation: props.connectingAnimation || 'pulse 1.5s infinite',
        
        // Enhanced connecting transparency controls
        opacity: (() => {
          // Connecting transparency override
          if (props.connectingTransparency !== undefined) {
            if (props.hideOnConnectingTransparency) return 0;
            return props.connectingTransparency / 100;
          }
          // Fallback to base transparency if connecting transparency not set
          return baseStyles.opacity;
        })(),
        visibility: (props.connectingTransparency !== undefined && props.hideOnConnectingTransparency) ? 'hidden' as const : 'visible' as const,
      };

      // Apply connecting styles only if not plain text and not in full transparency mode
      if (!isPlainText && !(props.connectingTransparency === 0 && props.hideOnConnectingTransparency)) {
        Object.assign(connectingStyles, {
          borderColor: props.connectingBorderColor || props.lineColor || '#3b82f6',
          boxShadow: props.connectingBoxShadow || '0 4px 12px rgba(59, 130, 246, 0.3)',
          backgroundColor: (props.connectingTransparency !== undefined && !props.overrideTransparentBackground) 
            ? 'transparent' 
            : (props.connectingBackgroundColor || baseStyles.backgroundColor),
        });
      } else {
        // For plain text, just change color when connecting
        connectingStyles.color = props.connectingTextColor || props.lineColor || '#3b82f6';
      }

      return connectingStyles;
    }

    return baseStyles;
  };

  // Get center point of element for line drawing origin
  const getCenterPoint = (elementRect: DOMRect) => {
    const { left, top, width, height } = elementRect;
    return {
      x: left + width / 2,
      y: top + height / 2,
      direction: 'center'
    };
  };

  // Border detection for line drawing origin (legacy - now using center)
  const getBorderExitPoint = (mouseEvent: React.MouseEvent, elementRect: DOMRect) => {
    const { clientX, clientY } = mouseEvent;
    const { left, top, right, bottom, width, height } = elementRect;
    
    // Calculate relative position within element
    const relativeX = clientX - left;
    const relativeY = clientY - top;
    
    // Determine which border is closest (exit direction)
    const distanceToLeft = relativeX;
    const distanceToRight = width - relativeX;
    const distanceToTop = relativeY;
    const distanceToBottom = height - relativeY;
    
    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
    
    if (minDistance === distanceToLeft) {
      // Exit from left border
      return { x: left, y: clientY, direction: 'left' };
    } else if (minDistance === distanceToRight) {
      // Exit from right border
      return { x: right, y: clientY, direction: 'right' };
    } else if (minDistance === distanceToTop) {
      // Exit from top border
      return { x: clientX, y: top, direction: 'top' };
    } else {
      // Exit from bottom border
      return { x: clientX, y: bottom, direction: 'bottom' };
    }
  };

  // Handle mouse leave to start drawing
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isPreviewMode || isConnected || properties.enableConnectionDrawing === false) return;
    
    const nodeElement = nodeRef.current;
    if (!nodeElement) return;
    
    const rect = nodeElement.getBoundingClientRect();
    // Always start from the center of the element
    const centerPoint = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      direction: 'center' as const
    };
    
    setIsDrawing(true);
    setIsConnecting(true);
    setDrawStartPos(centerPoint);
    setCurrentMousePos({ x: e.clientX, y: e.clientY });
    
    // Add global mouse move listener
    const handleGlobalMouseMove = (event: MouseEvent) => {
      setCurrentMousePos({ x: event.clientX, y: event.clientY });
    };
    
    const handleGlobalMouseUp = (event: MouseEvent) => {
      const targetElement = document.elementFromPoint(event.clientX, event.clientY);
      const targetNodeElement = targetElement?.closest('[data-node-type]');

      if (targetNodeElement) {
        const targetElementId = targetNodeElement.getAttribute('data-element-id');
        const targetNodeType = targetNodeElement.getAttribute('data-node-type');
        const targetConnectionGroup = targetNodeElement.getAttribute('data-connection-group');

        if (targetElementId && targetElementId !== element.id && 
            (targetNodeType === 'text' || targetNodeType === 'image')) {
          const sourceConnectionGroup = properties.connectionGroupId;

          if ((sourceConnectionGroup && targetConnectionGroup && 
               sourceConnectionGroup === targetConnectionGroup) ||
              (!sourceConnectionGroup && !targetConnectionGroup)) {
            // Valid connection - always generate random color for the pair
            const randomColor = generateRandomLineColor();
            
            let connectionUpdates: any = {
              connectionState: 'connected',
              connectedNodeId: targetElementId,
              lineColor: randomColor // Always apply random color
            };
            
            
            // Update this node's connection state
            onUpdate?.(connectionUpdates);
            
            // Update the target node's connection state with the same color
            const targetElementForEvent = document.querySelector(`[data-element-id="${targetElementId}"]`);
            if (targetElementForEvent) {
              const connectionEvent = new CustomEvent('connectionAttempt', {
                detail: {
                  sourceId: element.id,
                  targetId: targetElementId,
                  success: true,
                  randomColor: randomColor // Always pass the color to ensure both nodes have the same color
                }
              });
              window.dispatchEvent(connectionEvent);
            }
            
            // Save connection line to global storage with the random color
            setActualLineColor(randomColor);
            
            // Calculate the end point from the target element
            const targetElementForPosition = document.querySelector(`[data-element-id="${targetElementId}"]`);
            let endPoint = { x: event.clientX, y: event.clientY };
            
            if (targetElementForPosition) {
              const targetRect = targetElementForPosition.getBoundingClientRect();
              endPoint = {
                x: targetRect.left + targetRect.width / 2,
                y: targetRect.top + targetRect.height / 2
              };
            }
            
            // Update persistent line ref
            persistentLineRef.current = {
              start: centerPoint,
              end: endPoint
            };
            
            if (properties.connectionGroupId) {
              saveGlobalLine(
                properties.connectionGroupId,
                centerPoint,
                endPoint,
                randomColor // Use the generated random color
              );
            }
            
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 2000);
          } else {
            // Invalid connection
            const shakeEvent = new CustomEvent('triggerShake', {
              detail: {
                targetId: targetElementId,
                reason: 'Invalid connection attempt'
              }
            });

            const targetElement = document.querySelector(`[data-element-id="${targetElementId}"]`);
            if (targetElement) {
              targetElement.dispatchEvent(shakeEvent);
            }

            window.dispatchEvent(new CustomEvent('globalShake', {
              detail: {
                targetId: targetElementId,
                reason: 'Invalid connection attempt'
              }
            }));

            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 1500);
          }
        }
      }

      // Reset drawing state
      setIsDrawing(false);
      setIsConnecting(false);
      setDrawStartPos(null);
      setCurrentMousePos(null);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  // Force re-render when persistent line data changes
  const [forceRender, setForceRender] = useState(0);
  
  useEffect(() => {
    if (persistentLineRef.current.start && persistentLineRef.current.end) {
      setForceRender(prev => prev + 1);
    }
  }, [persistentLineRef.current.start, persistentLineRef.current.end]);

  // Load persistent line from global storage on mount and when connectionGroupId changes
  useEffect(() => {
    if (properties.connectionGroupId && isConnected) {
      const globalLine = getGlobalLine(properties.connectionGroupId);
      if (globalLine && globalLine.isConnected) {
        persistentLineRef.current = {
          start: globalLine.start,
          end: globalLine.end
        };
        setActualLineColor(globalLine.color);
        setForceRender(prev => prev + 1); // Force re-render
      } else if (pairedNode) {
        // Fallback: calculate line coordinates from current node positions
        const currentRect = nodeRef.current?.getBoundingClientRect();
        const pairedNodeElement = document.querySelector(`[data-element-id="${pairedNode.id}"]`);
        const pairedRect = pairedNodeElement?.getBoundingClientRect();
        
        if (currentRect && pairedRect) {
          const currentCenter = {
            x: currentRect.left + currentRect.width / 2,
            y: currentRect.top + currentRect.height / 2
          };
          const pairedCenter = {
            x: pairedRect.left + pairedRect.width / 2,
            y: pairedRect.top + pairedRect.height / 2
          };
          
          persistentLineRef.current = {
            start: currentCenter,
            end: pairedCenter
          };
          
          setForceRender(prev => prev + 1); // Force re-render
          
          // Use the existing line color from the connection (already has random color)
          const lineColor = properties.lineColor || '#3b82f6';
            
          setActualLineColor(lineColor);
            
          saveGlobalLine(
            properties.connectionGroupId,
            currentCenter,
            pairedCenter,
            lineColor
          );
        }
      }
    }
  }, [properties.connectionGroupId, isConnected, pairedNode]);

  // Helper function to generate random bright colors
  const generateRandomColor = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#ee5a24', '#10ac84',
      '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#0984e3',
      '#a29bfe', '#fd79a8', '#e84393', '#00b894', '#00cec9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Reset connection
  const handleReset = () => {
    if (isPreviewMode) return;
    
    onUpdate?.({
      connectionState: 'disconnected',
      connectedNodeId: undefined
    });
    
    // Clear from global storage
    if (properties.connectionGroupId) {
      clearGlobalLine(properties.connectionGroupId);
    }
    
    // Reset local state
    setActualLineColor(null);
    persistentLineRef.current = { start: null, end: null };
  };

  try {
    return (
      <>
        <div
          ref={nodeRef}
          data-element-id={element.id}
          data-connection-group={properties.connectionGroupId}
          data-node-type={isImageContent ? 'image' : 'text'}
          data-image-container={isImageContent ? 'true' : 'false'}
          draggable={false}
          style={{
            ...getNodeStyles(),
            // Force absolute positioning for image container to bypass all padding
            ...(isImageContent && {
              position: 'relative',
              overflow: 'hidden',
              padding: '0px',
              margin: '0px'
            })
          }}
          className={`${isImageContent ? '' : (properties.customClasses || '')} ${isDrawing ? 'connection-source' : ''}`}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsMouseDown(true);
          }}
          onMouseUp={() => {
            setIsMouseDown(false);
          }}
          onClick={(e) => {
            // Allow normal selection - don't start connection on regular click
            // Connection will be started via drag on the text content
          }}
          onMouseEnter={() => {
            if (properties.enableHoverEffects) {
              setIsHovered(true);
            }
          }}
          onMouseLeave={(e) => {
            if (properties.enableHoverEffects) {
              setIsHovered(false);
            }
            // Only start drawing if mouse was pressed down AND user is holding Ctrl/Cmd
            if (isMouseDown && (e.ctrlKey || e.metaKey)) {
              handleMouseLeave(e);
            }
            setIsMouseDown(false);
          }}
          onKeyDown={(e) => {
            // Allow Ctrl+Click to start connection
            if (e.ctrlKey || e.metaKey) {
            }
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            // Double-click to start connection (alternative to button)
            if (!isPreviewMode && !isConnected && !isDrawing) {
              handleMouseLeave(e);
            }
          }}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          {/* Main Content - Text or Image */}
          {properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl) ? (
            <img
              src={properties.imageSrc || properties.imageUrl}
              alt={properties.imageAlt || 'Connection image'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: properties.imageObjectFit || 'cover',
                objectPosition: 'center',
                borderRadius: 'inherit',
                boxSizing: 'border-box',
                // Ensure the image doesn't exceed container bounds
                maxWidth: '100%',
                maxHeight: '100%',
                // Enhanced image opacity with transparency controls and connection state
                opacity: (() => {
                  // Connection state transparency overrides
                  if (isConnected && properties.connectedTransparency !== undefined) {
                    return properties.connectedTransparency / 100;
                  }
                  if (isSelected && properties.selectedTransparency !== undefined) {
                    return properties.selectedTransparency / 100;
                  }
                  if (isConnecting && properties.connectingTransparency !== undefined) {
                    return properties.connectingTransparency / 100;
                  }
                  // Base transparency controls
                  if (properties.enableTransparency) {
                    return (properties.transparencyLevel || 0) / 100;
                  }
                  // Default image opacity
                  return properties.imageOpacity || 1;
                })(),
                // Visibility control for complete transparency
                visibility: (
                  (isConnected && properties.hideOnConnectedTransparency) ||
                  (isSelected && properties.hideOnSelectedTransparency) ||
                  (isConnecting && properties.hideOnConnectingTransparency) ||
                  (properties.enableTransparency && properties.hideOnTransparency)
                ) ? 'hidden' : 'visible',
                display: 'block'
              }}
            />
          ) : (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  background: 'none', // Remove debug background
                  color: properties.textColor || '#ffffff',
                  fontFamily: properties.fontFamily || 'inherit',
                  fontSize: properties.fontSize || '14px',
                  fontWeight: properties.fontWeight || '500',
                  textAlign: properties.textAlign || 'center',
                  padding: 0,
                  ...(properties.verticalAlign === 'top' && { top: 0, bottom: 'auto', transform: 'none' }),
                  ...(properties.verticalAlign === 'center' && { top: '50%', bottom: 'auto', transform: 'translateY(-50%)' }),
                  ...(properties.verticalAlign === 'bottom' && { top: 'auto', bottom: 0, transform: 'none' }),
                  textShadow: properties.enableTextShadow ?
                    `${properties.textShadowX || '1px'} ${properties.textShadowY || '1px'} ${properties.textShadowColor || '#000000'}` :
                    'none',
                  opacity: (() => {
                    if (isConnected && properties.connectedTransparency !== undefined) {
                      return properties.connectedTransparency / 100;
                    }
                    if (isSelected && properties.selectedTransparency !== undefined) {
                      return properties.selectedTransparency / 100;
                    }
                    if (isConnecting && properties.connectingTransparency !== undefined) {
                      return properties.connectingTransparency / 100;
                    }
                    if (properties.enableTransparency) {
                      return (properties.transparencyLevel || 0) / 100;
                    }
                    return properties.textOpacity || 1;
                  })(),
                  visibility: (
                    (isConnected && properties.hideOnConnectedTransparency) ||
                    (isSelected && properties.hideOnSelectedTransparency) ||
                    (isConnecting && properties.hideOnConnectingTransparency) ||
                    (properties.enableTransparency && properties.hideOnTransparency)
                  ) ? 'hidden' : 'visible',
                  cursor: isPreviewMode || isConnected ? 'default' : 'grab',
                  userSelect: 'none',
                  transition: 'cursor 0.2s ease'
                }}
                onMouseDown={(e) => {
                  if (isPreviewMode || isConnected || properties.enableConnectionDrawing === false) return;
                  e.stopPropagation();
                  const nodeElement = nodeRef.current;
                  if (!nodeElement) return;
                  const rect = nodeElement.getBoundingClientRect();
                  const centerPoint = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    direction: 'center' as const
                  };
                  setIsDrawing(true);
                  setIsConnecting(true);
                  setDrawStartPos(centerPoint);
                  setCurrentMousePos({ x: e.clientX, y: e.clientY });
                  const handleGlobalMouseMove = (event: MouseEvent) => {
                    setCurrentMousePos({ x: event.clientX, y: event.clientY });
                  };
                  const handleGlobalMouseUp = (event: MouseEvent) => {
                    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
                    const targetNodeElement = targetElement?.closest('[data-node-type]');

                    if (targetNodeElement) {
                      const targetElementId = targetNodeElement.getAttribute('data-element-id');
                      const targetNodeType = targetNodeElement.getAttribute('data-node-type');
                      const targetConnectionGroup = targetNodeElement.getAttribute('data-connection-group');

                      if (targetElementId && targetElementId !== element.id && 
                          (targetNodeType === 'text' || targetNodeType === 'image')) {
                        const sourceConnectionGroup = properties.connectionGroupId;

                        if ((sourceConnectionGroup && targetConnectionGroup && 
                             sourceConnectionGroup === targetConnectionGroup) ||
                            (!sourceConnectionGroup && !targetConnectionGroup)) {
                          // Valid connection - always generate a random color for every new connection
                          const randomColor = generateRandomLineColor();
                          
                          // Update this node's connection state with random color
                          onUpdate?.({
                            connectionState: 'connected',
                            connectedNodeId: targetElementId,
                            lineColor: randomColor
                          });
                          
                          // Update the target node's connection state with the same color
                          const targetElementForEvent = document.querySelector(`[data-element-id="${targetElementId}"]`);
                          if (targetElementForEvent) {
                            const connectionEvent = new CustomEvent('connectionAttempt', {
                              detail: {
                                sourceId: element.id,
                                targetId: targetElementId,
                                success: true,
                                randomColor: randomColor // Pass the same color to target
                              }
                            });
                            window.dispatchEvent(connectionEvent);
                          }
                          
                          // Save connection line to global storage with random color
                          setActualLineColor(randomColor);
                          
                          // Calculate the end point from the target element
                          const targetElementForPosition = document.querySelector(`[data-element-id="${targetElementId}"]`);
                          let endPoint = { x: event.clientX, y: event.clientY };
                          
                          if (targetElementForPosition) {
                            const targetRect = targetElementForPosition.getBoundingClientRect();
                            endPoint = {
                              x: targetRect.left + targetRect.width / 2,
                              y: targetRect.top + targetRect.height / 2
                            };
                          }
                          
                          // Update persistent line ref
                          persistentLineRef.current = {
                            start: centerPoint,
                            end: endPoint
                          };
                          
                          if (properties.connectionGroupId) {
                            saveGlobalLine(
                              properties.connectionGroupId,
                              centerPoint,
                              endPoint,
                              randomColor // Use the generated random color
                            );
                          }
                          
                          setShowFeedback(true);
                          setTimeout(() => setShowFeedback(false), 2000);
                        } else {
                          // Invalid connection
                          const shakeEvent = new CustomEvent('triggerShake', {
                            detail: {
                              targetId: targetElementId,
                              reason: 'Invalid connection attempt'
                            }
                          });

                          const targetElement = document.querySelector(`[data-element-id="${targetElementId}"]`);
                          if (targetElement) {
                            targetElement.dispatchEvent(shakeEvent);
                          }

                          window.dispatchEvent(new CustomEvent('globalShake', {
                            detail: {
                              targetId: targetElementId,
                              reason: 'Invalid connection attempt'
                            }
                          }));

                          setShowFeedback(true);
                          setTimeout(() => setShowFeedback(false), 1500);
                        }
                      }
                    }

                    // Reset drawing state
                    setIsDrawing(false);
                    setIsConnecting(false);
                    setDrawStartPos(null);
                    setCurrentMousePos(null);
                    document.removeEventListener('mousemove', handleGlobalMouseMove);
                    document.removeEventListener('mouseup', handleGlobalMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleGlobalMouseMove);
                  document.addEventListener('mouseup', handleGlobalMouseUp);
                }}
                onMouseEnter={(e) => {
                  if (!isPreviewMode && !isConnected && properties.enableConnectionDrawing !== false) {
                    e.currentTarget.style.cursor = 'grab';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPreviewMode && !isConnected && properties.enableConnectionDrawing !== false) {
                    e.currentTarget.style.cursor = 'default';
                  }
                }}
              >
                {(properties.showText !== false) && (properties.text || 'Conectar')}
              </div>
            </>
          )}
        </div>

        {/* Help Tooltip - shows on hover when not connected */}
        {!isConnected && !isPreviewMode && (
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            opacity: 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
            zIndex: 1000
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          >
            Click and drag to connect
          </div>
        )}

        {/* Drawing SVG - Temporary line while dragging */}
        {isDrawing && drawStartPos && currentMousePos && createPortal(
          <svg
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            {/* Temporary line */}
            <line
              x1={drawStartPos.x}
              y1={drawStartPos.y}
              x2={currentMousePos.x}
              y2={currentMousePos.y}
              stroke={properties.lineColor || '#3b82f6'}
              strokeWidth={properties.lineWidth || 2}
              strokeDasharray={properties.lineStyle === 'dashed' ? '5,5' : 
                              properties.lineStyle === 'dotted' ? '2,2' : 'none'}
              opacity={properties.lineOpacity || 1}
            />
            
            {/* Connection points */}
            {properties.showConnectionPoints && (
              <>
                <circle
                  cx={drawStartPos.x}
                  cy={drawStartPos.y}
                  r={properties.connectionPointSize || 8}
                  fill={properties.connectionPointColor || properties.lineColor || '#3b82f6'}
                />
                <circle
                  cx={currentMousePos.x}
                  cy={currentMousePos.y}
                  r={properties.connectionPointSize || 8}
                  fill={properties.connectionPointColor || properties.lineColor || '#3b82f6'}
                />
              </>
            )}
          </svg>,
          document.body
        )}

        {/* Persistent connection line */}
        {(() => {
          const shouldRender = isConnected && persistentLineRef.current.start && persistentLineRef.current.end;
          return shouldRender;
        })() && createPortal(
          <svg
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            {/* Persistent line */}
            <line
              x1={persistentLineRef.current.start?.x || 0}
              y1={persistentLineRef.current.start?.y || 0}
              x2={persistentLineRef.current.end?.x || 0}
              y2={persistentLineRef.current.end?.y || 0}
              stroke={actualLineColor || properties.lineColor || '#3b82f6'}
              strokeWidth={properties.lineWidth || 2}
              strokeDasharray={properties.lineStyle === 'dashed' ? '5,5' : 
                              properties.lineStyle === 'dotted' ? '2,2' : 'none'}
              opacity={properties.lineOpacity || 1}
            />
            
            {/* Persistent connection points */}
            {properties.showConnectionPoints && persistentLineRef.current.start && persistentLineRef.current.end && (
              <>
                <circle
                  cx={persistentLineRef.current.start.x}
                  cy={persistentLineRef.current.start.y}
                  r={properties.connectionPointSize || 8}
                  fill={properties.connectionPointColor || actualLineColor || properties.lineColor || '#3b82f6'}
                />
                <circle
                  cx={persistentLineRef.current.end.x}
                  cy={persistentLineRef.current.end.y}
                  r={properties.connectionPointSize || 8}
                  fill={properties.connectionPointColor || actualLineColor || properties.lineColor || '#3b82f6'}
                />
              </>
            )}
            
            {/* Arrow if enabled */}
            {properties.showArrow && persistentLineRef.current.start && persistentLineRef.current.end && (() => {
              const x1 = persistentLineRef.current.start.x;
              const y1 = persistentLineRef.current.start.y;
              const x2 = persistentLineRef.current.end.x;
              const y2 = persistentLineRef.current.end.y;
              const arrowSize = properties.arrowSize || 10;
              const angle = Math.atan2(y2 - y1, x2 - x1);
              // Arrow points
              const arrowX = x2;
              const arrowY = y2;
              const leftX = x2 - arrowSize * Math.cos(angle - Math.PI / 8);
              const leftY = y2 - arrowSize * Math.sin(angle - Math.PI / 8);
              const rightX = x2 - arrowSize * Math.cos(angle + Math.PI / 8);
              const rightY = y2 - arrowSize * Math.sin(angle + Math.PI / 8);
              return (
                <polygon
                  points={`${arrowX},${arrowY} ${leftX},${leftY} ${rightX},${rightY}`}
                  fill={actualLineColor || properties.lineColor || '#3b82f6'}
                />
              );
            })()}
          </svg>,
          document.body
        )}

        {/* Reset Button */}
        {isConnected && !isPreviewMode && properties.allowRetry !== false && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#6b7280',
              pointerEvents: 'auto' // Re-enable pointer events for buttons
            }}
          >
            <X size={12} />
          </button>
        )}

        {/* Custom CSS Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Force zero padding for image containers */
            [data-image-container="true"] {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            [data-image-container="true"] > div {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* TARGET THE CULPRIT: Resizable container override */
            .resizable-container [data-image-container="true"] {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            .resizable-container .connection-node {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* AGGRESSIVE: Override resizable container itself when it has image children */
            .resizable-container:has([data-image-container="true"]) {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* NUCLEAR: Force all resizable containers with images to have zero padding */
            .resizable-container.container {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* Target by element attribute combination */
            div.resizable-container.container [data-node-type="image"] {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* Override any potential box model issues */
            .resizable-container * {
              box-sizing: border-box !important;
            }
            
            /* Negative margin approach to counteract padding */
            .resizable-container [data-image-container="true"] {
              margin: -16px !important;
              padding: 0 !important;
              width: calc(100% + 32px) !important;
              height: calc(100% + 32px) !important;
              position: absolute !important;
              top: -16px !important;
              left: -16px !important;
            }
            
            /* Even more specific - target by data attributes */
            div[data-node-type="image"][data-image-container="true"] {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* Target all children */
            [data-image-container="true"] * {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
            }
            
            .slider::-moz-range-thumb {
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: none;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            .animated-gradient {
              background-size: 200% 200%;
              animation: gradientShift 3s ease infinite;
            }
          `
        }} />
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
