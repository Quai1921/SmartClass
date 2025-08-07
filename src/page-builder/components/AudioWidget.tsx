import React, { useState, useRef, useMemo } from 'react';
import { 
  AudioWaveform, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Speaker, 
  Music, 
  Disc, 
  Radio, 
  Headphones,
  Mic
} from 'lucide-react';
import type { Element } from '../types';
import { AudioChoiceModal } from './AudioChoiceModal';

interface AudioWidgetProps {
  element: Element;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const AudioWidget: React.FC<AudioWidgetProps> = ({ element, isSelected, onUpdate }) => {
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [droppedAudioUrl, setDroppedAudioUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { properties } = element;
  const extendedProps = properties as any; // Type assertion for extended properties
  const hasAudio = Boolean(properties.src && properties.src.trim() !== '');

  // Get customization properties with defaults
  const iconType = extendedProps.iconType || 'audio-waveform';
  const iconSize = extendedProps.iconSize || 20;
  const buttonSize = extendedProps.buttonSize || 48;
  const backgroundColor = extendedProps.backgroundColor || '#4b5563';
  const playingColor = extendedProps.playingColor || '#7c3aed';
  const iconColor = extendedProps.iconColor || '#ffffff';
  const borderRadius = extendedProps.borderRadius !== undefined ? extendedProps.borderRadius : 50;
  const borderWidth = extendedProps.borderWidth || 0;
  const borderColor = extendedProps.borderColor || '#e2e8f0';
  const borderStyle = extendedProps.borderStyle || 'solid';

  // Get icon component based on type - memoized to ensure re-renders
  const getIconComponent = useMemo(() => {
    return (isPlaying: boolean) => {
      const iconProps = { size: iconSize, style: { color: iconColor } };
      
      // Always show the selected icon type, regardless of hasAudio
      // Only show Play/Pause when actively playing and user wants that behavior
      if (hasAudio && isPlaying) {
        return <Pause {...iconProps} />;
      }

      // Show the selected icon type (even when audio is loaded but not playing)
      switch (iconType) {
        case 'play':
          return <Play {...iconProps} />;
        case 'volume2':
          return <Volume2 {...iconProps} />;
        case 'volume-x':
          return <VolumeX {...iconProps} />;
        case 'speaker':
          return <Speaker {...iconProps} />;
        case 'music':
          return <Music {...iconProps} />;
        case 'disc':
          return <Disc {...iconProps} />;
        case 'radio':
          return <Radio {...iconProps} />;
        case 'headphones':
          return <Headphones {...iconProps} />;
        case 'mic':
          return <Mic {...iconProps} />;
        case 'audio-waveform':
        default:
          return <AudioWaveform {...iconProps} />;
      }
    };
  }, [hasAudio, iconType, iconSize, iconColor]);

  // Calculate border styles
  const getBorderStyles = () => {
    const width = typeof borderWidth === 'number' ? borderWidth : parseInt(borderWidth) || 0;
    if (width > 0) {
      return {
        border: `${width}px ${borderStyle} ${borderColor}`
      };
    }
    return {};
  };

  const handleAudioSelect = (src: string, title?: string) => {
    onUpdate?.({
      src,
      title: title || 'Audio'
    });
  };

  const handleAudioChoice = (useAsBackground: boolean, audioUrl?: string) => {
    const finalAudioUrl = audioUrl || droppedAudioUrl;
    if (finalAudioUrl) {
      if (useAsBackground) {
        // Handle background audio logic here
        // For now, we'll treat it as a regular audio since background audio might need container context
        handleAudioSelect(finalAudioUrl, 'Background Audio');
      } else {
        // Handle as element
        handleAudioSelect(finalAudioUrl, 'Audio');
      }
    }
    setDroppedAudioUrl(null);
    setIsChoiceModalOpen(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      const audioUrl = URL.createObjectURL(audioFile);
      setDroppedAudioUrl(audioUrl);
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

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        // console.error('Error playing audio:', error);
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  if (!hasAudio) {
    return (
      <>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            audio-widget-dropzone
            relative w-full min-h-[150px] border-2 border-dashed rounded-lg 
            flex flex-col items-center justify-center transition-all
            hover:border-purple-400 hover:bg-purple-50/10 group
            ${isDragOver 
              ? 'drag-over border-purple-500 bg-purple-50/20 border-solid scale-[1.02]' 
              : 'border-gray-300'
            }
            ${isSelected ? 'border-purple-500' : ''}
          `}
        >
          {getIconComponent(false)}
          <p className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
            Arrastra un audio aquí
          </p>
          <p className="text-xs text-gray-400 mt-1">
            o usa el menú contextual (clic derecho)
          </p>
        </div>

        <AudioChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={() => {
            setIsChoiceModalOpen(false);
            setDroppedAudioUrl(null);
          }}
          onChoice={handleAudioChoice}
          fileManagerAudioUrl={droppedAudioUrl}
        />
      </>
    );
  }

  return (
    <>
      {/* Size-constraining wrapper */}
      <div 
        key={`audio-widget-${iconType}-${buttonSize}-${iconSize}`}
        style={{
          width: `${buttonSize * 1.2}px`,
          height: `${buttonSize * 1.2}px`,
          minWidth: `${buttonSize * 1.2}px`,
          minHeight: `${buttonSize * 1.2}px`,
          maxWidth: `${buttonSize * 1.2}px`,
          maxHeight: `${buttonSize * 1.2}px`,
          display: 'inline-block',
          flexShrink: 0,
          overflow: 'visible',
          position: 'relative'
        }}
      >
        {/* Customizable Audio Icon Widget */}
        <div 
          key={`audio-button-${iconType}-${backgroundColor}-${iconColor}-${borderRadius}`}
          onClick={togglePlayPause}
          className={`
            audio-widget-button
            inline-flex items-center justify-center
            cursor-pointer
            transition-all duration-200 hover:scale-110
            ${isPlaying ? 'playing' : ''}
            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          `}
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            backgroundColor: isPlaying ? playingColor : backgroundColor,
            borderRadius: `${borderRadius}%`,
            boxShadow: isPlaying ? `0 8px 25px ${playingColor}40` : 'none',
            ...getBorderStyles(),
            flexShrink: 0,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          title={properties.title || 'Audio'}
        >
          {getIconComponent(isPlaying)}
        </div>
      </div>

      {/* Hidden audio element for playback control */}
      <audio
        ref={audioRef}
        src={properties.src}
        onEnded={handleAudioEnded}
        onPause={handleAudioPause}
        onPlay={handleAudioPlay}
        style={{ display: 'none' }}
      />

      <AudioChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => {
          setIsChoiceModalOpen(false);
          setDroppedAudioUrl(null);
        }}
        onChoice={handleAudioChoice}
        fileManagerAudioUrl={droppedAudioUrl}
      />
    </>
  );
};
