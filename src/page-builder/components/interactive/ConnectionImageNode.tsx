import React, { useState, useRef, useEffect } from 'react';
import { Target, Check, X } from 'lucide-react';
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

// Global storage functions for clearing connection lines
const clearGlobalLine = (elementId: string) => {
  if (typeof window !== 'undefined' && window.globalConnectionLines) {
    window.globalConnectionLines.delete(elementId);
  }
};

interface ConnectionImageNodeProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const ConnectionImageNode: React.FC<ConnectionImageNodeProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate
}) => {
  const { elements, removeElement } = useBuilder();
  const properties = element.properties;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isTargeted, setIsTargeted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [targetFeedbackColor, setTargetFeedbackColor] = useState<string>('#22c55e');
  const [isShaking, setIsShaking] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  // Safe property access with fallbacks
  const connectionState = (properties as any).connectionState || 'disconnected';
  const isConnected = connectionState === 'connected';
  const connectedNodeId = (properties as any).connectedNodeId;
  
  // Debug connection state
  useEffect(() => {
    // console.log('🖼️ ConnectionImageNode connection state:', {
    //   elementId: element.id,
    //   connectionState: (properties as any).connectionState,
    //   connectedNodeId: (properties as any).connectedNodeId,
    //   connectionGroupId: (properties as any).connectionGroupId,
    //   isConnected,
    //   isTargeted
    // });
  }, [element.id, (properties as any).connectionState, (properties as any).connectedNodeId, (properties as any).connectionGroupId, isConnected, isTargeted]);

  // Debug image properties
  useEffect(() => {
    const imageUrl = (properties as any).imageUrl;
    const imageSrc = (properties as any).imageSrc;
    if (imageUrl || imageSrc) {
      // console.log('🖼️ ConnectionImageNode render - Image properties:', {
      //   imageUrl,
      //   imageSrc,
      //   contentType: (properties as any).contentType,
      //   elementId: element.id
      // });
    }
  }, [(properties as any).imageUrl, (properties as any).imageSrc, (properties as any).contentType]);

  // AGGRESSIVE PADDING REMOVAL: Force remove padding for image content using direct DOM manipulation
  useEffect(() => {
    const hasImageContent = (properties as any).imageUrl || (properties as any).imageSrc;
    
    if (hasImageContent && nodeRef.current) {
      console.log('🔥 FORCING padding removal for image content:', element.id);
      
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
          console.log(`🔥 Removing padding from parent level ${level}:`, parent.className);
          parent.style.setProperty('padding', '0px', 'important');
        }
        parent = parent.parentElement;
        level++;
      }
      
      // Force refresh after a short delay to handle any async CSS loading
      setTimeout(() => {
        if (nodeRef.current) {
          nodeRef.current.style.setProperty('padding', '0px', 'important');
        }
      }, 100);
    }
  }, [(properties as any).imageUrl, (properties as any).imageSrc, element.id]);

  // Cleanup effect - handles deletion of paired node when this node is deleted
  useEffect(() => {
    let isUnmounting = false;
    
    return () => {
      // Set flag to indicate this is an unmount (deletion)
      isUnmounting = true;
      
      // Only run cleanup after a delay to ensure it's actually deletion, not just re-render
      setTimeout(() => {
        if (isUnmounting) {
          const connectionGroupId = (properties as any).connectionGroupId;
          
          if (connectionGroupId) {
            // Check if this element still exists in the DOM
            const elementStillExists = document.querySelector(`[data-element-id="${element.id}"]`);
            
            if (!elementStillExists) {
              // console.log('🗑️ ConnectionImageNode being deleted, cleaning up paired node');
              
              // Find the paired text node
              const pairedNode = elements.find(el => 
                el.id !== element.id && 
                el.type === 'connection-text-node' &&
                (el.properties as any).connectionGroupId === connectionGroupId
              );
              
              if (pairedNode) {
                // console.log('🔍 Found paired text node to delete:', pairedNode.id);
                
                // Delete the paired node
                removeElement(pairedNode.id);
              }
              
              // Clear from global storage for both nodes
              // console.log('🧹 Clearing connection data for image node:', element.id);
              clearGlobalLine(element.id);
              if (pairedNode) {
                clearGlobalLine(pairedNode.id);
              }
            } else {
              // console.log('🔄 ConnectionImageNode still exists, skipping cleanup');
            }
          }
        }
      }, 100); // Small delay to distinguish between re-render and actual deletion
    };
  }, [element.id]); // Only depend on element ID

  // Listen for shake events from ConnectionTextNode
  useEffect(() => {
    const handleShakeEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      // console.log('📳 ConnectionImageNode received shake event:', customEvent.detail);
      
      // Trigger shake animation and error feedback
      setIsShaking(true);
      setShowFeedback(true);
      setFeedbackType('error');
      setTargetFeedbackColor('#ef4444');
      
      // console.log('📳 Shake animation triggered on image node:', element.id);
      
      setTimeout(() => {
        setIsShaking(false);
        setShowFeedback(false);
        setFeedbackType(null);
        // console.log('📳 Shake animation ended on image node:', element.id);
      }, 600);
    };

    const handleGlobalShakeEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      // console.log('📳 ConnectionImageNode received GLOBAL shake event:', customEvent.detail);
      
      // Check if this event is for this element
      if (customEvent.detail.targetId === element.id) {
        // console.log('📳 Global shake event is for this element:', element.id);
        handleShakeEvent(event);
      } else {
        // console.log('📳 Global shake event is for different element:', customEvent.detail.targetId, 'vs', element.id);
      }
    };

    const nodeElement = nodeRef.current;
    if (nodeElement) {
      // console.log('📳 Adding shake event listener to image node:', element.id);
      nodeElement.addEventListener('triggerShake', handleShakeEvent);
      
      // Also listen for global events
      window.addEventListener('globalShake', handleGlobalShakeEvent);
      
      return () => {
        // console.log('📳 Removing shake event listener from image node:', element.id);
        nodeElement.removeEventListener('triggerShake', handleShakeEvent);
        window.removeEventListener('globalShake', handleGlobalShakeEvent);
      };
    } else {
      // console.log('📳 NodeRef not available for image node:', element.id);
      // Still listen for global events even if nodeRef isn't ready
      window.addEventListener('globalShake', handleGlobalShakeEvent);
      
      return () => {
        window.removeEventListener('globalShake', handleGlobalShakeEvent);
      };
    }
  }, [element.id]);

  // TEMPORARY: Add a global test function for direct shake testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testShakeAnimation = (elementId?: string) => {
        const targetId = elementId || element.id;
        // console.log('🧪 MANUAL TEST: Triggering shake animation for:', targetId);
        
        if (targetId === element.id) {
          setIsShaking(true);
          setShowFeedback(true);
          setFeedbackType('error');
          setTargetFeedbackColor('#ef4444');
          
          setTimeout(() => {
            setIsShaking(false);
            setShowFeedback(false);
            setFeedbackType(null);
          }, 600);
        }
      };
    }
  }, [element.id]);

  // Handle being clicked as a connection target
  const handleConnectionAttempt = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only handle connection attempts in builder mode when not already connected
    if (!isPreviewMode && !isConnected) {
      // Find the source node that's connecting
      const sourceNode = document.querySelector('.connection-source');
      const sourceElementId = sourceNode?.getAttribute('data-element-id');
      
      if (sourceNode && sourceElementId) {
        // Check connection group compatibility
        const sourceGroupId = sourceNode.getAttribute('data-connection-group');
        const targetGroupId = nodeRef.current?.getAttribute('data-connection-group');
        
        // console.log('🎯 ConnectionImageNode: Connection attempt', {
        //   sourceId: sourceElementId,
        //   targetId: element.id,
        //   sourceGroup: sourceGroupId,
        //   targetGroup: targetGroupId
        // });
        
        // Case 1: Both nodes have the same connection group (pre-paired)
        const isPrePaired = sourceGroupId && targetGroupId && sourceGroupId === targetGroupId;
        // Case 2: Neither node has a connection group (new pairing)
        const isNewPairing = !sourceGroupId && !targetGroupId;
        
        if (isPrePaired || isNewPairing) {
          // Successful connection
          // console.log('✅ Valid connection:', isPrePaired ? 'pre-paired' : 'new pairing');
          setShowFeedback(true);
          setFeedbackType('success');
          setTargetFeedbackColor('#22c55e'); // Green for success
          
          // Always generate a random color for every connection pair
          const randomColor = generateRandomLineColor();
          
          let connectionUpdates: any = {
            connectionState: 'connected',
            connectedNodeId: sourceElementId,
            lineColor: randomColor // Always apply random color
          };
          
          console.log(`🎨 Generated random color for connection pair: ${randomColor}`);
          
          onUpdate?.(connectionUpdates);

          // Notify the source node with the same color
          const connectionEvent = new CustomEvent('connectionAttempt', {
            detail: {
              sourceId: sourceElementId,
              targetId: element.id,
              success: true,
              randomColor: randomColor // Always pass the color to ensure both nodes have the same color
            }
          });
          window.dispatchEvent(connectionEvent);

          setTimeout(() => {
            setShowFeedback(false);
            setFeedbackType(null);
          }, 2000);
        } else {
          // Failed connection - incompatible groups
          // console.log('❌ Invalid connection: Group mismatch or partial pairing');
          
          // Trigger shake animation and error feedback
          setIsShaking(true);
          setShowFeedback(true);
          setFeedbackType('error');
          setTargetFeedbackColor('#ef4444'); // Red for error
          
          setTimeout(() => {
            setIsShaking(false);
            setShowFeedback(false);
            setFeedbackType(null);
          }, 600); // Match AreaTrueFalseWidget shake duration
          
          const connectionEvent = new CustomEvent('connectionAttempt', {
            detail: {
              sourceId: sourceElementId,
              targetId: element.id,
              success: false,
              reason: 'Group mismatch or partial pairing'
            }
          });
          window.dispatchEvent(connectionEvent);
        }
      }
    }
  };

  // Reset connection
  const handleReset = () => {
    if (isPreviewMode) return;
    
    onUpdate?.({
      connectionState: 'disconnected',
      connectedNodeId: undefined
    });
  };

  // Listen for connection state changes
  useEffect(() => {
    const handleConnectionStateChange = () => {
      // Check if there's a source node connecting
      const hasSourceNode = document.querySelector('.connection-source');
      const myGroupId = nodeRef.current?.getAttribute('data-connection-group');
      const sourceGroupId = hasSourceNode?.getAttribute('data-connection-group');
      
      setIsTargeted(Boolean(hasSourceNode && myGroupId === sourceGroupId && !isConnected));
    };

    const handleForceConnect = (event: CustomEvent) => {
      const { sourceId, targetId } = event.detail;
      if (targetId === element.id) {
        // console.log('🎯 Force connecting image node:', element.id);
        onUpdate?.({
          connectionState: 'connected',
          connectedNodeId: sourceId
        });
      }
    };

    const handleTargetFeedback = (event: CustomEvent) => {
      const { targetId, sourceId, color } = event.detail;
      if (targetId === element.id) {
        // console.log('🎉 Showing target feedback for:', element.id, 'with color:', color);
        setTargetFeedbackColor(color || '#22c55e');
        setShowFeedback(true);
        
        // Also update the connection state
        onUpdate?.({
          connectionState: 'connected',
          connectedNodeId: sourceId
        });
        
        setTimeout(() => setShowFeedback(false), 2000);
      }
    };

    const handleConnectionAttempt = (event: CustomEvent) => {
      const { sourceId, targetId, success, showTargetFeedback, randomColor } = event.detail;
      
      if (targetId === element.id && success) {
        // console.log('�� Connection attempt successful for target:', element.id);
        setShowFeedback(true);
        
        let connectionUpdates: any = {
          connectionState: 'connected',
          connectedNodeId: sourceId
        };
        
        // Always apply the random color from the source node
        if (randomColor) {
          connectionUpdates.lineColor = randomColor;
          console.log(`🎨 Applied shared random color to target node: ${randomColor}`);
        }
        
        onUpdate?.(connectionUpdates);
        
        setTimeout(() => setShowFeedback(false), 2000);
      }
    };

    // Listen for DOM changes to detect connection state
    const observer = new MutationObserver(handleConnectionStateChange);
    
    if (nodeRef.current) {
      observer.observe(document.body, { 
        attributes: true, 
        subtree: true, 
        attributeFilter: ['class'] 
      });
    }

    // Listen for custom events
    window.addEventListener('forceConnect', handleForceConnect as EventListener);
    window.addEventListener('showTargetFeedback', handleTargetFeedback as EventListener);
    window.addEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('forceConnect', handleForceConnect as EventListener);
      window.removeEventListener('showTargetFeedback', handleTargetFeedback as EventListener);
      window.removeEventListener('connectionAttempt', handleConnectionAttempt as EventListener);
    };
  }, [element.id, isConnected]);

  // Force zero padding for image content using direct DOM manipulation
  useEffect(() => {
    if (nodeRef.current && ((properties as any).contentType === 'image' || (properties as any).imageUrl)) {
      // Force zero padding for image content to override any CSS
      nodeRef.current.style.setProperty('padding', '0px', 'important');
      nodeRef.current.style.setProperty('margin', '0px', 'important');
      
      console.log('🔧 Force-applied zero padding to image node:', {
        elementId: element.id,
        nodeRefExists: !!nodeRef.current,
        appliedPadding: nodeRef.current.style.padding
      });
    }
  }, [(properties as any).contentType, (properties as any).imageUrl, element.id]);

  const getNodeStyles = () => {
    const props = properties as any;
    
    // Transparency controls - check for transparency toggle
    const isTransparent = props.enableTransparency === true;
    const transparencyLevel = props.transparencyLevel || 0; // 0-100 scale
    const hideOnTransparency = props.hideOnTransparency === true;
    
    const baseStyles: React.CSSProperties = {
      // Basic layout
      display: 'flex',
      alignItems: props.alignItems || 'center',
      justifyContent: props.justifyContent || 'center',
      flexDirection: props.flexDirection || 'column',
      gap: `${props.gap || 8}px`,
      
      // Size and constraints
      width: props.width ? `${props.width}px` : '120px',
      height: props.height ? `${props.height}px` : '120px',
      minWidth: `${props.minWidth || 60}px`,
      maxWidth: props.maxWidth ? `${props.maxWidth}px` : 'none',
      minHeight: `${props.minHeight || 60}px`,
      maxHeight: props.maxHeight ? `${props.maxHeight}px` : 'none',
      
      // Spacing - FORCE no padding for image content using !important
      padding: ((properties as any).contentType === 'image' || (properties as any).imageUrl) 
        ? '0px !important' // Force no padding for images with !important
        : `${props.padding || 16}px`, // Normal padding for text content
      margin: `${props.margin || 0}px`,
      
      // DEBUG: Log padding decision
      ...((() => {
        const hasImage = (properties as any).contentType === 'image' || (properties as any).imageUrl;
        console.log('🔍 ConnectionImageNode padding debug:', {
          elementId: element.id,
          contentType: (properties as any).contentType,
          imageUrl: (properties as any).imageUrl,
          hasImage,
          paddingApplied: hasImage ? '0px' : `${props.padding || 16}px`
        });
        return {};
      })()),
      
      // Border - remove border for images, keep for text content
      borderWidth: ((properties as any).contentType === 'image' || (properties as any).imageUrl) 
        ? '0px' // No border for images
        : `${props.borderWidth || 3}px`, // Normal border for text
      borderStyle: ((properties as any).contentType === 'image' || (properties as any).imageUrl) 
        ? 'none' // No border style for images
        : (props.borderStyle || 'dashed'), // Dashed border for text
      borderColor: props.borderColor || '#94a3b8',
      borderRadius: `${props.borderRadius || 12}px`,
      
      // Background and effects - conditional based on transparency and result state
      backgroundColor: (() => {
        const resultStyling = getResultStyling();
        
        // Result card background takes priority when feedback is active
        if ((feedbackType === 'success' || isConnected || feedbackType === 'error') && resultStyling.cardBg !== 'transparent') {
          const opacity = resultStyling.cardOpacity / 100;
          const cardColor = resultStyling.cardBg;
          
          // Convert hex to rgba if needed
          if (cardColor.startsWith('#')) {
            const r = parseInt(cardColor.slice(1, 3), 16);
            const g = parseInt(cardColor.slice(3, 5), 16);
            const b = parseInt(cardColor.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
          }
          return cardColor;
        }
        
        // If transparency is enabled, make background transparent unless specifically overridden
        if (isTransparent && !props.overrideTransparentBackground) {
          return 'transparent';
        }
        return props.backgroundColor || '#f8fafc';
      })(),
      boxShadow: (isTransparent && !props.enableTransparentShadow) ? 'none' : (props.boxShadow || '0 2px 8px rgba(148, 163, 184, 0.1)'),
      
      // Enhanced opacity with transparency controls
      opacity: (() => {
        const props = properties as any;
        let baseOpacity = props.opacity ?? 1; // Start with base opacity
        
        // Connection state transparency overrides
        if (isConnected && props.connectedTransparency !== undefined) {
          return (props.connectedTransparency / 100) * baseOpacity;
        }
        if (isTargeted && props.targetedTransparency !== undefined) {
          return (props.targetedTransparency / 100) * baseOpacity;
        }
        // Base transparency controls - only apply if enabled
        if (props.enableTransparency && props.transparencyLevel !== undefined) {
          if (props.hideOnTransparency) return 0; // Completely hidden
          return ((props.transparencyLevel || 0) / 100) * baseOpacity;
        }
        // Default opacity behavior
        return baseOpacity;
      })(),
      // Visibility control for complete transparency
      visibility: (isTransparent && hideOnTransparency) ? 'hidden' as const : 'visible' as const,
      
      // Interaction and behavior
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden', // Hide overflow for absolutely positioned images
      cursor: 'pointer',
      
      // Transitions - disable during targeting to prevent orange effects
      transition: isTargeted ? 'none' : (props.transition || 'all 0.3s ease'),
      transform: isShaking ? 'translateX(-8px)' : (props.transform || 'none'),
      animation: isShaking ? 'shake 0.6s ease-in-out' : undefined,
    };

    // State-specific modifications with transparency controls
    if (isConnected) {
      const resultStyling = getResultStyling();
      return {
        ...baseStyles,
        borderColor: resultStyling.cardBg,
        borderStyle: 'solid',
        boxShadow: (props.connectedTransparency === 0 && props.hideOnConnectedTransparency) ? 'none' : 
                   (props.enableConnectedBoxShadow === false) ? 'none' :
                   (props.connectedBoxShadow || `0 4px 16px ${resultStyling.cardBg}33`),
        backgroundColor: (() => {
          if (props.connectedTransparency !== undefined && !props.overrideTransparentBackground) {
            return 'transparent';
          }
          return resultStyling.cardBg;
        })(),
        transform: props.connectedTransform || 'scale(1.05)',
        opacity: (() => {
          if (props.connectedTransparency !== undefined) {
            if (props.hideOnConnectedTransparency) return 0;
            return props.connectedTransparency / 100;
          }
          return baseStyles.opacity;
        })(),
        visibility: (props.connectedTransparency !== undefined && props.hideOnConnectedTransparency) ? 'hidden' as const : 'visible' as const,
        animation: 'none', // Disable all animations
      };
    }

    if (feedbackType === 'error') {
      const resultStyling = getResultStyling();
      return {
        ...baseStyles,
        borderColor: resultStyling.cardBg,
        borderStyle: 'solid',
        boxShadow: `0 4px 16px ${resultStyling.cardBg}33`,
        backgroundColor: resultStyling.cardBg,
        animation: 'shake 0.6s ease-in-out',
      };
    }

    // Removed targeted state styling to eliminate orange tint and animations
    // if (isTargeted) {
    //   return {
    //     ...baseStyles,
    //     borderColor: props.targetedBorderColor || '#94a3b8',
    //     borderStyle: 'solid',
    //     boxShadow: (props.targetedTransparency === 0 && props.hideOnTargetedTransparency) ? 'none' : (props.targetedBoxShadow || '0 2px 8px rgba(148, 163, 184, 0.1)'),
    //     backgroundColor: (() => {
    //       if (props.targetedTransparency !== undefined && !props.overrideTransparentBackground) {
    //         return 'transparent';
    //       }
    //       return props.targetedBackgroundColor || baseStyles.backgroundColor;
    //     })(),
    //     animation: 'none', // Disable all animations
    //     transition: 'none', // Disable all transitions
    //     transform: 'none', // Disable all transforms
    //     filter: 'none', // Disable all filters
    //     opacity: (() => {
    //       if (props.targetedTransparency !== undefined) {
    //         if (props.hideOnTargetedTransparency) return 0;
    //         return props.targetedTransparency / 100;
    //       }
    //       return baseStyles.opacity;
    //     })(),
    //     visibility: (props.targetedTransparency !== undefined && props.hideOnTargetedTransparency) ? 'hidden' as const : 'visible' as const,
    //   };
    // }

    // Force override any targeted styling to prevent orange tint and animations
    if (isTargeted) {
      return {
        ...baseStyles,
        // Force no visual changes when targeted
        borderColor: baseStyles.borderColor,
        borderStyle: baseStyles.borderStyle,
        boxShadow: baseStyles.boxShadow,
        backgroundColor: baseStyles.backgroundColor,
        animation: 'none !important',
        transition: 'none !important',
        transform: 'none !important',
        filter: 'none !important',
        scale: 'none !important',
      };
    }

    return baseStyles;
  };

  // Helper function to get icon component based on type
  const getIconComponent = (iconType: string, size: number, isSuccess: boolean) => {
    const props = { size };
    
    if (isSuccess) {
      switch (iconType) {
        case 'check': return <Check {...props} />;
        case 'checkCircle': return <div style={{...props, borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>;
        case 'thumbsUp': return <span style={{fontSize: size}}>👍</span>;
        case 'star': return <span style={{fontSize: size}}>⭐</span>;
        case 'heart': return <span style={{fontSize: size}}>❤️</span>;
        default: return <Check {...props} />;
      }
    } else {
      switch (iconType) {
        case 'x': return <X {...props} />;
        case 'xCircle': return <div style={{...props, borderRadius: '50%', border: '2px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✗</div>;
        case 'thumbsDown': return <span style={{fontSize: size}}>👎</span>;
        case 'alertTriangle': return <span style={{fontSize: size}}>⚠️</span>;
        case 'minus': return <span style={{fontSize: size}}>➖</span>;
        default: return <X {...props} />;
      }
    }
  };

  // Helper function to get result styling based on connection state
  const getResultStyling = () => {
    const props = properties as any;
    
    if (feedbackType === 'success' || isConnected) {
      return {
        iconType: props.correctIconType || 'check',
        iconSize: props.correctIconSize || 32,
        iconColor: props.correctIconColor || props.correctColor || '#10b981',
        iconBg: props.correctIconBgTransparent ? 'transparent' : (props.correctIconBg || '#dcfce7'),
        message: props.correctMessage || '¡Correcto!',
        textColor: props.correctColor || '#10b981',
        cardBg: props.correctCardNoBackground ? 'transparent' : props.correctCardBg || '#10b981',
        cardOpacity: props.correctCardOpacity || 10
      };
    } else if (feedbackType === 'error') {
      return {
        iconType: props.incorrectIconType || 'x',
        iconSize: props.incorrectIconSize || 32,
        iconColor: props.incorrectIconColor || props.incorrectColor || '#ef4444',
        iconBg: props.incorrectIconBgTransparent ? 'transparent' : (props.incorrectIconBg || '#fee2e2'),
        message: props.incorrectMessage || 'Incorrecto',
        textColor: props.incorrectColor || '#ef4444',
        cardBg: props.incorrectCardNoBackground ? 'transparent' : props.incorrectCardBg || '#ef4444',
        cardOpacity: props.incorrectCardOpacity || 10
      };
    }
    
    // Default state
    return {
      iconType: 'target',
      iconSize: props.iconSize || 32,
      iconColor: props.iconColor || props.lineColor || '#64748b',
      iconBg: 'transparent',
      message: props.text || 'Drop here!',
      textColor: props.textColor || props.lineColor || '#64748b',
      cardBg: 'transparent',
      cardOpacity: 0
    };
  };

  return (
    <>
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
          
          @keyframes successPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
          
          @keyframes errorPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          
          @keyframes fadeInScale {
            0% { 
              opacity: 0; 
              transform: translateX(-50%) scale(0.8); 
            }
            100% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1); 
            }
          }
          
          @keyframes targetPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          
          .connection-image-success {
            animation: successPulse 0.6s ease-out;
            border: 2px solid #22c55e !important;
            background-color: rgba(34, 197, 94, 0.1) !important;
          }
          
          .connection-image-error {
            animation: errorPulse 0.6s ease-out;
            border: 2px solid #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
          }
        `}
      </style>
      
      <div
        ref={nodeRef}
        data-element-id={element.id}
        data-connection-group={properties.connectionGroupId}
        data-node-type="image"
        data-no-drag="true"
        draggable={false}
        className={`image-node${isConnected && (properties as any).enablePulseOnConnect === true ? ' connected' : ''}`}
        style={getNodeStyles()}
        onMouseDown={(e) => {
          // Prevent drag from starting on the body
          e.stopPropagation();
        }}
        onDragStart={(e) => {
          // Prevent any drag operations on the body
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        {/* Main Content - Image or Text */}
        {(properties as any).contentType === 'image' || (properties as any).imageUrl ? (
          // Use background image approach to avoid padding issues
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url("${(properties as any).imageUrl || (properties as any).imageSrc || '/api/placeholder/100/100'}")`,
              backgroundSize: (properties as any).imageObjectFit || 'cover',
              backgroundPosition: (properties as any).imageObjectPosition || 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '0px',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              // Enhanced opacity with transparency controls and connection state
              opacity: (() => {
                const props = properties as any;
                let baseOpacity = props.imageOpacity ?? 1; // Start with image opacity
                
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
              })(),
              // Visibility control for complete transparency
              visibility: (() => {
                const props = properties as any;
                if (isConnected && props.hideOnConnectedTransparency) return 'hidden';
                if (isTargeted && props.hideOnTargetedTransparency) return 'hidden';
                if (props.enableTransparency && props.hideOnTransparency) return 'hidden';
                return 'visible';
              })(),
              transition: 'all 0.3s ease',
              pointerEvents: 'none',
              // State-specific image effects
              ...(isConnected && {
                filter: (properties as any).connectedImageFilter || (properties as any).imageFilter || 'brightness(1.1)',
                transform: (properties as any).connectedImageTransform || 'scale(1.02)'
              })
              // Removed: isTargeted effects that caused orange tint and animation
            }}
            draggable={false}
          />
        ) : (
          /* Text/Icon Content */
          <div style={{
            display: 'flex',
            flexDirection: (properties as any).contentDirection || 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${(properties as any).contentGap || 8}px`,
            color: isConnected ? 
              ((properties as any).connectedTextColor || '#22c55e') : 
              ((properties as any).textColor || (properties as any).lineColor || '#64748b'),
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            textAlign: 'center' as const,
            // Enhanced text container opacity with transparency controls
            opacity: (() => {
              const props = properties as any;
              // Connection state transparency overrides
              if (isConnected && props.connectedTransparency !== undefined) {
                return props.connectedTransparency / 100;
              }
              if (isTargeted && props.targetedTransparency !== undefined) {
                return props.targetedTransparency / 100;
              }
              // Base transparency controls
              if (props.enableTransparency) {
                return (props.transparencyLevel || 0) / 100;
              }
              // Default opacity
              return 1;
            })(),
            // Visibility control for complete transparency
            visibility: (() => {
              const props = properties as any;
              if (isConnected && props.hideOnConnectedTransparency) return 'hidden';
              if (isTargeted && props.hideOnTargetedTransparency) return 'hidden';
              if (props.enableTransparency && props.hideOnTransparency) return 'hidden';
              return 'visible';
            })(),
          }}>
            {/* Icon */}
            {(properties as any).showIcon !== false && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${getResultStyling().iconSize + 16}px`,
                height: `${getResultStyling().iconSize + 16}px`,
                borderRadius: '50%',
                backgroundColor: getResultStyling().iconBg,
                color: getResultStyling().iconColor,
                fontSize: `${getResultStyling().iconSize}px`,
                transition: 'all 0.3s ease'
              }}>
                {getResultStyling().iconType === 'target' ? (
                  <Target size={getResultStyling().iconSize} />
                ) : (
                  getIconComponent(
                    getResultStyling().iconType, 
                    getResultStyling().iconSize, 
                    feedbackType === 'success' || isConnected
                  )
                )}
              </div>
            )}
            
            {/* Text */}
            {(properties as any).showText !== false && (
              <span style={{
                fontSize: `${(properties as any).fontSize || 12}px`,
                fontWeight: (properties as any).fontWeight || '500',
                fontFamily: (properties as any).fontFamily || 'Poppins, sans-serif',
                fontStyle: (properties as any).fontStyle || 'normal',
                textDecoration: (properties as any).textDecoration || 'none',
                textTransform: (properties as any).textTransform || 'none',
                letterSpacing: (properties as any).letterSpacing ? `${(properties as any).letterSpacing}px` : 'normal',
                lineHeight: (properties as any).lineHeight || 'normal',
                textShadow: (properties as any).textShadow || 'none',
                transition: 'all 0.3s ease',
                color: getResultStyling().textColor,
                // Gradient text support
                background: (properties as any).textGradient || 'none',
                WebkitBackgroundClip: (properties as any).textGradient ? 'text' : 'initial',
                WebkitTextFillColor: (properties as any).textGradient ? 'transparent' : 'initial',
              }}>
                {getResultStyling().message}
              </span>
            )}
          </div>
        )}

        {/* Connection Target Button - only show when there's a source connecting */}
        {/* Removed: was showing orange button when isTargeted && !isConnected && !isPreviewMode */}

        {/* Connection Status Indicator */}
        {(() => {
          if (!isConnected || (properties as any)?.showConectadoMessage !== true) return false; // Changed: only show if explicitly enabled
          // Find paired node
          const pairedNode = elements.find(el =>
            el.id !== element.id &&
            (el.type === 'connection-text-node' || el.type === 'connection-image-node') &&
            (el.properties as any)?.connectionGroupId === (properties as any)?.connectionGroupId
          );
          const pairedId = pairedNode?.id;
          const myConnectedId = (properties as any)?.connectedNodeId;
          const pairedConnectedId = pairedNode ? ((pairedNode.properties as any)?.connectedNodeId) : null;
          return myConnectedId === pairedId && pairedConnectedId === element.id;
        })() && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow z-10 select-none pointer-events-none">
            conectado
          </div>
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
      </div>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes targetPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `
      }} />
    </>
  );
};
