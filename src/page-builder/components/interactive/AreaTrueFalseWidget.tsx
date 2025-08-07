import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  CheckCircle, 
  XCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Heart, 
  Smile, 
  Frown, 
  AlertTriangle, 
  Minus, 
  Ban,
  RotateCcw
} from 'lucide-react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

interface AreaTrueFalseWidgetProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode?: boolean;
}

interface AreaTrueFalseExtendedProps {
  correctAnswer: boolean;
  userAnswer?: boolean;
  showResult?: boolean;
  allowRetry?: boolean;
  feedbackMessage?: string;
  clickableAreaText?: string;
  showInstructionText?: boolean;
  shakeOnWrong?: boolean;
  resultText?: {
    correct: string;
    incorrect: string;
  };
}

export const AreaTrueFalseWidget: React.FC<AreaTrueFalseWidgetProps> = ({
  element,
  isSelected,
  isPreviewMode = false
}) => {
  const { properties } = element;
  const { updateElement } = useBuilder();
  const extendedProps = properties as any;
  
  // Animation state
  const [isShaking, setIsShaking] = useState(false);
  
  // Get state from properties
  const hasAnswered = extendedProps.userAnswer !== undefined;
  const isCorrect = hasAnswered && extendedProps.userAnswer === extendedProps.correctAnswer;

  // Handle shake animation for wrong answers
  useEffect(() => {

    
    // Reset shake state first to ensure clean state
    if (!hasAnswered) {

      setIsShaking(false);
      return;
    }
    
    if (hasAnswered && !isCorrect && (extendedProps.shakeOnWrong === true || extendedProps.shakeOnWrong === 'true')) {

      setIsShaking(true);
      const shakeTimer = setTimeout(() => {

        setIsShaking(false);
        
        // Always auto-reset after shake animation (shake implies the user should try again)
        setTimeout(() => {

          updateElement(element.id, {
            properties: {
              ...properties,
              userAnswer: undefined
            }
          });
        }, 1000); // Wait 1 second after shake ends before auto-reset
      }, 600); // Shake animation duration
      
      return () => {
        clearTimeout(shakeTimer);
      };
    } else {
      // Reset shake state when conditions are not met


      
      // TEMPORARY: Force shake animation but allow disabling it
      // Check if shake is explicitly disabled
      const shakeExplicitlyDisabled = extendedProps.shakeOnWrong === false || 
                                    extendedProps.shakeOnWrong === 'false' ||
                                    (properties as any).shakeOnWrong === false ||
                                    (properties as any).shakeOnWrong === 'false';
      
      if (hasAnswered && !isCorrect && !shakeExplicitlyDisabled) {

        setIsShaking(true);
        const forceShakeTimer = setTimeout(() => {

          setIsShaking(false);
          
          // Auto-reset for testing
          setTimeout(() => {

            updateElement(element.id, {
              properties: {
                ...properties,
                userAnswer: undefined
              }
            });
          }, 1000);
        }, 600);
        
        return () => {
          clearTimeout(forceShakeTimer);
        };
      } else if (shakeExplicitlyDisabled) {

      }
      
      setIsShaking(false);
    }
  }, [hasAnswered, isCorrect, extendedProps.shakeOnWrong, extendedProps.userAnswer, element.id, properties, updateElement]);

  // Sync shake state when element properties change
  useEffect(() => {
    // Silent property synchronization
  }, [element.id, properties, extendedProps.shakeOnWrong]);

  // Debug logging


  // Handle area click
  const handleAreaClick = () => {
    if (isPreviewMode || hasAnswered) return;
    
    // Set the answer based on clickAnswersTrue setting
    const clickAnswer = extendedProps.clickAnswersTrue !== false; // Default to true
    
    // Update the element with user answer
    updateElement(element.id, {
      properties: {
        ...properties,
        userAnswer: clickAnswer
      }
    });
  };

  // Reset answer
  const resetAnswer = () => {
    // Force reset shake state immediately
    setIsShaking(false);
    
    // Reset answer
    updateElement(element.id, {
      properties: {
        ...properties,
        userAnswer: undefined
      }
    });
    
    // Additional safety reset after a short delay to handle any race conditions
    setTimeout(() => {
      setIsShaking(false);
    }, 50);
  };

  // Handle explicit reset of shake state when answer is cleared
  useEffect(() => {
    if (!hasAnswered && isShaking) {
      setIsShaking(false);
    }
  }, [hasAnswered, isShaking]);

  // Dynamic styling based on state
  const getAreaStyles = () => {
    // Check transparency from BOTH sources:
    // 1. Global layout properties: properties.backgroundColor === 'transparent'
    // 2. Widget-specific properties: extendedProps.isTransparent === true
    const isTransparentFromGlobal = properties.backgroundColor === 'transparent';
    const isTransparentFromWidget = extendedProps.isTransparent === true;
    const isTransparent = isTransparentFromGlobal || isTransparentFromWidget;
    
    // Debug transparency

    
    // Build border styles
    const showBorder = extendedProps.showBorder !== false;
    const borderWidth = extendedProps.borderWidth || 2;
    const borderStyle = extendedProps.borderStyle || 'dashed';
    const borderColor = extendedProps.borderColor || '#d1d5db';
    const borderRadius = extendedProps.borderRadius || 8;
    
    const baseStyles: React.CSSProperties = {
      width: properties.width || 300,
      height: properties.height || 200,
      backgroundColor: properties.backgroundColor || '#f3f4f6',
      border: showBorder ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
      borderRadius: `${borderRadius}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isPreviewMode || hasAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      padding: needsCompactLayout ? '12px 10px' : '20px',
      textAlign: 'center',
      // Add shake animation using transform
      transform: isShaking ? 'translateX(-10px)' : 'translateX(0)',
      animation: isShaking ? 'shake 0.6s ease-in-out' : undefined,
    } as React.CSSProperties;

    // Return base styles (hover will be handled via CSS classes if needed)
    if (!hasAnswered && !isPreviewMode) {
      return baseStyles;
    }

    // Result state styling
    if (hasAnswered && (extendedProps.showResult !== false)) {
      const resultBorderColor = isCorrect 
        ? (extendedProps.correctBorderColor || extendedProps.correctColor || '#10b981')
        : (extendedProps.incorrectBorderColor || extendedProps.incorrectColor || '#ef4444');
      const resultBorderWidth = extendedProps.resultBorderWidth || 3;
      
      // Determine background color logic
      let resultBackgroundColor = baseStyles.backgroundColor; // Start with original background
      
      if (properties.backgroundColor === 'transparent') {
        // Global transparency overrides everything (same logic as AudioTrueFalseWidget)
        resultBackgroundColor = 'transparent';
      } else {
        // Check if card background is configured
        const cardBackgroundTransparent = isCorrect 
          ? extendedProps.correctCardBackgroundTransparent === true
          : extendedProps.incorrectCardBackgroundTransparent === true;
        
        if (!cardBackgroundTransparent) {
          // Apply card background with RGBA
          const cardColor = isCorrect 
            ? (extendedProps.correctCardBackgroundColor || '#10b981')
            : (extendedProps.incorrectCardBackgroundColor || '#ef4444');
          const cardOpacity = isCorrect 
            ? (extendedProps.correctCardBackgroundOpacity !== undefined ? extendedProps.correctCardBackgroundOpacity : 0.1)
            : (extendedProps.incorrectCardBackgroundOpacity !== undefined ? extendedProps.incorrectCardBackgroundOpacity : 0.1);
          
          // Convert hex to RGBA
          const hexToRgba = (hex: string, alpha: number) => {
            // Handle both #ffffff and ffffff formats
            const cleanHex = hex.replace('#', '');
            const r = parseInt(cleanHex.slice(0, 2), 16);
            const g = parseInt(cleanHex.slice(2, 4), 16);
            const b = parseInt(cleanHex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };
          
          resultBackgroundColor = hexToRgba(cardColor, cardOpacity);

        }
      }
      
      return {
        ...baseStyles,
        backgroundColor: resultBackgroundColor,
        border: showBorder ? `${resultBorderWidth}px solid ${resultBorderColor}` : 'none'
      };
    }

    return baseStyles;
  };

  // Calculate if widget needs compact layout based on dimensions
  const needsCompactLayout = useMemo(() => {
    const width = parseInt(properties.width?.toString() || '300');
    const height = parseInt(properties.height?.toString() || '200');
    
    // Return true if either dimension is below threshold
    return width < 200 || height < 180;
  }, [properties.width, properties.height]);

  const iconOnlyLayout = useMemo(() => {
    const width = parseInt(properties.width?.toString() || '300');
    const height = parseInt(properties.height?.toString() || '200');
    return width < 100 || height < 100;
  }, [properties.width, properties.height]);

  // Calculate if widget is wider than it is tall
  const isWide = useMemo(() => {
    const width = parseInt(properties.width?.toString() || '300');
    const height = parseInt(properties.height?.toString() || '200');
    return width > height;
  }, [properties.width, properties.height]);

  // Debug compact layout
  useEffect(() => {
    // Silent layout monitoring
  }, [element.id, properties.width, properties.height, needsCompactLayout]);

  // Render custom icons based on type
  const renderIcon = (iconType: string, size: number, color: string, isCorrectIcon: boolean) => {
    const iconProps = { size, style: { color } };
    
    switch (iconType) {
      case 'check':
        return <Check {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'x':
        return <X {...iconProps} />;
      case 'x-circle':
        return <XCircle {...iconProps} />;
      case 'thumbs-up':
        return <ThumbsUp {...iconProps} />;
      case 'thumbs-down':
        return <ThumbsDown {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'smile':
        return <Smile {...iconProps} />;
      case 'frown':
        return <Frown {...iconProps} />;
      case 'alert-triangle':
        return <AlertTriangle {...iconProps} />;
      case 'minus':
        return <Minus {...iconProps} />;
      case 'ban':
        return <Ban {...iconProps} />;
      case 'none':
        return null;
      default:
        // Default fallback icons
        return isCorrectIcon ? <Check {...iconProps} /> : <X {...iconProps} />;
    }
  };

  // Render content based on state
  const renderContent = () => {
    // Get widget dimensions
    const width = parseInt(properties.width?.toString() || '300');
    const height = parseInt(properties.height?.toString() || '200');
    
    // Always show text, but scale it aggressively for small sizes
    const showText = extendedProps.showInstructionText !== false; // Default to true

    if (hasAnswered && (extendedProps.showResult !== false)) {
      const iconType = isCorrect 
        ? (extendedProps.correctIconType || 'check')
        : (extendedProps.incorrectIconType || 'x');
      // Aggressive icon scaling for very small sizes
      const baseIconSize = isCorrect 
        ? (extendedProps.correctIconSize || 32)
        : (extendedProps.incorrectIconSize || 32);
      let iconSize = baseIconSize;
      if (width < 120 || height < 100) {
        iconSize = Math.max(8, Math.floor(baseIconSize * 0.3));
      } else if (iconOnlyLayout) {
        iconSize = Math.max(12, Math.floor(baseIconSize * 0.5));
      } else if (needsCompactLayout) {
        iconSize = Math.max(16, Math.floor(baseIconSize * 0.7));
      }
      
      const iconColor = isCorrect 
        ? (extendedProps.correctIconColor || extendedProps.correctColor || '#10b981')
        : (extendedProps.incorrectIconColor || extendedProps.incorrectColor || '#ef4444');
      
      // Check if icon background should be transparent
      const iconBackgroundTransparent = isCorrect 
        ? extendedProps.correctBackgroundTransparent === true
        : extendedProps.incorrectBackgroundTransparent === true;
      
      // Determine layout direction for very small sizes
      const useHorizontalLayout = width < 120 && height < 100 && width > height;
      
      return (
        <div 
          className={`flex ${useHorizontalLayout ? 'flex-row' : 'flex-col'} items-center justify-center`}
          style={{ 
            gap: width < 120 || height < 100 ? '2px' : iconOnlyLayout ? '4px' : '8px',
            padding: width < 120 || height < 100 ? '2px' : '4px'
          }}
        >
          {/* Result Icon */}
          {iconType !== 'none' && (
            <div 
              className={`rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
              style={{
                backgroundColor: iconBackgroundTransparent ? 'transparent' : (isCorrect 
                  ? extendedProps.correctIconBg || '#dcfce7'
                  : extendedProps.incorrectIconBg || '#fee2e2'),
                padding: iconBackgroundTransparent ? '0' : (width < 120 || height < 100 ? '2px' : iconOnlyLayout ? '4px' : needsCompactLayout ? '8px' : '12px')
              }}
            >
              {renderIcon(iconType, iconSize, iconColor, isCorrect)}
            </div>
          )}

          {/* Result Text - Aggressively scaled for small sizes */}
          {showText && (
            <div 
              className="font-medium text-center"
              style={{
                color: isCorrect 
                  ? extendedProps.correctTextColor || '#059669'
                  : extendedProps.incorrectTextColor || '#dc2626',
                fontSize: width < 120 || height < 100 
                  ? '0.5rem' 
                  : iconOnlyLayout 
                  ? '0.6rem' 
                  : needsCompactLayout 
                  ? '0.8rem' 
                  : '1rem',
                fontFamily: extendedProps.resultFontFamily || 'inherit',
                lineHeight: '1.1',
                maxWidth: '100%',
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {isCorrect 
                ? extendedProps.correctText || '¡Correcto!'
                : extendedProps.incorrectText || 'Incorrecto'
              }
            </div>
          )}

          {/* Retry Button (icon only) - only show when allowRetry is enabled AND shake is disabled */}
          {extendedProps.allowRetry && !extendedProps.shakeOnWrong && (
            <button
              onClick={resetAnswer}
              title="Intentar de nuevo"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
              style={{
                backgroundColor: extendedProps.retryButtonColor || '#2563eb',
                padding: width < 120 || height < 100 ? '2px' : '6px',
                minWidth: width < 120 || height < 100 ? '16px' : '24px',
                minHeight: width < 120 || height < 100 ? '16px' : '24px'
              }}
            >
              <RotateCcw size={width < 120 || height < 100 ? 8 : iconOnlyLayout ? 12 : 16} />
            </button>
          )}
        </div>
      );
    }

    // Default clickable area content
    return (
      <div 
        className="flex flex-col items-center justify-center"
        style={{ 
          gap: width < 120 || height < 100 ? '2px' : '4px',
          padding: '2px'
        }}
      >
        {/* Instruction text - scaled for small sizes */}
        {showText && (
          <div 
            className="text-gray-600 font-medium text-center"
            style={{
              color: extendedProps.instructionTextColor || '#6b7280',
              fontSize: width < 120 || height < 100 
                ? '0.5rem' 
                : needsCompactLayout 
                ? '0.8rem'
                : '1rem',
              fontFamily: extendedProps.instructionFontFamily || 'inherit',
              lineHeight: '1.1',
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {extendedProps.clickableAreaText !== undefined ? extendedProps.clickableAreaText : 'Haz clic para responder'}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
          .shake-animation {
            animation: shake 0.6s ease-in-out;
          }
          .area-transparent,
          .area-transparent.area-true-false-widget,
          div.area-transparent.area-true-false-widget {
            background-color: transparent !important;
            background: transparent !important;
          }
        `}
      </style>
      
      <div
        className={`area-true-false-widget ${isSelected ? 'selected' : ''} ${isShaking ? 'shake-animation' : ''} ${properties.backgroundColor === 'transparent' ? 'area-transparent' : ''}`}
        style={getAreaStyles()}
        onClick={handleAreaClick}
        title={properties.title || 'Área Verdadero/Falso'}
        key={`${element.id}-${hasAnswered}-${JSON.stringify({
          correctCardBg: extendedProps.correctCardBackgroundColor,
          incorrectCardBg: extendedProps.incorrectCardBackgroundColor,
          correctOpacity: extendedProps.correctCardBackgroundOpacity,
          incorrectOpacity: extendedProps.incorrectCardBackgroundOpacity
        })}`}
      >
        {renderContent()}
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none" />
        )}
      </div>
    </>
  );
};
