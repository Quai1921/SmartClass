import React from 'react';
import type { Element } from '../../types';

export interface StandaloneWidgetProperties {
  // Visual appearance
  backgroundImage?: string;
  backgroundColor?: string;
  text?: string;
  textColor?: string;
  color?: string; // Add color for compatibility
  fontSize?: number;
  fontWeight?: string | number;
  
  // Layout and sizing
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  borderRadius?: number;
  border?: string;
  
  // Image properties
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  
  // Interactive properties
  cursor?: string;
  zIndex?: number;
  
  // Drag-drop widget ownership
  ownedBy?: string;
  dragDropOwner?: string;
  originalPosition?: { x: number; y: number };
  
  // Element identification
  standaloneElementType?: string;
  standaloneImageUrl?: string;
  standaloneImageAlt?: string;
  
  // Visual effects
  boxShadow?: string;
  opacity?: number;
  transition?: string;
  
  // Hover effects
  hoverScale?: number;
  hoverOpacity?: number;
}

interface StandaloneWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
}

export const StandaloneWidget: React.FC<StandaloneWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const properties = element.properties as StandaloneWidgetProperties;
  
  // Default values
  const width = properties.width || 80;
  const height = properties.height || 80;
  
  // Extract URL from CSS url() wrapper if present
  const extractUrl = (urlString: string) => {
    if (!urlString) return '';
    // Remove url("...") or url('...') wrapper
    const match = urlString.match(/url\(['"]?(.*?)['"]?\)/);
    return match ? match[1] : urlString;
  };
  
  const backgroundImageRaw = properties.backgroundImage || properties.standaloneImageUrl;
  const backgroundImage = extractUrl(backgroundImageRaw || '');
  
  const backgroundColor = properties.backgroundColor || 'transparent';
  const text = properties.text || '';
  const textColor = properties.color || properties.textColor || '#333';
  const fontSize = properties.fontSize || 12;
  const fontWeight = properties.fontWeight || '500';
  const borderRadius = properties.borderRadius || 8;
  const border = properties.border || 'none';
  const backgroundSize = properties.backgroundSize || 'contain';
  const backgroundPosition = properties.backgroundPosition || 'center';
  const backgroundRepeat = properties.backgroundRepeat || 'no-repeat';
  const cursor = properties.cursor || 'grab';
  const zIndex = properties.zIndex || 10;
  const boxShadow = properties.boxShadow || '0 2px 4px rgba(0,0,0,0.1)';
  const opacity = properties.opacity || 1;
  const transition = properties.transition || 'all 0.2s ease';

  const containerStyles: React.CSSProperties = {
    // Use dimensions from element properties but don't position - parent handles positioning
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative', // Relative positioning for internal layout
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'inherit', // Inherit cursor from parent (draggable wrapper)
    userSelect: 'none',
    zIndex: 1, // Keep low z-index, let wrapper control it
    opacity: 1, // Always fully visible - let wrapper control opacity during drag
    transition,
    transform: isHovered && properties.hoverScale ? `scale(${properties.hoverScale})` : 'none',
    
    // Background styling
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    
    // Border and shadow
    border,
    borderRadius: `${borderRadius}px`,
    boxShadow,
    
    // Ensure proper containment and alignment
    overflow: 'hidden', // Ensure content stays within bounds
    boxSizing: 'border-box', // Include border in size calculations
    margin: 0, // Remove any default margins
    padding: 0, // Remove any default padding
    
    // Don't interfere with dragging
    pointerEvents: 'auto', // Allow pointer events for dragging
  };

  return (
    <div
      style={containerStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${element.type} - ${element.name || ''}`}
    >
      {/* Only show image element if we want overlay behavior, otherwise use CSS background */}
      {backgroundImage && backgroundSize === 'contain' && (
        <img
          src={backgroundImage}
          alt={properties.standaloneImageAlt || 'Standalone element'}
          style={{
            width: '80%', // Slightly smaller to ensure it fits within bounds
            height: '80%', // Slightly smaller to ensure it fits within bounds
            objectFit: 'contain' as any, // Ensure the entire image is visible
            objectPosition: 'center', // Center the image
            borderRadius: `${Math.max(0, borderRadius - 2)}px`, // Slightly smaller radius
            pointerEvents: 'none', // Prevent image from interfering with drag
            maxWidth: '100%',
            maxHeight: '100%',
            // Ensure proper alignment
            display: 'block',
            margin: 'auto',
          }}
        />
      )}
      
      {/* Text content overlay */}
      {text && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign: 'center',
            textShadow: backgroundImage ? '0 1px 2px rgba(0,0,0,0.7)' : 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {text}
        </div>
      )}
      
      {/* Selection indicator */}
      {isSelected && !isPreviewMode && (
        <div
          style={{
            position: 'absolute',
            inset: -2,
            border: '2px solid #3b82f6',
            borderRadius: `${borderRadius + 2}px`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
};

export default StandaloneWidget;
