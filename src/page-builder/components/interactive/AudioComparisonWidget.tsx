import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Element } from '../../types';
import { AudioWidget } from '../AudioWidget';

interface AudioComparisonWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const AudioComparisonWidget: React.FC<AudioComparisonWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate
}) => {
  const properties = element.properties;
  const hasAnswered = properties.userAnswer !== undefined;
  const isCorrect = properties.userAnswer === properties.correctAnswer;
  const showingResult = hasAnswered && properties.showResult;
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<'audioA' | 'audioB' | null>(null);

  const handleAnswer = (answer: boolean) => {
    if (!isPreviewMode && (properties.allowRetry || !hasAnswered)) {
      onUpdate?.({
        userAnswer: answer,
        showResult: true
      });
    }
  };

  const resetAnswer = () => {
    if (!isPreviewMode && properties.allowRetry) {
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
          // Simple reflow trigger
          const element = widgetRef.current;
          void element.offsetHeight;
          
          // Single resize event dispatch
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 150); // Increased delay to reduce frequency
      
      return () => clearTimeout(timer);
    }
  }, [showingResult, isSelected, element.id]);

  const handleAudioAClick = () => {
    if (!isPreviewMode && !hasAnswered) {
      handleAnswer(true); // Audio A = True
    }
  };

  const handleAudioBClick = () => {
    if (!isPreviewMode && !hasAnswered) {
      handleAnswer(false); // Audio B = False
    }
  };

  // Helper function to handle audio widget property updates
  const handleAudioWidgetUpdate = (updates: any, audioType: 'true' | 'false') => {
    if (updates.src) {
      onUpdate?.({ [`${audioType}AudioUrl`]: updates.src });
    }
    
    // Update audio-specific styling properties
    if (updates.iconType) onUpdate?.({ audioIconType: updates.iconType });
    if (updates.iconSize) onUpdate?.({ audioIconSize: updates.iconSize });
    if (updates.buttonSize) onUpdate?.({ audioButtonSize: updates.buttonSize });
    if (updates.backgroundColor) onUpdate?.({ audioBackgroundColor: updates.backgroundColor });
    if (updates.playingColor) onUpdate?.({ audioPlayingColor: updates.playingColor });
    if (updates.iconColor) onUpdate?.({ audioIconColor: updates.iconColor });
    if (updates.borderRadius) onUpdate?.({ audioBorderRadius: updates.borderRadius });
    if (updates.borderWidth) onUpdate?.({ audioBorderWidth: updates.borderWidth });
    if (updates.borderColor) onUpdate?.({ audioBorderColor: updates.borderColor });
    if (updates.borderStyle) onUpdate?.({ audioBorderStyle: updates.borderStyle });
  };

  const getAudioCardStyles = (isSelected: boolean, isCorrect: boolean | null, isHovered: boolean = false) => {
    const baseStyles = {
      cursor: isPreviewMode || hasAnswered ? 'default' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      border: `${properties.cardBorderWidth || 2}px solid`,
      borderRadius: typeof properties.cardBorderRadius === 'number' ? `${properties.cardBorderRadius}px` : '12px',
      padding: typeof properties.cardPadding === 'number' ? `${properties.cardPadding}px` : '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '16px',
      minHeight: typeof properties.cardMinHeight === 'number' ? `${properties.cardMinHeight}px` : '180px',
      justifyContent: 'flex-start',
      width: '100%',
      maxWidth: typeof properties.cardMaxWidth === 'number' ? `${properties.cardMaxWidth}px` : '200px',
      boxSizing: 'border-box' as const,
      overflow: 'visible'
    };

    if (showingResult && isCorrect !== null) {
      return {
        ...baseStyles,
        backgroundColor: isCorrect 
          ? (properties.cardCorrectBackgroundColor || '#dcfce7')
          : (properties.cardIncorrectBackgroundColor || '#fee2e2'),
        borderColor: isCorrect 
          ? (properties.cardCorrectBorderColor || '#22c55e')
          : (properties.cardIncorrectBorderColor || '#ef4444'),
        transform: properties.cardAnsweredTransform || 'scale(1.02)'
      };
    }

    // Apply hover effects if not in preview mode and not answered
    if (isHovered && !isPreviewMode && !hasAnswered) {
      return {
        ...baseStyles,
        backgroundColor: properties.cardHoverBackgroundColor || '#ffffff',
        borderColor: properties.cardHoverBorderColor || '#3b82f6',
        transform: properties.cardHoverTransform || 'scale(1.02)',
        boxShadow: properties.cardHoverShadow || '0 4px 12px rgba(59, 130, 246, 0.15)'
      };
    }

    return {
      ...baseStyles,
      backgroundColor: properties.cardBackgroundColor || 'transparent',
      borderColor: isSelected 
        ? '#3b82f6' 
        : (properties.cardBorderColor || '#e2e8f0')
    };
  };

  // Separate container styling from audio widget styling
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '0',
    backgroundColor: properties.containerBackgroundColor || 'transparent',
    borderRadius: '0',
    border: 'none',
    boxSizing: 'border-box' as const
  };

  // Audio widget specific styling properties
  const audioWidgetProps = {
    iconType: properties.audioIconType || 'audio-waveform',
    iconSize: properties.audioIconSize || 20,
    buttonSize: properties.audioButtonSize || 48,
    backgroundColor: properties.audioBackgroundColor || '#4b5563',
    playingColor: properties.audioPlayingColor || '#7c3aed',
    iconColor: properties.audioIconColor || '#ffffff',
    borderRadius: typeof properties.audioBorderRadius === 'number' ? properties.audioBorderRadius : 50,
    borderWidth: typeof properties.audioBorderWidth === 'number' ? properties.audioBorderWidth : 0,
    borderColor: properties.audioBorderColor || '#e2e8f0',
    borderStyle: (properties.audioBorderStyle as 'solid' | 'dashed' | 'dotted' | 'double' | 'none') || 'solid'
  };

  return (
    <div 
      ref={widgetRef}
      className={`audio-comparison-widget ${properties.className || ''}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        backgroundColor: properties.containerBackgroundColor || 'transparent',
        border: 'none',
        padding: '0',
        margin: '0'
      }}
    >
      {/* Audio Cards Container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: typeof properties.cardGap === 'number' ? `${properties.cardGap}px` : '16px' 
      }}>
        {/* Audio A Card (True) */}
        <div
          style={getAudioCardStyles(
            hasAnswered && properties.userAnswer === true,
            showingResult ? properties.userAnswer === true : null,
            hoveredCard === 'audioA'
          )}
          onClick={handleAudioAClick}
          onMouseEnter={() => setHoveredCard('audioA')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="text-center"
            style={{
              width: '100%',
              overflow: 'visible',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              minHeight: '60px'
            }}
          >
            <h3 
              className="mb-1"
              style={{
                fontFamily: properties.cardTitleFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.cardTitleFontFamily || 'inherit',
                fontSize: typeof properties.cardTitleFontSize === 'number' ? `${properties.cardTitleFontSize}px` : '18px',
                fontWeight: properties.cardTitleFontWeight || '600',
                color: properties.cardTitleColor || '#3b82f6',
                textAlign: 'center',
                margin: '0',
                padding: '0',
                overflow: 'visible',
                width: '100%',
                display: 'block'
              }}
            >
              Audio A
            </h3>
            <p 
              style={{
                fontFamily: properties.cardSubtitleFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.cardSubtitleFontFamily || 'inherit',
                fontSize: typeof properties.cardSubtitleFontSize === 'number' ? `${properties.cardSubtitleFontSize}px` : '14px',
                fontWeight: properties.cardSubtitleFontWeight || '400',
                color: properties.cardSubtitleColor || '#6b7280',
                textAlign: 'center',
                margin: '0',
                padding: '0',
                overflow: 'visible',
                width: '100%',
                display: 'block'
              }}
            >
              Escuchar Audio
            </p>
          </div>
          
          <div style={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '16px',
            overflow: 'visible',
            minHeight: '80px'
          }}>
            <AudioWidget
              element={{
                ...element,
                properties: {
                  ...element.properties,
                  src: properties.trueAudioUrl || '',
                  title: 'Audio A',
                  // Use audio-specific styling properties
                  ...audioWidgetProps
                } as any
              }}
              isSelected={false}
                        onUpdate={(updates) => handleAudioWidgetUpdate(updates, 'true')}
            />
          </div>
        </div>

        {/* Audio B Card (False) */}
        <div
          style={getAudioCardStyles(
            hasAnswered && properties.userAnswer === false,
            showingResult ? properties.userAnswer === false : null,
            hoveredCard === 'audioB'
          )}
          onClick={handleAudioBClick}
          onMouseEnter={() => setHoveredCard('audioB')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="text-center"
            style={{
              width: '100%',
              overflow: 'visible',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              minHeight: '60px'
            }}
          >
            <h3 
              className="mb-1"
              style={{
                fontFamily: properties.cardTitleFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.cardTitleFontFamily || 'inherit',
                fontSize: typeof properties.cardTitleFontSize === 'number' ? `${properties.cardTitleFontSize}px` : '18px',
                fontWeight: properties.cardTitleFontWeight || '600',
                color: properties.cardTitleColor || '#3b82f6',
                textAlign: 'center',
                margin: '0',
                padding: '0',
                overflow: 'visible',
                width: '100%',
                display: 'block'
              }}
            >
              Audio B
            </h3>
            <p 
              style={{
                fontFamily: properties.cardSubtitleFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.cardSubtitleFontFamily || 'inherit',
                fontSize: typeof properties.cardSubtitleFontSize === 'number' ? `${properties.cardSubtitleFontSize}px` : '14px',
                fontWeight: properties.cardSubtitleFontWeight || '400',
                color: properties.cardSubtitleColor || '#6b7280',
                textAlign: 'center',
                margin: '0',
                padding: '0',
                overflow: 'visible',
                width: '100%',
                display: 'block'
              }}
            >
              Escuchar Audio
            </p>
          </div>
          
          <div style={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '16px',
            overflow: 'visible',
            minHeight: '80px'
          }}>
            <AudioWidget
              element={{
                ...element,
                properties: {
                  ...element.properties,
                  src: properties.falseAudioUrl || '',
                  title: 'Audio B',
                  // Use audio-specific styling properties
                  ...audioWidgetProps
              } as any
              }}
              isSelected={false}
                        onUpdate={(updates) => handleAudioWidgetUpdate(updates, 'false')}
            />
          </div>
        </div>
      </div>

      {/* Result and Feedback */}
      {hasAnswered && properties.showResult && (
        <div 
          className="text-center p-3 bg-gray-50 rounded-lg"
          style={{
            fontSize: '0.9rem',
            fontFamily: properties.fontFamily || 'inherit',
            fontWeight: properties.fontWeight || '500',
            fontStyle: properties.fontStyle || 'normal',
            textDecoration: properties.textDecoration || 'none',
            textTransform: properties.textTransform || 'none',
            textAlign: properties.textAlign || 'center',
            lineHeight: properties.lineHeight || '1.5',
            letterSpacing: properties.letterSpacing || 'normal',
            maxWidth: '100%'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span 
              style={{
                fontFamily: properties.resultTextFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.resultTextFontFamily || 'inherit',
                fontSize: typeof properties.resultTextFontSize === 'number' ? `${properties.resultTextFontSize}px` : '14px',
                fontWeight: properties.resultTextFontWeight || '500',
                color: properties.resultTextColor || (isCorrect ? '#059669' : '#dc2626'),
                textAlign: properties.resultTextTextAlign || 'center'
              }}
            >
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </span>
            {properties.allowRetry && (
              <button
                onClick={resetAnswer}
                className="inline-flex items-center justify-center w-5 h-5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                title="Intentar de nuevo"
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>
          {properties.feedbackMessage && (
            <div 
              style={{
                fontFamily: properties.feedbackTextFontFamily === 'grilledcheese' ? 'grilledcheese' : properties.feedbackTextFontFamily || 'inherit',
                fontSize: typeof properties.feedbackTextFontSize === 'number' ? `${properties.feedbackTextFontSize}px` : '12px',
                fontWeight: properties.feedbackTextFontWeight || '400',
                color: properties.feedbackTextColor || '#6b7280',
                textAlign: properties.feedbackTextTextAlign || 'center',
                lineHeight: '1.3',
                maxHeight: '2em',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {properties.feedbackMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
