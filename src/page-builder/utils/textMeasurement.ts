/**
 * Text measurement utilities for calculating minimum element dimensions
 */

interface TextMeasurementOptions {
  text: string;
  fontSize: number;
  fontWeight: string | number;
  fontFamily: string;
  maxWidth?: number;
  lineHeight?: number;
}

interface TextDimensions {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

/**
 * Creates a temporary canvas element to measure text dimensions
 */
const createMeasurementCanvas = (): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  return context;
};

/**
 * Measures the actual rendered dimensions of text
 */
export const measureText = (options: TextMeasurementOptions): TextDimensions => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      width: options.text.length * (options.fontSize * 0.6),
      height: options.fontSize * 1.2,
      minWidth: options.text.length * (options.fontSize * 0.6),
      minHeight: options.fontSize * 1.2,
    };
  }

  const {
    text,
    fontSize,
    fontWeight,
    fontFamily,
    maxWidth = 1000,
    lineHeight = 1.2
  } = options;

  // Create a temporary DOM element for more accurate measurement
  const measureElement = document.createElement('div');
  measureElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    font-size: ${fontSize}px;
    font-family: ${fontFamily};
    font-weight: ${fontWeight};
    line-height: ${lineHeight};
    padding: 0;
    margin: 0;
    border: 0;
    box-sizing: border-box;
  `;
  document.body.appendChild(measureElement);

  // Split text into words for word-wrap calculation
  const words = text.split(/\s+/);
  
  if (words.length === 0) {
    document.body.removeChild(measureElement);
    return { width: 0, height: fontSize * lineHeight, minWidth: 0, minHeight: fontSize * lineHeight };
  }

  // Calculate minimum width (longest word) using DOM measurement
  let minWidth = 0;
  let longestWord = '';
  
  words.forEach(word => {
    measureElement.textContent = word;
    measureElement.style.whiteSpace = 'nowrap';
    const wordWidth = measureElement.offsetWidth;
    if (wordWidth > minWidth) {
      minWidth = wordWidth;
      longestWord = word;
    }
  });

  // Add padding for safety
  minWidth += 20; // Increased padding

  // Measure single line height
  measureElement.textContent = text;
  measureElement.style.whiteSpace = 'nowrap';
  const singleLineHeight = measureElement.offsetHeight;

  // Now measure with word wrapping at different widths to find natural dimensions
  measureElement.style.whiteSpace = 'normal';
  measureElement.style.width = `${minWidth}px`;
  const wrappedHeightAtMinWidth = measureElement.offsetHeight;

  // Also test at a reasonable width to see natural wrapping
  measureElement.style.width = `${Math.min(maxWidth, minWidth * 2)}px`;
  const naturalWrappedHeight = measureElement.offsetHeight;

  document.body.removeChild(measureElement);

  // Use the larger of the measured heights to ensure text isn't clipped
  const calculatedHeight = Math.max(singleLineHeight, wrappedHeightAtMinWidth, naturalWrappedHeight);
  


  return {
    width: Math.min(minWidth * 2, maxWidth), // Natural width with some flexibility
    height: calculatedHeight,
    minWidth: Math.max(minWidth, 60), // Minimum 60px width
    minHeight: Math.max(calculatedHeight * 1.3, fontSize * lineHeight * 1.5), // Increased buffer to 30% + higher base
  };
};

/**
 * Calculates minimum dimensions for text elements to prevent over-shrinking
 */
export const calculateTextMinimumDimensions = (
  element: any,
  properties: any
): { minWidth: number; minHeight: number } => {
  const text = properties.text || properties.content || 'Sample Text';
  const fontSize = parseFloat(properties.fontSize || '16') || 16;
  const fontWeight = properties.fontWeight || 'normal';
  const fontFamily = properties.fontFamily || 'Arial, sans-serif';
  const lineHeight = parseFloat(properties.lineHeight || '1.2') || 1.2;
  


  // Don't make exceptions for short text - measure it properly
  const measurements = measureText({
    text,
    fontSize,
    fontWeight,
    fontFamily,
    lineHeight,
    maxWidth: 500, // Increased from 300 to allow more natural wrapping
  });


  return {
    minWidth: measurements.minWidth, // Don't cap it - use the actual measurement
    minHeight: measurements.minHeight,
  };
};
