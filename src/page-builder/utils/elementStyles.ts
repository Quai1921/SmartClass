import type { Element } from '../types';

/**
 * Helper function to format dimension values, handling both numeric values and CSS keywords
 * @param value The dimension value (number or string like 'max-content')
 * @param unit The unit type ('px', 'vw', '%', 'max-content', etc.)
 * @returns Formatted CSS dimension string or undefined
 */
export const formatDimension = (value: number | string | undefined, unit: string | undefined): string | undefined => {
  if (value == null) return undefined;
  
  // If unit is a CSS keyword (max-content, min-content, fit-content), ignore the value
  if (unit === 'max-content' || unit === 'min-content' || unit === 'fit-content') {
    return unit;
  }
  
  // For numeric values, combine with unit
  if (typeof value === 'number') {
    return `${value}${unit || 'px'}`;
  }
  
  // For string values (CSS keywords), return as-is
  return value;
};

/**
 * Get styles for any element (widget or container) with proper dimension handling
 * @param element The element to get styles for
 * @param isContainer Whether this is a container (affects positioning and defaults)
 * @returns React CSS properties object
 */
export const getElementStyles = (element: Element, isContainer: boolean = false): React.CSSProperties => {
  const { properties } = element;
  const props = properties as any; // Type assertion for dynamic properties

  // Special handling for audio elements to prevent full-width expansion
  const isAudioElement = element.type === 'audio';
  const isAudioTrueFalseElement = element.type === 'audio-true-false';

  // Special handling for text elements to prevent over-shrinking
  const isTextElement = ['heading', 'paragraph', 'quote', 'text'].includes(element.type);
  let textMinWidth, textMinHeight;
  
  if (isTextElement) {
    const text = props.text || props.content || '';
    const fontSize = parseFloat(props.fontSize || '16') || 16;
    
    // Simple calculation for minimum text dimensions
    if (text.length > 0) {
      // For very short text, use minimal constraints
      if (text.length <= 5) {
        textMinWidth = Math.max(40, text.length * fontSize * 0.5);
        textMinHeight = fontSize * 1.2;
      } else {
        // For longer text, calculate based on longest word
        const words = text.split(/\s+/);
        const longestWord = words.reduce((longest, word) => 
          word.length > longest.length ? word : longest, '');
        
        // Estimate minimum width based on longest word
        textMinWidth = Math.min(200, Math.max(60, longestWord.length * fontSize * 0.6));
        textMinHeight = fontSize * 1.2;
      }
    } else {
      textMinWidth = 60;
      textMinHeight = fontSize * 1.2;
    }
  }

  // Determine positioning logic
  const isTopLevelElement = !element.parentId;
  const hasExplicitPosition = props.position === 'absolute';
  const hasPositionCoordinates = props.left !== undefined || props.top !== undefined;
  
  // Use absolute positioning for:
  // 1. Top-level elements (no parent)
  // 2. Elements with explicit left/top coordinates (for drag and drop repositioning)
  // 3. Elements with explicit position: absolute
  const positionValue: 'absolute' | 'relative' = isTopLevelElement || hasPositionCoordinates || hasExplicitPosition
    ? 'absolute'
    : 'relative';

  const styles = {
    position: positionValue,
    // Apply left/top coordinates for absolutely positioned elements
    left: positionValue === 'absolute' && props.left !== undefined ? `${props.left}px` : undefined,
    top: positionValue === 'absolute' && props.top !== undefined ? `${props.top}px` : undefined,
    width: isAudioElement ? '48px' : 
           isAudioTrueFalseElement ? 'auto' : 
           formatDimension(props.width, props.widthUnit),
    height: isAudioElement ? '48px' : 
            isAudioTrueFalseElement ? 'auto' : 
            formatDimension(props.height, props.heightUnit),
    maxWidth: isAudioElement ? '48px' : 
              isAudioTrueFalseElement ? 'none' : undefined,
    maxHeight: isAudioElement ? '48px' : 
               isAudioTrueFalseElement ? 'none' : undefined,
    overflow: (isAudioElement || isAudioTrueFalseElement) ? 'visible' : (isContainer ? 'visible' : undefined),
    display: isAudioElement ? 'inline-block' : 
             isAudioTrueFalseElement ? 'inline-flex' : 
             (isContainer ? (
      props.layout === 'row' || props.layout === 'column' ? 'flex' :
      props.layout === 'grid' ? 'grid' : 'block'
    ) : undefined),
    // Add minimum dimensions for CSS keywords to prevent unreadable elements
    minWidth: isAudioElement ? '48px' : 
              isAudioTrueFalseElement ? '120px' :
              isTextElement ? `${textMinWidth}px` :
              (props.widthUnit === 'max-content' || props.widthUnit === 'min-content' || props.widthUnit === 'fit-content') ? '20px' : undefined,
    minHeight: isAudioElement ? '48px' : 
               isAudioTrueFalseElement ? '80px' :
               isTextElement ? `${textMinHeight}px` :
               (props.heightUnit === 'max-content' || props.heightUnit === 'min-content' || props.heightUnit === 'fit-content') ? '20px' : undefined,
    padding: props.padding ? `${props.padding}px` : isContainer ? '16px' : undefined,
    margin: props.margin ? `${props.margin}px` : undefined,
    backgroundColor: props.backgroundColor || 'transparent',
    backgroundImage: props.backgroundImage || undefined,
    backgroundSize: props.backgroundSize || 'cover',
    backgroundPosition: props.backgroundPosition || 'center',
    backgroundRepeat: props.backgroundRepeat || 'no-repeat',
    borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
    border: (props.borderWidth || props.borderColor) 
      ? `${props.borderWidth || 1}px ${props.borderStyle || 'solid'} ${props.borderColor || '#e5e7eb'}` 
      : undefined,
    // Individual border sides (only apply if specifically set for that side)
    borderTop: (props.borderTopWidth !== undefined || props.borderTopColor !== undefined || props.borderTopStyle !== undefined) 
      ? `${props.borderTopWidth || props.borderWidth || 1}px ${props.borderTopStyle || props.borderStyle || 'solid'} ${props.borderTopColor || props.borderColor || '#e5e7eb'}` 
      : undefined,
    borderRight: (props.borderRightWidth !== undefined || props.borderRightColor !== undefined || props.borderRightStyle !== undefined) 
      ? `${props.borderRightWidth || props.borderWidth || 1}px ${props.borderRightStyle || props.borderStyle || 'solid'} ${props.borderRightColor || props.borderColor || '#e5e7eb'}` 
      : undefined,
    borderBottom: (props.borderBottomWidth !== undefined || props.borderBottomColor !== undefined || props.borderBottomStyle !== undefined) 
      ? `${props.borderBottomWidth || props.borderWidth || 1}px ${props.borderBottomStyle || props.borderStyle || 'solid'} ${props.borderBottomColor || props.borderColor || '#e5e7eb'}` 
      : undefined,
    borderLeft: (props.borderLeftWidth !== undefined || props.borderLeftColor !== undefined || props.borderLeftStyle !== undefined) 
      ? `${props.borderLeftWidth || props.borderWidth || 1}px ${props.borderLeftStyle || props.borderStyle || 'solid'} ${props.borderLeftColor || props.borderColor || '#e5e7eb'}` 
      : undefined,
    // Individual border radius properties
    borderTopLeftRadius: props.borderTopLeftRadius ? `${props.borderTopLeftRadius}px` : undefined,
    borderTopRightRadius: props.borderTopRightRadius ? `${props.borderTopRightRadius}px` : undefined,
    borderBottomLeftRadius: props.borderBottomLeftRadius ? `${props.borderBottomLeftRadius}px` : undefined,
    borderBottomRightRadius: props.borderBottomRightRadius ? `${props.borderBottomRightRadius}px` : undefined,
    flexDirection: props.layout === 'row' ? 'row' : props.layout === 'column' ? 'column' : props.flexDirection,
    justifyContent: props.justifyContent || undefined,
    alignItems: props.alignItems || undefined,
    gap: props.gap ? `${props.gap}px` : undefined,
    order: props.order || undefined, // CSS order for flexbox/grid ordering
    // Handle flex properties for child containers and elements
    flex: element.parentId ? (
      isAudioElement ? '0 0 48px' : // Audio elements should not flex
      props.widthUnit === '%' ? `0 0 ${props.width}%` : 
      props.style?.flexGrow || props.style?.flexShrink ? `${props.style?.flexGrow || 0} ${props.style?.flexShrink || 1} ${props.style?.flexBasis || 'auto'}` :
      undefined
    ) : undefined,
    flexShrink: isAudioElement ? 0 : undefined, // Prevent audio elements from shrinking
    zIndex: props.zIndex || undefined,
    boxSizing: 'border-box' as const,
    // Merge any custom style properties
    ...props.style,
  };

  return styles;
};
