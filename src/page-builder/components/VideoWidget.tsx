import React, { useState } from 'react';
import { Video } from 'lucide-react';
import type { Element } from '../types';
import { VideoChoiceModal } from './VideoChoiceModal';

interface VideoWidgetProps {
  element: Element;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const VideoWidget: React.FC<VideoWidgetProps> = ({ element, isSelected, onUpdate }) => {
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [droppedVideoUrl, setDroppedVideoUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { properties } = element;
  const hasVideo = properties.src && properties.src !== '';

  const handleVideoSelect = (src: string, title?: string) => {
    onUpdate?.({
      src,
      title: title || 'Video'
    });
  };

  const handleVideoChoice = (useAsBackground: boolean, videoUrl?: string) => {
    const finalVideoUrl = videoUrl || droppedVideoUrl;
    if (finalVideoUrl) {
      if (useAsBackground) {
        // Handle background video logic here
        // For now, we'll treat it as a regular video since background video might need container context
        handleVideoSelect(finalVideoUrl, 'Background Video');
      } else {
        // Handle as element
        handleVideoSelect(finalVideoUrl, 'Video');
      }
    }
    setDroppedVideoUrl(null);
    setIsChoiceModalOpen(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      setDroppedVideoUrl(videoUrl);
      setIsChoiceModalOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  if (!hasVideo) {
    return (
      <>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-full min-h-[150px] border-2 border-dashed rounded-lg 
            flex flex-col items-center justify-center transition-all
            hover:border-blue-400 hover:bg-blue-50/10 group
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50/20 border-solid scale-[1.02]' 
              : 'border-gray-300'
            }
            ${isSelected ? 'border-blue-500' : ''}
          `}
        >
          <Video size={48} className="text-gray-400 group-hover:text-blue-400 transition-colors mb-2" />
          <p className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
            Arrastra un video aquí
          </p>
          <p className="text-xs text-gray-400 mt-1">
            o usa el menú contextual (clic derecho)
          </p>
        </div>

        <VideoChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={() => {
            setIsChoiceModalOpen(false);
            setDroppedVideoUrl(null);
          }}
          onChoice={handleVideoChoice}
          fileManagerVideoUrl={droppedVideoUrl}
        />
      </>
    );
  }

  return (
    <>
      <video
        src={properties.src}
        className="rounded-lg shadow-sm"
        controls
        style={{
          height: '400px',
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          backgroundColor: '#000',
          ...properties.style
        }}
      >
        Tu navegador no soporta el elemento de video.
      </video>

      <VideoChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => {
          setIsChoiceModalOpen(false);
          setDroppedVideoUrl(null);
        }}
        onChoice={handleVideoChoice}
        fileManagerVideoUrl={droppedVideoUrl}
      />
    </>
  );
};
