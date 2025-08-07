import React from 'react';

// Helper function to parse CSS string into object
export const parseCSSString = (cssString: string): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  if (!cssString) return styles;

  try {
    const declarations = cssString.split(';').filter(decl => decl.trim());
    declarations.forEach(declaration => {
      const [property, value] = declaration.split(':').map(str => str.trim());
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        (styles as any)[camelProperty] = value;
      }
    });
  } catch (error) {
    // console.warn('Error parsing CSS string:', error);
  }

  return styles;
};

// Helper function to build CSS styles from properties
export const buildTextStyles = (props: any, elementType: string): React.CSSProperties => {
  const styles: React.CSSProperties = {
    ...props.style, // Preserve any existing custom styles
  };

  // Handle sizing based on element's width/height units
  const shouldUseContentWidth = props.widthUnit === 'max-content' || props.widthUnit === 'min-content' || props.widthUnit === 'fit-content';
  const shouldUseContentHeight = props.heightUnit === 'max-content' || props.heightUnit === 'min-content' || props.heightUnit === 'fit-content';
  
  // Apply width based on element's sizing preferences
  if (shouldUseContentWidth) {
    styles.width = props.widthUnit; // Use the content-based unit (max-content, etc.)
  } else if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  } else {
    // For text elements, use content-based width instead of 100%
    if (['heading', 'paragraph', 'quote'].includes(elementType)) {
      styles.width = 'max-content';
    } else {
      // Default width for other elements in flexbox containers
      styles.width = '100%';
    }
  }

  // Apply height based on element's sizing preferences
  if (shouldUseContentHeight) {
    styles.height = props.heightUnit; // Use the content-based unit (max-content, etc.)
  } else if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  } else {
    // Default to auto height for text flow
    styles.height = 'auto';
  }

  // Text wrapping and overflow behavior
  if (elementType === 'paragraph') {
    styles.display = 'flex';
    styles.flexDirection = 'column';
    styles.justifyContent = 'flex-start';
    styles.wordWrap = 'break-word';
    styles.overflowWrap = 'break-word';
    styles.hyphens = 'auto';
    styles.whiteSpace = 'pre-wrap'; // Honor line breaks
    styles.overflow = 'visible'; // Allow content to flow naturally
  } else if (elementType === 'heading') {
    styles.wordWrap = 'break-word';
    styles.overflowWrap = 'break-word';
  }

  // Font styling
  if (props.fontSize) {
    styles.fontSize = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize;
  }
  if (props.fontWeight) {
    styles.fontWeight = props.fontWeight;
  }
  if (props.fontFamily) {
    styles.fontFamily = props.fontFamily;
  }
  if (props.lineHeight) {
    styles.lineHeight = props.lineHeight;
  }
  if (props.letterSpacing) {
    styles.letterSpacing = typeof props.letterSpacing === 'number' ? `${props.letterSpacing}px` : props.letterSpacing;
  }

  // Text alignment and color
  if (props.textAlign) {
    styles.textAlign = props.textAlign;
  }
  if (props.color) {
    styles.color = props.color;
  }

  // Text transformation and decoration
  if (props.textTransform) {
    styles.textTransform = props.textTransform;
  }
  if (props.textShadow) {
    styles.textShadow = props.textShadow;
  }
  if (props.textDecoration) {
    styles.textDecoration = props.textDecoration;
  }
  if (props.textDecorationColor) {
    styles.textDecorationColor = props.textDecorationColor;
  }

  // Background properties (for gradient text and backgrounds)
  if (props.background) {
    styles.background = props.background;
  }
  if (props.WebkitBackgroundClip) {
    (styles as any).WebkitBackgroundClip = props.WebkitBackgroundClip;
  }
  if (props.WebkitTextFillColor) {
    (styles as any).WebkitTextFillColor = props.WebkitTextFillColor;
  }

  // Background and decoration
  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor;
  }

  // Spacing and layout
  if (props.padding) {
    styles.padding = typeof props.padding === 'number' ? `${props.padding}px` : props.padding;
  }
  if (props.margin) {
    styles.margin = typeof props.margin === 'number' ? `${props.margin}px` : props.margin;
  }
  if (props.paddingBottom) {
    styles.paddingBottom = typeof props.paddingBottom === 'number' ? `${props.paddingBottom}px` : props.paddingBottom;
  }

  // Border
  if (props.border) {
    styles.border = props.border;
  }
  if (props.borderRadius) {
    styles.borderRadius = typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius;
  }

  // Box shadow
  if (props.boxShadow) {
    styles.boxShadow = props.boxShadow;
  }

  // Transform
  if (props.transform) {
    styles.transform = props.transform;
  }

  // Opacity
  if (props.opacity !== undefined) {
    styles.opacity = props.opacity;
  }

  // Z-index
  if (props.zIndex !== undefined) {
    styles.zIndex = props.zIndex;
  }

  // Position
  if (props.position) {
    styles.position = props.position;
  }

  // Top, right, bottom, left
  if (props.top !== undefined) {
    styles.top = typeof props.top === 'number' ? `${props.top}px` : props.top;
  }
  if (props.right !== undefined) {
    styles.right = typeof props.right === 'number' ? `${props.right}px` : props.right;
  }
  if (props.bottom !== undefined) {
    styles.bottom = typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom;
  }
  if (props.left !== undefined) {
    styles.left = typeof props.left === 'number' ? `${props.left}px` : props.left;
  }

  return styles;
}; 