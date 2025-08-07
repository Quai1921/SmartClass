import React from 'react';
import { calculateTextMinimumDimensions } from '../../utils/textMeasurement';
import { buildTextStyles } from '../utils';
import type { Element } from '../../types';

interface TextElementRendererProps {
  element: Element;
  isSelected: boolean;
  onTextChange: (newText: string) => void;
}

export const TextElementRenderer: React.FC<TextElementRendererProps> = ({
  element,
  isSelected,
  onTextChange
}) => {
  const { type, properties } = element;

  const handleTextChange = (newText: string) => {
    onTextChange(newText);
  };

  switch (type) {
    case 'heading':
      const level = properties.level || 1;
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
            // Render HTML content with proper inline styling
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
                // Ensure inline elements stay inline and don't expand to full width
                display: 'block',
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

    default:
      return null;
  }
};