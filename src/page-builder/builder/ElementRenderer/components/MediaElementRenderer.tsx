import React from 'react';
import { Play } from 'lucide-react';
import { VideoWidget } from '../components/VideoWidget';
import { AudioWidget } from '../components/AudioWidget';
import type { Element } from '../types';

interface MediaElementRendererProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode: boolean;
  onUpdate: (updates: Record<string, any>) => void;
}

export const MediaElementRenderer: React.FC<MediaElementRendererProps> = ({
  element,
  isSelected,
  isPreviewMode,
  onUpdate
}) => {
  const { type, properties } = element;

  switch (type) {
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
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
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
          onUpdate={(updates: Record<string, any>) => onUpdate(updates)}
        />
      );

    default:
      return null;
  }
}; 