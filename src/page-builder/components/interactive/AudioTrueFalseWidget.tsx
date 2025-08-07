import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TrueFalseButtons } from './common/TrueFalseButtons';
import { AudioWaveform, Play, Pause, RotateCcw, Volume2, VolumeX, Speaker, Music, Disc, Radio, Headphones, Mic } from 'lucide-react';
import type { Element } from '../../types';
import { AudioChoiceModal } from '../AudioChoiceModal';

interface AudioTrueFalseWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

type ButtonPosition = 'north' | 'south' | 'east' | 'west';

export const AudioTrueFalseWidget: React.FC<AudioTrueFalseWidgetProps> = ({ 
  element, 
  isSelected, 
  isPreviewMode,
  onUpdate 
}) => {
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [droppedAudioUrl, setDroppedAudioUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  const { properties } = element;
  const extendedProps = properties as any; // Type assertion for extended properties
  const hasAudio = properties.src && properties.src !== '';
  
  // Debug logging for re-renders and resize events

  
  const hasAnswered = extendedProps.userAnswer !== undefined;
  const isCorrect = extendedProps.userAnswer === extendedProps.correctAnswer;
  const showingResult = hasAnswered && extendedProps.showResult;

  // Button positioning - default to south
  const buttonPosition: ButtonPosition = extendedProps.buttonPosition || 'south';

  const handleAnswer = (answer: boolean) => {
    if (!isPreviewMode && (extendedProps.allowRetry || !hasAnswered)) {
      onUpdate?.({
        userAnswer: answer,
        showResult: true
      });
    }
  };

  const resetAnswer = () => {
    if (!isPreviewMode && extendedProps.allowRetry) {
      onUpdate?.({
        userAnswer: undefined,
        showResult: false
      });
    }
  };

  // Trigger border update when content state changes - SIMPLIFIED
  useEffect(() => {
    if (isSelected && widgetRef.current) {
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          const element = widgetRef.current;
          
          // Simple reflow trigger
          void element.offsetHeight;
          
          // Single resize event dispatch
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 150); // Increased delay to reduce frequency
      
      return () => clearTimeout(timer);
    }
  }, [showingResult, isSelected, element.id]);

  // Dynamic sizing logic
  const dynamicStyles = useMemo(() => {
    const widgetWidth = parseInt(element.properties.width?.toString() || '300');
    const widgetHeight = parseInt(element.properties.height?.toString() || '200');
    
    const needsCompactLayout = showingResult && (widgetHeight < 200 || widgetWidth < 250);
    
    const basePadding = Math.max(8, Math.min(16, widgetWidth * 0.04));
    // Main gap between audio icon and buttons/result (fixed calculation)
    const baseGap = needsCompactLayout ? Math.max(6, basePadding * 0.5) : Math.max(10, basePadding * 0.75);
    
    return {
      padding: `${basePadding}px`,
      gap: `${baseGap}px`,
      needsCompactLayout
    };
  }, [element.properties.width, element.properties.height, showingResult]);

  const handleAudioSelect = (src: string, title?: string) => {
    onUpdate?.({
      src,
      title: title || 'Audio'
    });
  };

  const handleAudioChoice = (useAsBackground: boolean, audioUrl?: string) => {
    const finalAudioUrl = audioUrl || droppedAudioUrl;
    if (finalAudioUrl) {
      handleAudioSelect(finalAudioUrl, 'Audio');
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

  // Button style builder (similar to ElementRenderer button logic)
  const buildButtonStyles = (buttonType: 'true' | 'false'): React.CSSProperties => {
    const buttonProps = buttonType === 'true' ? extendedProps.trueButton : extendedProps.falseButton;
    const baseColor = buttonType === 'true' ? '#059669' : '#dc2626'; // green-600 : red-600
    
    // Build border styles from button properties
    const buildBorderStyles = () => {
      const borderStyles: React.CSSProperties = {};
      
      const borderWidth = buttonProps?.borderWidth || 0;
      const borderColor = buttonProps?.borderColor || '#e2e8f0';
      const borderStyleValue = buttonProps?.borderStyle || 'solid';

      // Apply individual borders if specified, otherwise use unified border
      if (buttonProps?.borderTopWidth !== undefined || buttonProps?.borderTopColor || buttonProps?.borderTopStyle) {
        borderStyles.borderTop = `${buttonProps.borderTopWidth ?? borderWidth}px ${buttonProps.borderTopStyle ?? borderStyleValue} ${buttonProps.borderTopColor ?? borderColor}`;
      }
      if (buttonProps?.borderRightWidth !== undefined || buttonProps?.borderRightColor || buttonProps?.borderRightStyle) {
        borderStyles.borderRight = `${buttonProps.borderRightWidth ?? borderWidth}px ${buttonProps.borderRightStyle ?? borderStyleValue} ${buttonProps.borderRightColor ?? borderColor}`;
      }
      if (buttonProps?.borderBottomWidth !== undefined || buttonProps?.borderBottomColor || buttonProps?.borderBottomStyle) {
        borderStyles.borderBottom = `${buttonProps.borderBottomWidth ?? borderWidth}px ${buttonProps.borderBottomStyle ?? borderStyleValue} ${buttonProps.borderBottomColor ?? borderColor}`;
      }
      if (buttonProps?.borderLeftWidth !== undefined || buttonProps?.borderLeftColor || buttonProps?.borderLeftStyle) {
        borderStyles.borderLeft = `${buttonProps.borderLeftWidth ?? borderWidth}px ${buttonProps.borderLeftStyle ?? borderStyleValue} ${buttonProps.borderLeftColor ?? borderColor}`;
      }

      // If no individual borders are set and borderWidth > 0, use unified border
      if (!borderStyles.borderTop && !borderStyles.borderRight && !borderStyles.borderBottom && !borderStyles.borderLeft && borderWidth > 0) {
        borderStyles.border = `${borderWidth}px ${borderStyleValue} ${borderColor}`;
      }

      return borderStyles;
    };
    
    if (!hasAnswered || !extendedProps.showResult) {
      // Default state
      return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: buttonProps?.textDecoration || 'none',
        outline: 'none',
        userSelect: 'none',
        backgroundColor: buttonProps?.backgroundColor || baseColor,
        color: buttonProps?.color || '#ffffff',
        ...buildBorderStyles(),
        borderRadius: typeof buttonProps?.borderRadius === 'number' ? `${buttonProps.borderRadius}px` : (buttonProps?.borderRadius || '6px'),
        padding: buttonProps?.padding || (dynamicStyles.needsCompactLayout ? '6px 12px' : '8px 16px'),
        fontSize: typeof buttonProps?.fontSize === 'number' ? `${buttonProps.fontSize}px` : (buttonProps?.fontSize || (dynamicStyles.needsCompactLayout ? '12px' : '14px')),
        fontWeight: buttonProps?.fontWeight || '500',
        fontFamily: buttonProps?.fontFamily || 'inherit',
        fontStyle: buttonProps?.fontStyle || 'normal',
        textTransform: buttonProps?.textTransform || 'none',
        textAlign: buttonProps?.textAlign || 'center',
        lineHeight: buttonProps?.lineHeight || '1.5',
        letterSpacing: buttonProps?.letterSpacing || 'normal',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: dynamicStyles.needsCompactLayout ? '60px' : '80px',
        ...(buttonProps?.customCSS || {}),
      };
    }

    // Answer state - use custom assertion styling
    const userSelectedThis = extendedProps.userAnswer === (buttonType === 'true');
    const isCorrectAnswer = extendedProps.correctAnswer === (buttonType === 'true');
    
    let backgroundColor = buttonProps?.backgroundColor || baseColor;
    let additionalStyles: React.CSSProperties = {};
    let opacity = 1;
    
    // Check if user wants to keep original styling (only subtle indicators)
    const keepOriginalStyling = buttonProps?.keepOriginalStyling === true;
    const showIndicator = buttonProps?.showIndicator !== false;
    
    if (keepOriginalStyling) {
      // Keep original colors, only add subtle indicators
      backgroundColor = buttonProps?.backgroundColor || baseColor;
      
      if (showIndicator) {
        if (userSelectedThis) {
          // Add subtle indicator for user's selection
          additionalStyles.boxShadow = isCorrect 
            ? '0 0 0 2px #10b981, 0 4px 12px rgba(16, 185, 129, 0.3)' // green border for correct
            : '0 0 0 2px #ef4444, 0 4px 12px rgba(239, 68, 68, 0.3)'; // red border for incorrect
        } else if (isCorrectAnswer && !isCorrect) {
          // Show correct answer with subtle green glow
          additionalStyles.boxShadow = '0 0 0 2px #10b981, 0 4px 12px rgba(16, 185, 129, 0.2)';
        }
      }
      
      // Apply unselected opacity if this button wasn't selected
      if (!userSelectedThis && !isCorrectAnswer) {
        opacity = buttonProps?.unselectedOpacity !== undefined ? buttonProps.unselectedOpacity : 1;
      }
    } else {
      // Use custom assertion colors
      if (userSelectedThis) {
        // User selected this button
        if (isCorrect) {
          backgroundColor = buttonProps?.correctColor === 'original' 
            ? (buttonProps?.backgroundColor || baseColor)
            : (buttonProps?.correctColor || '#059669');
        } else {
          backgroundColor = buttonProps?.incorrectColor === 'original'
            ? (buttonProps?.backgroundColor || baseColor)
            : (buttonProps?.incorrectColor || '#dc2626');
        }
        
        // Add indicator if enabled
        if (showIndicator) {
          additionalStyles.boxShadow = isCorrect 
            ? '0 0 0 2px #10b981, 0 4px 12px rgba(16, 185, 129, 0.3)'
            : '0 0 0 2px #ef4444, 0 4px 12px rgba(239, 68, 68, 0.3)';
        }
      } else if (isCorrectAnswer && !isCorrect) {
        // Show correct answer when user was wrong
        backgroundColor = buttonProps?.correctColor === 'original'
          ? (buttonProps?.backgroundColor || baseColor)
          : (buttonProps?.correctColor || '#059669');
          
        if (showIndicator) {
          additionalStyles.boxShadow = '0 0 0 2px #10b981, 0 4px 12px rgba(16, 185, 129, 0.2)';
        }
      } else {
        // This button was not selected and is not the correct answer
        backgroundColor = buttonProps?.unselectedColor === 'original'
          ? (buttonProps?.backgroundColor || baseColor)
          : (buttonProps?.unselectedColor || '#6b7280');
          
        opacity = buttonProps?.unselectedOpacity !== undefined ? buttonProps.unselectedOpacity : 1;
      }
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: buttonProps?.textDecoration || 'none',
      outline: 'none',
      userSelect: 'none',
      backgroundColor,
      color: buttonProps?.color || '#ffffff',
      opacity,
      ...buildBorderStyles(),
      borderRadius: typeof buttonProps?.borderRadius === 'number' ? `${buttonProps.borderRadius}px` : (buttonProps?.borderRadius || '6px'),
      padding: buttonProps?.padding || (dynamicStyles.needsCompactLayout ? '6px 12px' : '8px 16px'),
      fontSize: typeof buttonProps?.fontSize === 'number' ? `${buttonProps.fontSize}px` : (buttonProps?.fontSize || (dynamicStyles.needsCompactLayout ? '12px' : '14px')),
      fontWeight: buttonProps?.fontWeight || '500',
      fontFamily: buttonProps?.fontFamily || 'inherit',
      fontStyle: buttonProps?.fontStyle || 'normal',
      textTransform: buttonProps?.textTransform || 'none',
      textAlign: buttonProps?.textAlign || 'center',
      lineHeight: buttonProps?.lineHeight || '1.5',
      letterSpacing: buttonProps?.letterSpacing || 'normal',
      cursor: hasAnswered && !extendedProps.allowRetry ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
      minWidth: dynamicStyles.needsCompactLayout ? '60px' : '80px',
      ...additionalStyles,
      ...(buttonProps?.customCSS || {}),
    };
  };

  const renderAudioIcon = () => {
    // Get icon customization properties with defaults
    const iconType = extendedProps.iconType || 'audio-waveform';
    const iconSize = extendedProps.iconSize || 20;
    const buttonSize = extendedProps.buttonSize || 48;
    const iconColor = extendedProps.iconColor || '#ffffff';
    const backgroundColor = isPlaying 
      ? extendedProps.playingColor || '#7c3aed'
      : extendedProps.backgroundColor || '#4b5563';
    
    // Get icon component based on type - same logic as AudioWidget
    const getIconComponent = (isPlaying: boolean) => {
      const iconProps = { size: iconSize, style: { color: iconColor } };
      
      // Always show the selected icon type, only show Pause when actively playing
      if (hasAudio && isPlaying) {
        return <Pause {...iconProps} />;
      }

      // Show the selected icon type (even when audio is loaded but not playing)
      switch (iconType) {
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
    
    return (
      <div 
        onClick={hasAudio ? togglePlayPause : undefined}
        className={`
          inline-flex items-center justify-center transition-all duration-200
          ${hasAudio ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
          ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          backgroundColor,
          borderRadius: '50%',
          boxShadow: isPlaying ? `0 8px 25px ${backgroundColor}40` : 'none'
        }}
        title={properties.title || 'Audio'}
      >
        {getIconComponent(isPlaying)}
      </div>
    );
  };

  const renderButtons = () => {
    const customButtonGap = (element.properties as any).gap || 8;
    const buttonPadding = dynamicStyles.needsCompactLayout ? '6px 12px' : '8px 16px';
    const buttonFontSize = dynamicStyles.needsCompactLayout ? '0.8rem' : '1rem';

    return (
      <div
        className={`flex ${buttonPosition === 'north' || buttonPosition === 'south' ? 'flex-col' : 'flex-row'}`}
        style={{ gap: `${customButtonGap}px` }}
      >
        <TrueFalseButtons
          properties={extendedProps}
          isPreviewMode={isPreviewMode}
          hasAnswered={hasAnswered}
          isCorrect={isCorrect}
          showingResult={showingResult}
          dynamicStyles={{
            gap: customButtonGap,
            buttonPadding,
            buttonFontSize,
            needsCompactLayout: dynamicStyles.needsCompactLayout,
          }}
          onAnswer={handleAnswer}
          onReset={extendedProps.allowRetry ? resetAnswer : undefined}
        />
      </div>
    );
  };

  const getLayoutStyles = () => {
    const styles = (() => {
      switch (buttonPosition) {
        case 'north':
          return {
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: dynamicStyles.gap,
          };
        case 'south':
          return {
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: dynamicStyles.gap,
          };
        case 'east':
          return {
            flexDirection: 'row' as const,
            alignItems: 'center',
            gap: dynamicStyles.gap,
          };
        case 'west':
          return {
            flexDirection: 'row' as const,
            alignItems: 'center',
            gap: dynamicStyles.gap,
          };
        default:
          return {
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: dynamicStyles.gap,
          };
      }
    })();
    
    return styles;
  };

  if (!hasAudio) {
    return (
      <>
        <div
          ref={widgetRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-full min-h-[150px] border-2 border-dashed rounded-lg 
            flex flex-col items-center justify-center transition-all
            hover:border-purple-400 hover:bg-purple-50/10 group
            ${isDragOver 
              ? 'border-purple-500 bg-purple-50/20 border-solid scale-[1.02]' 
              : 'border-gray-300'
            }
            ${isSelected ? 'border-purple-500' : ''}
          `}
          style={{
            padding: dynamicStyles.padding,
            backgroundColor: properties.backgroundColor || '#f8fafc',
            borderRadius: typeof properties.borderRadius === 'number' ? `${properties.borderRadius}px` : properties.borderRadius,
            border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
          }}
        >
          <AudioWaveform size={48} className="text-gray-400 group-hover:text-purple-400 transition-colors mb-2" />
          <p className="text-sm text-gray-500 group-hover:text-gray-700 font-medium">
            Arrastra un audio aquí
          </p>
          <p className="text-xs text-gray-400 mt-1">
            para crear widget Audio Verdadero/Falso
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
      <div 
        ref={widgetRef}
        className={`audio-true-false-widget ${properties.className || ''}`}
        style={{
          display: 'inline-flex',
          padding: dynamicStyles.padding,
          backgroundColor: properties.backgroundColor || '#f8fafc',
          borderRadius: typeof properties.borderRadius === 'number' ? `${properties.borderRadius}px` : properties.borderRadius,
          border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
          ...getLayoutStyles(),
          boxSizing: 'border-box'
        }}
      >
        {/* Render audio icon and buttons in the correct order based on position */}
        {buttonPosition === 'north' && renderButtons()}
        {buttonPosition === 'west' && renderButtons()}
        
        {renderAudioIcon()}
        
        {buttonPosition === 'east' && renderButtons()}
        {buttonPosition === 'south' && renderButtons()}

        {/* Result and Feedback */}
        {hasAnswered && extendedProps.showResult && (properties as any).showResultText !== false && (
          <div 
            className="text-center mt-2"
            style={{
              fontSize: (properties as any).resultFontSize || (dynamicStyles.needsCompactLayout ? '0.8rem' : '0.9rem'),
              fontFamily: (properties as any).resultFontFamily || 'inherit',
              fontWeight: (properties as any).resultFontWeight || '500',
              fontStyle: (properties as any).resultFontStyle || 'normal',
              textDecoration: (properties as any).resultTextDecoration || 'none',
              textTransform: (properties as any).resultTextTransform || 'none',
              textAlign: (properties as any).resultTextAlign || 'center',
              lineHeight: (properties as any).resultLineHeight || '1.5',
              letterSpacing: (properties as any).resultLetterSpacing || 'normal',
              maxWidth: '100%'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span 
                style={{
                  color: isCorrect 
                    ? (properties as any).correctTextColor || '#059669'
                    : (properties as any).incorrectTextColor || '#dc2626'
                }}
              >
                {isCorrect 
                  ? (properties as any).correctText || '¡Correcto!' 
                  : (properties as any).incorrectText || 'Incorrecto'
                }
              </span>
              {extendedProps.allowRetry && (
                <button
                  onClick={resetAnswer}
                  className="inline-flex items-center justify-center w-5 h-5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                  title="Intentar de nuevo"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
            {extendedProps.feedbackMessage && (
              <div 
                className="text-gray-600 text-xs"
                style={{
                  lineHeight: '1.3',
                  maxHeight: '2em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {extendedProps.feedbackMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      {hasAudio && (
        <audio
          ref={audioRef}
          src={properties.src}
          onEnded={handleAudioEnded}
          onPause={handleAudioPause}
          onPlay={handleAudioPlay}
          style={{ display: 'none' }}
        />
      )}

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
