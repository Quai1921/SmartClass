import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link2, Check } from 'lucide-react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

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
  const { elements } = useBuilder();
  const properties = element.properties as any;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced getNodeStyles with comprehensive customization
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
      gap: '8px',
      
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
      backgroundColor: isHovered && props.enableHoverEffects 
        ? (props.hoverBackgroundColor || props.backgroundColor || '#3b82f6')
        : (props.backgroundColor || '#3b82f6'),
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
      transform: isHovered && props.enableHoverEffects && props.hoverScale
        ? `scale(${props.hoverScale})`
        : 'none',
    };

    // State-specific modifications
    if (isConnected) {
      return {
        ...baseStyles,
        borderColor: props.connectedBorderColor || '#22c55e',
        boxShadow: props.connectedBoxShadow || '0 4px 12px rgba(34, 197, 94, 0.2)',
        backgroundColor: props.connectedBackgroundColor || baseStyles.backgroundColor,
        transform: props.connectedTransform || 'scale(1.02)'
      };
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: props.selectedBorderColor || '#f59e0b',
        boxShadow: props.selectedBoxShadow || '0 4px 12px rgba(245, 158, 11, 0.3)',
        backgroundColor: props.selectedBackgroundColor || baseStyles.backgroundColor,
      };
    }

    return baseStyles;
  };

  try {
    return (
      <>
        <div
          ref={nodeRef}
          data-element-id={element.id}
          data-connection-group={properties.connectionGroupId}
          data-node-type="text"
          data-no-drag="true"
          draggable={false}
          style={getNodeStyles()}
          className={properties.customClasses || ''}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={() => {
            if (properties.enableHoverEffects) {
              setIsHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (properties.enableHoverEffects) {
              setIsHovered(false);
            }
          }}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          {/* Connection Icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: isConnected ? 
              (properties.connectedIconColor || '#22c55e') : 
              (properties.iconColor || properties.lineColor || '#3b82f6'),
            fontSize: `${properties.iconSize || 16}px`
          }}>
            {isConnected ? (
              <Check size={properties.iconSize || 16} />
            ) : (
              <Link2 size={properties.iconSize || 16} />
            )}
          </div>

          {/* Main Content - Text or Image */}
          {properties.contentType === 'image' && (properties.imageSrc || properties.imageUrl) ? (
            <img
              src={properties.imageSrc || properties.imageUrl}
              alt={properties.imageAlt || 'Connection image'}
              style={{
                width: properties.imageWidth ? `${properties.imageWidth}px` : 'auto',
                height: properties.imageHeight ? `${properties.imageHeight}px` : 'auto',
                maxWidth: '100%',
                objectFit: properties.imageObjectFit || 'cover',
                borderRadius: `${properties.imageBorderRadius || 4}px`,
                opacity: properties.imageOpacity || 1
              }}
            />
          ) : (
            /* Text Content */
            <span style={{ 
              color: properties.textColor || '#ffffff',
              fontFamily: properties.fontFamily || 'inherit',
              fontSize: properties.fontSize || '14px',
              fontWeight: properties.fontWeight || '500',
              textAlign: properties.textAlign || 'center',
            }}>
              {properties.text || 'Conectar'}
            </span>
          )}
        </div>

        {/* Connection Lines Overlay */}
        {typeof window !== 'undefined' && createPortal(
          <svg
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            {/* Placeholder for connection lines - will be implemented */}
          </svg>,
          document.body
        )}

        {/* CSS for animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
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
