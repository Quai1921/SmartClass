import React, { memo } from 'react';
import { Play } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import { calculateTextMinimumDimensions } from '../utils/textMeasurement';
import type { Element } from '../types';
import { ResizableContainer } from './ResizableContainer';
import { VideoWidget } from '../components/VideoWidget';
import { AudioWidget } from '../components/AudioWidget';
import { 
  TextStatementWidget,
  ImageChoiceWidget,
  ImageComparisonWidget,
  AudioComparisonWidget,
  AudioTrueFalseWidget,
  AreaTrueFalseWidget,
  ConnectionWidget
} from '../components/interactive';
import { FillInTheBlanksWidget } from '../components/interactive/FillInTheBlanksWidget';
import { SingleChoiceWidget } from '../components/interactive/SingleChoiceWidget';
import { ConnectionTextNode } from '../components/interactive/ConnectionTextNode';
import { ConnectionImageNode } from '../components/interactive/ConnectionImageNode';
import { DragDropWidget } from '../components/interactive/DragDropWidget';
import { StandaloneImageElement } from '../components/interactive/StandaloneImageElement';
import SpeechRecognitionWidget from '../components/interactive/SpeechRecognitionWidget';
import { ElementWrapper } from './ElementWrapper';
import { StandaloneWidget } from '../components/interactive/StandaloneWidget';
import { MathCalculatorWidget } from '../components/interactive/MathCalculatorWidget';

interface ElementRendererProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean; // Add preview mode prop
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

const ElementRendererComponent: React.FC<ElementRendererProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  openImageChoiceModal
}) => {

  
  // Early validation
  if (!element || !element.id || !element.type) {
    // console.error('ElementRenderer: Invalid element provided', element);
    return (
      <div className="p-4 border-2 border-dashed border-red-300 text-center text-red-500">
        Invalid element
      </div>
    );
  }
  
  const { updateElement } = useBuilder();
  const { type, properties } = element;

  // Helper function to parse CSS string into object
  const parseCSSString = (cssString: string): React.CSSProperties => {
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
  const buildTextStyles = (props: any, elementType: string): React.CSSProperties => {
    const styles: React.CSSProperties = {
      ...props.style, // Preserve any existing custom styles
    };

    // Handle sizing based on element's width/height units
    const shouldUseContentWidth = props.widthUnit === 'max-content' || props.widthUnit === 'min-content' || props.widthUnit === 'fit-content';
    const shouldUseContentHeight = props.heightUnit === 'max-content' || props.heightUnit === 'min-content' || props.heightUnit === 'fit-content';    // Apply width based on element's sizing preferences
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

    // Individual border properties
    if (props.borderWidth || props.borderColor) {
      const borderWidth = typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth || '1px';
      const borderColor = props.borderColor || '#e5e7eb';
      const borderStyle = props.borderStyle || 'solid';

      if (!props.border) { // Only apply if no shorthand border is set
        styles.border = `${borderWidth} ${borderStyle} ${borderColor}`;
      }
    }

    // Individual border sides (only apply if specifically set for that side)
    if (props.borderTopWidth !== undefined || props.borderTopColor !== undefined || props.borderTopStyle !== undefined) {
      const width = typeof props.borderTopWidth === 'number' ? `${props.borderTopWidth}px` : props.borderTopWidth || (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth || '1px');
      const color = props.borderTopColor || props.borderColor || '#e5e7eb';
      const style = props.borderTopStyle || props.borderStyle || 'solid';
      styles.borderTop = `${width} ${style} ${color}`;
    }

    if (props.borderRightWidth !== undefined || props.borderRightColor !== undefined || props.borderRightStyle !== undefined) {
      const width = typeof props.borderRightWidth === 'number' ? `${props.borderRightWidth}px` : props.borderRightWidth || (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth || '1px');
      const color = props.borderRightColor || props.borderColor || '#e5e7eb';
      const style = props.borderRightStyle || props.borderStyle || 'solid';
      styles.borderRight = `${width} ${style} ${color}`;
    }

    if (props.borderBottomWidth !== undefined || props.borderBottomColor !== undefined || props.borderBottomStyle !== undefined) {
      const width = typeof props.borderBottomWidth === 'number' ? `${props.borderBottomWidth}px` : props.borderBottomWidth || (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth || '1px');
      const color = props.borderBottomColor || props.borderColor || '#e5e7eb';
      const style = props.borderBottomStyle || props.borderStyle || 'solid';
      styles.borderBottom = `${width} ${style} ${color}`;
    }

    if (props.borderLeftWidth !== undefined || props.borderLeftColor !== undefined || props.borderLeftStyle !== undefined) {
      const width = typeof props.borderLeftWidth === 'number' ? `${props.borderLeftWidth}px` : props.borderLeftWidth || (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth || '1px');
      const color = props.borderLeftColor || props.borderColor || '#e5e7eb';
      const style = props.borderLeftStyle || props.borderStyle || 'solid';
      styles.borderLeft = `${width} ${style} ${color}`;
    }

    if (props.borderLeft) {
      styles.borderLeft = props.borderLeft;
    }
    if (props.borderBottom) {
      styles.borderBottom = props.borderBottom;
    }

    // Border radius
    if (props.borderRadius) {
      styles.borderRadius = typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius;
    }

    // Individual border radius properties
    if (props.borderTopLeftRadius) {
      styles.borderTopLeftRadius = typeof props.borderTopLeftRadius === 'number' ? `${props.borderTopLeftRadius}px` : props.borderTopLeftRadius;
    }
    if (props.borderTopRightRadius) {
      styles.borderTopRightRadius = typeof props.borderTopRightRadius === 'number' ? `${props.borderTopRightRadius}px` : props.borderTopRightRadius;
    }
    if (props.borderBottomLeftRadius) {
      styles.borderBottomLeftRadius = typeof props.borderBottomLeftRadius === 'number' ? `${props.borderBottomLeftRadius}px` : props.borderBottomLeftRadius;
    }
    if (props.borderBottomRightRadius) {
      styles.borderBottomRightRadius = typeof props.borderBottomRightRadius === 'number' ? `${props.borderBottomRightRadius}px` : props.borderBottomRightRadius;
    }

    // Advanced properties
    if (props.maxWidth) {
      styles.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
    }
    if (props.boxShadow) {
      styles.boxShadow = props.boxShadow;
    }

    // REMOVED: CSS custom properties - use direct width/height instead

    return styles;
  };

  const handleTextChange = (newText: string) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        text: newText,
        // For paragraphs and quotes, also store HTML content if it contains HTML
        ...((element.type === 'paragraph' || element.type === 'quote') && {
          htmlContent: newText.includes('<') ? newText : undefined
        })
      },
    });
  };


  switch (type) {
    case 'heading':
      const level = (properties as any).level || 1;
      const HeadingTag = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' :
        level === 4 ? 'h4' : level === 5 ? 'h5' : 'h6';

      // Calculate minimum dimensions for this text element
      const headingMinDims = calculateTextMinimumDimensions(element, properties);

      return (
        <div className="element-content" style={{ 
          width: properties.width ? `${properties.width}px` : undefined,
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          minWidth: `${headingMinDims.minWidth}px`,
          minHeight: `${headingMinDims.minHeight}px`,
        }}>
          {React.createElement(
            HeadingTag,
            {
              'data-element-type': 'heading',
              className: properties.className || '',
              style: {
                ...buildTextStyles(properties, 'heading'),
                width: '100%',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'normal',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                minHeight: 'fit-content',
                lineHeight: properties.lineHeight || '1.2',
              },
              contentEditable: isSelected,
              suppressContentEditableWarning: true,
              onBlur: (e: any) => handleTextChange(e.target.textContent || '')
            },
            properties.text || `Título ${level}`
          )}
        </div>
      );

    case 'paragraph':
      // Calculate minimum dimensions for this text element
      const paragraphMinDims = calculateTextMinimumDimensions(element, properties);
      
      // Determine content to display - prefer HTML content if available
      const paragraphContent = properties.htmlContent || properties.text || 'Texto del párrafo...';
      const hasHtmlContent = properties.htmlContent && properties.htmlContent.includes('<');

      return (
        <div className="element-content" style={{ 
          width: properties.width ? `${properties.width}px` : undefined,
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          minWidth: `${paragraphMinDims.minWidth}px`,
          minHeight: `${paragraphMinDims.minHeight}px`,
        }}>
          {hasHtmlContent ? (
            // Render HTML content
            <div
              data-element-type="paragraph"
              className={`${properties.className || ''} quote-no-line-breaks`}
              style={{
                ...buildTextStyles(properties, 'paragraph'),
                width: '100%',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'normal',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                minHeight: 'fit-content',
                lineHeight: properties.lineHeight || '1.4',
              }}
              dangerouslySetInnerHTML={{ __html: paragraphContent }}
            />
          ) : (
            // Render plain text with contentEditable
            <p
              data-element-type="paragraph"
              className={`${properties.className || ''} quote-no-line-breaks`}
              style={{
                ...buildTextStyles(properties, 'paragraph'),
                width: '100%',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'normal',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                minHeight: 'fit-content',
                lineHeight: properties.lineHeight || '1.4',
              }}
              contentEditable={isSelected}
              suppressContentEditableWarning={true}
              onBlur={(e: any) => handleTextChange(e.target.textContent || '')}
            >
              {paragraphContent}
            </p>
          )}
        </div>
      );

    case 'quote':
      // Calculate minimum dimensions for this text element
      const quoteMinDims = calculateTextMinimumDimensions(element, properties);
      
      // Determine content to display - prefer HTML content if available
      const quoteContent = properties.htmlContent || properties.text || properties.content || 'Texto de la cita...';
      const hasQuoteHtmlContent = properties.htmlContent && properties.htmlContent.includes('<');

      return (
        <div className="element-content" style={{ 
          width: properties.width ? `${properties.width}px` : undefined,
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          minWidth: `${quoteMinDims.minWidth}px`,
          minHeight: `${quoteMinDims.minHeight}px`,
        }}>
          {hasQuoteHtmlContent ? (
            // Render HTML content
            <blockquote
              data-element-type="quote"
              className={properties.className || ''}
              style={{
                ...buildTextStyles(properties, 'quote'),
                width: '100%',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'normal',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                minHeight: 'fit-content',
                lineHeight: properties.lineHeight || '1.4',
              }}
              dangerouslySetInnerHTML={{ __html: quoteContent }}
            />
          ) : (
            // Render plain text with contentEditable
            <blockquote
              data-element-type="quote"
              className={`${properties.className || ''} quote-no-line-breaks`}
              style={{
                ...buildTextStyles(properties, 'quote'),
                width: '100%',
                overflow: 'hidden',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                whiteSpace: 'normal',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                minHeight: 'fit-content',
                lineHeight: properties.lineHeight || '1.4',
              }}
              contentEditable={isSelected}
              suppressContentEditableWarning={true}
              onBlur={(e: any) => handleTextChange(e.target.textContent || '')}
            >
              {quoteContent}
            </blockquote>
          )}
        </div>
      );

    case 'image':
      const imageStyles: React.CSSProperties = {
        ...properties.style,
        maxWidth: '100%',
        maxHeight: '100%',
        width: properties.width ? (typeof properties.width === 'number' ? `${properties.width}px` : properties.width) : undefined,
        height: properties.height ? (typeof properties.height === 'number' ? `${properties.height}px` : properties.height) : undefined,
        borderRadius: properties.borderRadius || undefined,
        objectFit: properties.objectFit || 'cover',
      };

      return (
        <img
          src={properties.src || 'https://via.placeholder.com/300x200?text=Imagen'}
          alt={properties.alt || 'Imagen'}
          className={properties.className || ''}
          style={imageStyles}
        />
      );

    case 'video':
      if (isPreviewMode) {
        return (
          <video
            src={properties.src}
            controls={(properties as any).controls !== false}
            muted={(properties as any).muted || false}
            autoPlay={(properties as any).autoplay || false}
            loop={(properties as any).loop || false}
            className={`w-auto ${properties.className || ''}`}
            style={{
              height: '400px',
              maxWidth: '100%',
              objectFit: 'contain',
              ...properties.style
            }}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        );
      }
      
      return (
        <VideoWidget
          element={element}
          isSelected={isSelected}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'audio':
      if (isPreviewMode) {
        return (
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white">
            <Play size={20} className="ml-0.5" />
          </div>
        );
      }
      
      return (
        <AudioWidget
          element={element}
          isSelected={isSelected}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'button':
      // Check if this is a standalone drag-drop element with image support
      const isStandalone = properties.standaloneElementType === 'image' || properties.ownedBy || properties.dragDropOwner;
      
      if (isStandalone) {
        try {
          return (
            <StandaloneImageElement
              element={element}
              isSelected={isSelected}
              isPreviewMode={isPreviewMode}
              onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
            />
          );
        } catch (error) {
          // console.error('Error rendering StandaloneImageElement:', error);
          // Fallback to regular button rendering
        }
      }
      
      // Regular button rendering
      // Build comprehensive button styles
      const buttonProps = properties as any; // Type assertion for extended button properties
      
      // Check if this should be a standalone element but failed to render above
      const shouldHideText = properties.standaloneElementType === 'image' || 
                            properties.ownedBy || 
                            properties.dragDropOwner ||
                            properties.fontSize === 0;

      const buttonStyles: React.CSSProperties = {
        // Base styles
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        outline: 'none',
        userSelect: 'none',
        // Custom properties with smart fallbacks (only when property is undefined)
        backgroundColor: buttonProps.backgroundColor !== undefined ? buttonProps.backgroundColor : (buttonProps.background ? 'transparent' : '#3b82f6'),
        color: buttonProps.color !== undefined ? buttonProps.color : '#ffffff',
        border: buttonProps.border !== undefined ? buttonProps.border : 'none',
        borderRadius: typeof buttonProps.borderRadius === 'number' ? `${buttonProps.borderRadius}px` : (buttonProps.borderRadius !== undefined ? buttonProps.borderRadius : '6px'),
        padding: buttonProps.padding !== undefined ? buttonProps.padding : '8px 16px',
        fontSize: typeof buttonProps.fontSize === 'number' ? `${buttonProps.fontSize}px` : (buttonProps.fontSize !== undefined ? buttonProps.fontSize : '14px'),
        fontWeight: buttonProps.fontWeight !== undefined ? buttonProps.fontWeight : '500',
        fontFamily: buttonProps.fontFamily,
        lineHeight: buttonProps.lineHeight !== undefined ? buttonProps.lineHeight : '1.5',
        letterSpacing: buttonProps.letterSpacing,
        textTransform: buttonProps.textTransform as any,
        textShadow: buttonProps.textShadow,
        boxShadow: buttonProps.boxShadow,
        cursor: buttonProps.cursor !== undefined ? buttonProps.cursor : 'pointer',
        transition: buttonProps.transition !== undefined ? buttonProps.transition : 'all 0.2s ease',
        opacity: buttonProps.disabled ? 0.6 : 1,
        pointerEvents: buttonProps.disabled ? 'none' : 'auto',
        // Background image support
        backgroundImage: buttonProps.backgroundImage,
        backgroundRepeat: buttonProps.backgroundRepeat,
        // Advanced properties
        backdropFilter: buttonProps.backdropFilter,
        // Background shorthand (gradients, etc.) - this should come after backgroundColor to override it
        background: buttonProps.background,
        // Apply background properties AFTER background shorthand to ensure they take precedence
        backgroundSize: buttonProps.backgroundSize,
        backgroundPosition: buttonProps.backgroundPosition,
        // Custom CSS support
        ...buttonProps.customCSS ? parseCSSString(buttonProps.customCSS) : {},
        // Override with any existing style
        ...properties.style,
      } as React.CSSProperties;

      // Determine if it should be a link or button
      const isLink = buttonProps.href && buttonProps.href.trim() !== '';

      if (isLink) {
        return (
          <a
            href={buttonProps.href}
            target={buttonProps.target || '_self'}
            rel={buttonProps.target === '_blank' ? 'noopener noreferrer' : undefined}
            className={`button-element custom-styled ${properties.className || ''}`}
            style={buttonStyles}
            title={buttonProps.title || buttonProps.text}
          >
            {shouldHideText ? '' : (buttonProps.text || 'Botón')}
          </a>
        );
      } else {
        return (
          <button
            type={buttonProps.buttonType || 'button'}
            disabled={buttonProps.disabled || false}
            className={`button-element custom-styled ${properties.className || ''}`}
            style={buttonStyles}
            title={buttonProps.title || buttonProps.text}
          >
            {shouldHideText ? '' : (buttonProps.text || 'Botón')}
          </button>
        );
      }

    case 'container':
      // Don't wrap containers - they handle their own drag logic
      return (
        <ResizableContainer
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          openImageChoiceModal={openImageChoiceModal}
        />
      );

    case 'simple-container':
      // Don't wrap containers - they handle their own drag logic  
      return (
        <ResizableContainer
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          openImageChoiceModal={openImageChoiceModal}
        />
      );

    case 'text-statement':
      return (
        <TextStatementWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'image-choice':
      return (
        <div className="element-content" style={{
          width: properties.width ? `${properties.width}px` : undefined,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
          <ImageChoiceWidget
            element={element}
            isSelected={isSelected}
            isPreviewMode={isPreviewMode}
            onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
          />
        </div>
      );

    case 'image-comparison':
      return (
        <ImageComparisonWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'audio-comparison':
      return (
        <AudioComparisonWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'audio-true-false':

      return (
        <div className="element-content" style={{
          width: undefined,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
          <AudioTrueFalseWidget element={element} isSelected={isSelected} />
        </div>
      );

    case 'fill-in-blanks':
      return (
        <FillInTheBlanksWidget
          element={element}
          isSelected={isSelected}
        />
      );

    case 'single-choice':
      return (
        <SingleChoiceWidget
          element={element}
          isSelected={isSelected}
        />
      );

    case 'math-calculator':
      return (
        <MathCalculatorWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'area-true-false':
      return (
        <AreaTrueFalseWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'speech-recognition':
      return (
        <SpeechRecognitionWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'connection-widget':
      return (
        <ConnectionWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'connection-text-node':
      return (
        <ConnectionTextNode
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'connection-image-node':
      return (
        <ConnectionImageNode
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates) => updateElement(element.id, { properties: { ...element.properties, ...updates } })}
        />
      );

    case 'drag-drop-widget':
      return (
        <DragDropWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    case 'standalone-widget':
      return (
        <StandaloneWidget
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
        />
      );

    default:
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 text-center text-gray-500">
          Tipo de elemento no soportado: {type}
        </div>
      );
  }
};

// Export the memoized component to prevent unnecessary re-renders
export const ElementRenderer = memo(ElementRendererComponent, (prevProps, nextProps) => {
  // Only re-render if element properties or selection state actually changed
  return (
    prevProps.element.id === nextProps.element.id &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevProps.element.properties) === JSON.stringify(nextProps.element.properties)
  );
});
