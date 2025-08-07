import type { ElementProperties } from '../types';

/**
 * Utility functions for applying templates cleanly without style conflicts
 */

// Properties that should be cleared for button elements
const BUTTON_STYLE_PROPERTIES = [
  'backgroundColor',
  'background',
  'backgroundImage',
  'backgroundSize',
  'backgroundPosition',
  'backgroundRepeat',
  'color',
  'border',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'padding',
  'margin',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'textShadow',
  'textDecoration',
  'textDecorationColor',
  'boxShadow',
  'cursor',
  'transition',
  'backdropFilter',
  'customCSS'
] as const;

// Properties that should be cleared for text elements
const TEXT_STYLE_PROPERTIES = [
  'fontSize',
  'fontWeight',
  'fontFamily',
  'fontStyle',
  'color',
  'textAlign',
  'lineHeight',
  'letterSpacing',
  'wordSpacing',
  'textDecoration',
  'textDecorationColor',
  'textDecorationStyle',
  'textDecorationThickness',
  'textTransform',
  'textIndent',
  'textShadow',
  'whiteSpace',
  'wordBreak',
  'textOverflow',
  'backgroundColor',
  'background',
  'backgroundImage',
  'backgroundSize',
  'backgroundPosition',
  'backgroundRepeat',
  'border',
  'borderLeft',
  'borderRight',
  'borderTop',
  'borderBottom',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'boxShadow',
  'maxWidth',
  'minWidth',
  // NOTE: Removed 'width' and 'height' to prevent interference with resize functionality
  'WebkitBackgroundClip',
  'WebkitTextFillColor'
] as const;

/**
 * Clear style properties from element properties
 */
export function clearStyleProperties(
  currentProperties: ElementProperties,
  propertiesToClear: readonly string[]
): ElementProperties {
  const clearedProperties = { ...currentProperties };
  
  for (const prop of propertiesToClear) {
    (clearedProperties as any)[prop] = undefined;
  }
  
  return clearedProperties;
}

/**
 * Apply template to button element with proper style clearing
 */
export function applyButtonTemplate(
  currentProperties: ElementProperties,
  templateProperties: Record<string, any>
): ElementProperties {
  const clearedProperties = clearStyleProperties(currentProperties, BUTTON_STYLE_PROPERTIES);
  
  return {
    ...clearedProperties,
    variant: 'custom' as any,
    ...templateProperties
  } as any;
}

/**
 * Apply template to text element with proper style clearing
 */
export function applyTextTemplate(
  currentProperties: ElementProperties,
  templateProperties: Record<string, any>
): ElementProperties {
  const clearedProperties = clearStyleProperties(currentProperties, TEXT_STYLE_PROPERTIES);
  
  return {
    ...clearedProperties,
    ...templateProperties
  } as any;
}

/**
 * Generic template application function
 */
export function applyTemplate(
  elementType: 'button' | 'quote' | 'heading' | 'paragraph',
  currentProperties: ElementProperties,
  templateProperties: Record<string, any>
): ElementProperties {
  if (elementType === 'button') {
    return applyButtonTemplate(currentProperties, templateProperties);
  } else {
    return applyTextTemplate(currentProperties, templateProperties);
  }
}
