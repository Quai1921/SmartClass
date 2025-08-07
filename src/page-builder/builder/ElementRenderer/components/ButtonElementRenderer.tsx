import React from 'react';
import { StandaloneImageElement } from '../components/interactive/StandaloneImageElement';
import { parseCSSString } from '../utils';
import type { Element } from '../types';

interface ButtonElementRendererProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Record<string, any>) => void;
}

export const ButtonElementRenderer: React.FC<ButtonElementRendererProps> = ({
  element,
  isSelected,
  isPreviewMode,
  onUpdate
}) => {
  const { properties } = element;

  // Check if this is a standalone drag-drop element with image support
  const isStandalone = properties.standaloneElementType === 'image' || properties.ownedBy || properties.dragDropOwner;
  
  if (isStandalone) {
    try {
      return (
        <StandaloneImageElement
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
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
}; 