import React from 'react';
import { getImageUrl, calculateOpacity, calculateVisibility } from '../utils';

interface ImageContentProps {
  properties: any;
  isConnected: boolean;
  isTargeted: boolean;
}

export const ImageContent: React.FC<ImageContentProps> = ({
  properties,
  isConnected,
  isTargeted
}) => {
  const imageUrl = getImageUrl(properties);
  const opacity = calculateOpacity(properties, isConnected, isTargeted);
  const visibility = calculateVisibility(properties, isConnected, isTargeted);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: properties.imageObjectFit || 'cover',
        backgroundPosition: properties.imageObjectPosition || 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '0px',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        opacity,
        visibility,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
        // State-specific image effects
        ...(isConnected && {
          filter: properties.connectedImageFilter || properties.imageFilter || 'brightness(1.1)',
          transform: properties.connectedImageTransform || 'scale(1.02)'
        })
      }}
      draggable={false}
    />
  );
}; 