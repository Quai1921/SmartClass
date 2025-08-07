import React, { useState } from 'react';
import type { Element } from '../../types';

interface StandaloneImageElementProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: any) => void;
}

export const StandaloneImageElement: React.FC<StandaloneImageElementProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const properties = element.properties || {};
  
  // Extract standalone image properties
  const imageUrl = properties.standaloneImageUrl || 
    (properties.backgroundImage?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')) || 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzRmNDZlNSIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfk6Y8L3RleHQ+Cjwvc3ZnPgo=';
  const imageAlt = properties.standaloneImageAlt || 'Draggable element';
  const imageFit = properties.standaloneImageFit || 'contain';
  const isTransparent = properties.standaloneBackgroundTransparent !== false;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // console.warn('Image failed to load:', imageUrl);
    setImageError(true);
    setImageLoaded(false);
  };
  
  // Base styles for the container
  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isPreviewMode ? 'default' : 'grab',
    backgroundColor: isTransparent ? 'transparent' : (properties.backgroundColor || 'transparent'),
    border: isSelected && !isPreviewMode ? '2px solid #3b82f6' : 'none',
    borderRadius: properties.borderRadius || 0,
    boxShadow: properties.boxShadow || (imageLoaded ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'),
    transition: 'all 0.2s ease',
    // Prevent default drag behavior for better custom handling
    userSelect: 'none',
    WebkitUserSelect: 'none',
    // Ensure proper layering
    zIndex: properties.zIndex || 10,
  };
  
  // Image styles
  const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: imageFit as any,
    objectPosition: 'center',
    borderRadius: properties.borderRadius || 0,
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };
  
  // Loading/Error placeholder styles
  const placeholderStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    border: '2px dashed #d1d5db',
    borderRadius: properties.borderRadius || 8,
    color: '#6b7280',
    fontSize: '12px',
    textAlign: 'center' as const,
    padding: '8px',
  };
  
  return (
    <div style={containerStyles}>
      {/* Image */}
      {imageUrl && !imageError && (
        <img
          src={imageUrl}
          alt={imageAlt}
          style={imageStyles}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />
      )}
      
      {/* Loading/Error Placeholder */}
      {(!imageLoaded || imageError || !imageUrl) && (
        <div style={placeholderStyles}>
          {imageError ? (
            <div>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>❌</div>
              <div>Error al cargar</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>�</div>
              <div>Elemento</div>
            </div>
          )}
        </div>
      )}
      
      {/* Text overlay (if text is provided and visible) */}
      {properties.text && 
       properties.text.trim() !== '' && 
       properties.fontSize && 
       Number(properties.fontSize) > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            fontSize: Number(properties.fontSize) || 12,
            textAlign: 'center' as const,
            borderRadius: `0 0 ${properties.borderRadius || 0}px ${properties.borderRadius || 0}px`,
          }}
        >
          {properties.text}
        </div>
      )}
    </div>
  );
};
