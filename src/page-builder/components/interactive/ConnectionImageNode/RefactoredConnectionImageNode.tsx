import React, { useRef, useEffect } from 'react';
import type { Element } from '../../../types';
import { useBuilder } from '../../../hooks/useBuilder';
import { useConnectionState } from './hooks/useConnectionState';
import { ImageContent, TextIconContent, ConnectionControls, ConnectionStyles } from './components';
import { hasImageContent, clearGlobalLine } from './utils';

interface ConnectionImageNodeProps {
  element: Element;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const RefactoredConnectionImageNode: React.FC<ConnectionImageNodeProps> = ({
  element,
  isPreviewMode = false,
  onUpdate,
}) => {
  const { elements, removeElement } = useBuilder();
  const properties = element.properties as any;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const {
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
    pairedNode,
    isConnected
  } = useConnectionState({ element, elements, onUpdate });

  // AGGRESSIVE PADDING REMOVAL: Force remove padding for image content using direct DOM manipulation
  useEffect(() => {
    const hasImage = hasImageContent(properties);
    
    if (hasImage && nodeRef.current) {
      
      // Force remove padding with maximum specificity
      const nodeElement = nodeRef.current;
      nodeElement.style.setProperty('padding', '0px', 'important');
      nodeElement.style.setProperty('padding-top', '0px', 'important');
      nodeElement.style.setProperty('padding-right', '0px', 'important');
      nodeElement.style.setProperty('padding-bottom', '0px', 'important');
      nodeElement.style.setProperty('padding-left', '0px', 'important');
      
      // Also check parent elements for padding
      let parent = nodeElement.parentElement;
      let level = 0;
      while (parent && level < 3) {
        if (parent.classList.contains('widget-resizable') || 
            parent.classList.contains('element-wrapper') ||
            parent.classList.contains('resizable-container')) {
          parent.style.setProperty('padding', '0px', 'important');
          parent.style.setProperty('padding-top', '0px', 'important');
          parent.style.setProperty('padding-right', '0px', 'important');
          parent.style.setProperty('padding-bottom', '0px', 'important');
          parent.style.setProperty('padding-left', '0px', 'important');
        }
        parent = parent.parentElement;
        level++;
      }
    }
  }, [properties, element.id]);

  const getNodeStyles = (): React.CSSProperties => {
    const props = properties;
    
    // Build box shadow if enabled
    let boxShadow = 'none';
    if (props.enableBoxShadow) {
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

    // Build padding from individual values
    const paddingTop = props.paddingTop || '8px';
    const paddingRight = props.paddingRight || '12px';
    const paddingBottom = props.paddingBottom || '8px';
    const paddingLeft = props.paddingLeft || '12px';
    const padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;

    // Build margin from individual values
    const marginTop = props.marginTop || '0px';
    const marginRight = props.marginRight || '0px';
    const marginBottom = props.marginBottom || '0px';
    const marginLeft = props.marginLeft || '0px';
    const margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;
    
    const baseStyles: React.CSSProperties = {
      // Basic layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
      // Size and constraints
      width: props.width || '120px',
      height: props.height || '40px',
      minWidth: props.minWidth || '100px',
      maxWidth: props.maxWidth || 'none',
      minHeight: props.minHeight || '35px',
      maxHeight: props.maxHeight || 'none',
      
      // Spacing
      padding,
      margin,
      
      // Typography
      fontFamily: props.fontFamily || 'inherit',
      fontSize: props.fontSize || '14px',
      fontWeight: props.fontWeight || '500',
      textAlign: props.textAlign || 'center',
      color: props.textColor || '#ffffff',
      textShadow,
      
      // Border
      borderWidth: `${props.borderWidth || 0}px`,
      borderStyle: 'solid',
      borderColor: props.borderColor || '#e2e8f0',
      borderRadius: props.borderRadius || '8px',
      
      // Background and effects
      backgroundColor: props.backgroundColor || '#3b82f6',
      boxShadow,
      opacity: props.opacity || 1,
      
      // Interaction and behavior
      userSelect: 'none',
      position: 'relative',
      cursor: 'pointer',
      
      // Transitions and Transform
      transition: props.enableHoverEffects 
        ? `all ${props.transitionDuration || '0.2s'} ease`
        : 'all 0.3s ease',
      transform: props.enableHoverEffects && props.hoverScale
        ? `scale(${props.hoverScale})`
        : 'none',
    };

    // State-specific modifications
    if (isConnected) {
      const connectedStyles = {
        ...baseStyles,
        transform: props.connectedTransform || 'scale(1.02)',
        color: props.connectedTextColor || '#22c55e',
        borderColor: props.connectedBorderColor || '#22c55e',
        backgroundColor: props.connectedBackgroundColor || baseStyles.backgroundColor,
        boxShadow: props.enableConnectedBoxShadow === false ? 'none' : (props.connectedBoxShadow || '0 4px 12px rgba(34, 197, 94, 0.2)'),
      };

      // Only apply pulse animation if enabled
      if (props.enablePulseOnConnect === true) {
        connectedStyles.animation = 'pulse 2s infinite';
      }

      return connectedStyles;
    }

    if (isTargeted) {
      const targetedStyles = {
        ...baseStyles,
        transform: props.targetedTransform || 'scale(1.05)',
        color: props.targetedTextColor || '#f59e0b',
        borderColor: props.targetedBorderColor || '#f59e0b',
        backgroundColor: props.targetedBackgroundColor || baseStyles.backgroundColor,
        boxShadow: props.targetedBoxShadow || '0 4px 12px rgba(245, 158, 11, 0.3)',
        animation: props.targetedAnimation || 'targetPulse 1s ease-in-out',
      };

      return targetedStyles;
    }

    if (isShaking) {
      return {
        ...baseStyles,
        animation: 'shake 0.5s ease-in-out',
      };
    }

    return baseStyles;
  };

  const handleReset = () => {
    
    // Clear connection state
    const resetUpdates = {
      connectionState: 'disconnected' as const,
      connectedNodeId: undefined
    };
    
    onUpdate?.(resetUpdates);
    
    // Clear global line
    if (properties.connectionGroupId) {
      clearGlobalLine(properties.connectionGroupId);
    }
    
    // Reset local state
    setIsTargeted(false);
    setFeedbackType(null);
    setShowFeedback(false);
  };

  const handleConnectionAttempt = (e: React.MouseEvent) => {
    if (isPreviewMode || isConnected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    
    // Set targeted state
    setIsTargeted(true);
    setTargetFeedbackColor('#f59e0b');
    
    // Dispatch connection attempt event
    const connectionAttemptEvent = new CustomEvent('connectionAttempt', {
      detail: {
        sourceId: element.id,
        targetId: pairedNode?.id,
        success: false,
        randomColor: null
      }
    });
    
    window.dispatchEvent(connectionAttemptEvent);
    
    // Reset targeted state after delay
    setTimeout(() => {
      setIsTargeted(false);
    }, 2000);
  };

  return (
    <>
      <div
        ref={nodeRef}
        data-element-id={element.id}
        data-connection-group={properties.connectionGroupId}
        data-node-type="image"
        data-no-drag="true"
        draggable={false}
        className={`image-node${isConnected && properties.enablePulseOnConnect === true ? ' connected' : ''}`}
        style={getNodeStyles()}
        onMouseDown={(e) => {
          // Prevent drag from starting on the body
          e.stopPropagation();
        }}
        onClick={handleConnectionAttempt}
        onDragStart={(e) => {
          // Prevent any drag operations on the body
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        {/* Main Content - Image or Text */}
        {hasImageContent(properties) ? (
          <ImageContent
            properties={properties}
            isConnected={isConnected}
            isTargeted={isTargeted}
          />
        ) : (
          <TextIconContent
            properties={properties}
            isConnected={isConnected}
            isTargeted={isTargeted}
            feedbackType={feedbackType}
          />
        )}

        {/* Connection Controls */}
        <ConnectionControls
          isConnected={isConnected}
          isPreviewMode={isPreviewMode}
          allowRetry={properties.allowRetry}
          onReset={handleReset}
          element={element}
          elements={elements}
          properties={properties}
        />
      </div>

      {/* Connection Styles */}
      <ConnectionStyles />
    </>
  );
}; 