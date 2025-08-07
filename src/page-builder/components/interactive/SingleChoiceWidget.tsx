import React, { useState } from 'react';
import type { Element } from '../../types';

interface SingleChoiceWidgetProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode?: boolean;
}

export const SingleChoiceWidget: React.FC<SingleChoiceWidgetProps> = ({ element, isSelected, isPreviewMode }) => {
  const properties = element.properties as any;
  
  // State for user selection and attempts
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  // Get properties with defaults
  const question = properties.question || '¿Cuál es la respuesta correcta?';
  const showQuestion = properties.showQuestion !== false;
  const options = properties.options || [
    { text: 'Opción A', isCorrect: true },
    { text: 'Opción B', isCorrect: false },
    { text: 'Opción C', isCorrect: false }
  ];
  const correctOptionIndex = options.findIndex((option: any) => option.isCorrect);
  
  // Validation and display options
  const showFeedback = properties.showFeedback !== false;
  const showMessages = properties.showMessages !== false;
  const instantFeedback = properties.instantFeedback !== false;
  const showValidationOnAll = properties.showValidationOnAll !== false;
  const allowRetry = properties.allowRetry !== false;
  const showScore = properties.showScore !== false;
  const maxAttempts = properties.maxAttempts || 0; // 0 = infinite
  
  // Styling properties
  const fontSize = properties.fontSize || 'text-base';
  const fontWeight = properties.fontWeight || 'font-normal';
  const fontFamily = properties.fontFamily || 'font-sans';
  const textColor = properties.textColor || '#374151';
  const correctTextColor = properties.correctTextColor || '#166534';
  const incorrectTextColor = properties.incorrectTextColor || '#991b1b';
  
  // Widget appearance
  const hasBackground = properties.hasBackground !== false;
  const completelyTransparent = properties.completelyTransparent || false;
  const backgroundColor = properties.backgroundColor || '#ffffff';
  const backgroundOpacity = properties.backgroundOpacity || 1;
  const borderRadius = properties.borderRadius || 8;
  const padding = properties.padding || 16;
  
  // Option styling
  const optionStyle = properties.optionStyle || 'radio'; // 'radio', 'button', 'card'
  const optionSpacing = properties.optionSpacing || 8;
  
  // Custom messages
  const successMessage = properties.successMessage || '✓ ¡Correcto!';
  const errorMessage = properties.errorMessage || '✗ Intenta de nuevo';

  // Check if user has exceeded maximum attempts (0 means infinite)
  const hasExceededAttempts = maxAttempts > 0 && attempts >= maxAttempts;
  const isInputDisabled = !allowRetry && hasExceededAttempts;

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isInputDisabled) return;
    
    setSelectedOption(optionIndex);
    
    if (instantFeedback) {
      setHasAnswered(true);
      if (optionIndex !== correctOptionIndex) {
        setAttempts(prev => prev + 1);
      }
    }
  };

  // Check if current selection is correct
  const isCorrect = () => selectedOption === correctOptionIndex;

  // Get font size in pixels from Tailwind class
  const getFontSizeFromClass = (sizeClass: string) => {
    const sizeMap: Record<string, string> = {
      'text-xs': '12px',
      'text-sm': '14px',
      'text-base': '16px',
      'text-lg': '18px',
      'text-xl': '20px',
      'text-2xl': '24px',
      'text-3xl': '30px',
      'text-4xl': '36px',
      'text-5xl': '48px',
    };
    return sizeMap[sizeClass] || '16px';
  };

  // Get option styling based on state
  const getOptionStyling = (optionIndex: number, isCorrectOption: boolean): React.CSSProperties => {
    const isSelected = selectedOption === optionIndex;
    const showValidation = hasAnswered && instantFeedback;
    
    let baseStyle: React.CSSProperties = {
      cursor: isInputDisabled ? 'not-allowed' : 'pointer',
      opacity: isInputDisabled ? 0.6 : 1,
    };

    if (optionStyle === 'button') {
      // Get shadow CSS value
      const getShadowValue = (shadowType: string) => {
        const shadows = {
          'none': 'none',
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'custom': properties.buttonCustomShadow || 'none'
        };
        return shadows[shadowType] || shadows.sm;
      };

      // Get transform value
      const getTransformValue = (transformType: string) => {
        const transforms = {
          'none': 'none',
          'scale-105': 'scale(1.05)',
          'scale-110': 'scale(1.1)',
          'translateY-1': 'translateY(-1px)',
          'translateY-2': 'translateY(-2px)'
        };
        return transforms[transformType] || 'none';
      };

      baseStyle = {
        ...baseStyle,
        padding: `${properties.buttonPaddingY || 12}px ${properties.buttonPaddingX || 16}px`,
        borderRadius: `${properties.buttonBorderRadius || 6}px`,
        border: `${properties.buttonBorderWidth || 2}px solid ${properties.buttonBorderColor || '#d1d5db'}`,
        backgroundColor: properties.buttonBackgroundColor || '#ffffff',
        color: properties.buttonTextColor || '#374151',
        fontFamily: properties.buttonFontFamily === 'inherit' 
          ? 'inherit' 
          : properties.buttonFontFamily?.startsWith('font-') 
            ? 'inherit' // Let Tailwind classes handle it
            : properties.buttonFontFamily || 'inherit',
        fontSize: properties.buttonFontSize === 'inherit' || !properties.buttonFontSize
          ? 'inherit'
          : getFontSizeFromClass(properties.buttonFontSize),
        fontWeight: (properties.buttonFontWeight || 'font-medium').replace('font-', ''),
        textAlign: properties.buttonTextAlign || 'center',
        minHeight: '44px', // Ensure consistent button height
        minWidth: '120px', // Ensure minimum button width
        width: '100%', // Take full available width
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: properties.buttonAnimationsEnabled !== false 
          ? `all ${properties.buttonTransitionDuration || '200ms'} ease`
          : 'none',
      };

      // Apply selected state
      if (isSelected) {
        if (showValidation) {
          if (isCorrectOption) {
            if (properties.buttonUseCustomValidationColors !== false) {
              baseStyle.borderColor = properties.buttonCorrectBorderColor || '#10b981';
              baseStyle.backgroundColor = properties.buttonCorrectBackgroundColor || '#ecfdf5';
              baseStyle.color = properties.buttonCorrectTextColor || '#065f46';
              baseStyle.borderWidth = `${properties.buttonCorrectBorderWidth || 2}px`;
            } else {
              baseStyle.borderColor = '#10b981';
              baseStyle.backgroundColor = '#ecfdf5';
              baseStyle.color = correctTextColor;
            }
          } else {
            if (properties.buttonUseCustomValidationColors !== false) {
              baseStyle.borderColor = properties.buttonIncorrectBorderColor || '#ef4444';
              baseStyle.backgroundColor = properties.buttonIncorrectBackgroundColor || '#fef2f2';
              baseStyle.color = properties.buttonIncorrectTextColor || '#991b1b';
              baseStyle.borderWidth = `${properties.buttonIncorrectBorderWidth || 2}px`;
            } else {
              baseStyle.borderColor = '#ef4444';
              baseStyle.backgroundColor = '#fef2f2';
              baseStyle.color = incorrectTextColor;
            }
          }
        } else {
          baseStyle.borderColor = properties.buttonSelectedBorderColor || '#3b82f6';
          baseStyle.backgroundColor = properties.buttonSelectedBackgroundColor || '#eff6ff';
          baseStyle.color = properties.buttonSelectedTextColor || '#1d4ed8';
          baseStyle.borderWidth = `${properties.buttonSelectedBorderWidth || 2}px`;
        }
      } else if (showValidation && hasAnswered && showValidationOnAll) {
        // Show validation styling on all options when enabled
        if (isCorrectOption) {
          if (properties.buttonUseCustomValidationColors !== false) {
            baseStyle.borderColor = properties.buttonCorrectBorderColor || '#10b981';
            baseStyle.backgroundColor = properties.buttonCorrectBackgroundColor || '#ecfdf5';
            baseStyle.color = properties.buttonCorrectTextColor || '#065f46';
            baseStyle.borderWidth = `${properties.buttonCorrectBorderWidth || 2}px`;
            baseStyle.opacity = (baseStyle.opacity as number) * (properties.buttonValidationOpacity || 0.8);
          } else {
            baseStyle.borderColor = '#10b981';
            baseStyle.backgroundColor = '#ecfdf5';
            baseStyle.color = correctTextColor;
            baseStyle.opacity = (baseStyle.opacity as number) * 0.8;
          }
        } else {
          if (properties.buttonUseCustomValidationColors !== false) {
            baseStyle.borderColor = properties.buttonIncorrectBorderColor || '#ef4444';
            baseStyle.backgroundColor = properties.buttonIncorrectBackgroundColor || '#fef2f2';
            baseStyle.color = properties.buttonIncorrectTextColor || '#991b1b';
            baseStyle.borderWidth = `${properties.buttonIncorrectBorderWidth || 2}px`;
            baseStyle.opacity = (baseStyle.opacity as number) * (properties.buttonValidationOpacity || 0.8);
          } else {
            baseStyle.borderColor = '#ef4444';
            baseStyle.backgroundColor = '#fef2f2';
            baseStyle.color = incorrectTextColor;
            baseStyle.opacity = (baseStyle.opacity as number) * 0.8;
          }
        }
      } else if (showValidation && hasAnswered && !showValidationOnAll) {
        // Maintain custom styling for non-selected options
        baseStyle.borderColor = properties.buttonBorderColor || '#d1d5db';
        baseStyle.backgroundColor = properties.buttonBackgroundColor || '#ffffff';
        baseStyle.color = properties.buttonTextColor || '#374151';
        baseStyle.borderWidth = `${properties.buttonBorderWidth || 2}px`;
        
        // Apply custom opacity for non-selected options
        baseStyle.opacity = (baseStyle.opacity as number) * (properties.buttonValidationOpacity || 0.7);
      }

    } else if (optionStyle === 'card') {
      baseStyle = {
        ...baseStyle,
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s',
        minHeight: '44px', // Ensure consistent card height
        minWidth: '120px', // Ensure minimum card width
        width: 'auto', // Auto width for natural sizing
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      };

      if (isSelected) {
        if (showValidation) {
          if (isCorrectOption) {
            baseStyle.borderColor = '#10b981';
            baseStyle.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            baseStyle.color = correctTextColor;
          } else {
            baseStyle.borderColor = '#ef4444';
            baseStyle.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            baseStyle.color = incorrectTextColor;
          }
        } else {
          baseStyle.borderColor = '#3b82f6';
          baseStyle.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }
      }
    } else if (optionStyle === 'radio') {
      // Add consistent sizing for radio options
      baseStyle = {
        ...baseStyle,
        padding: '12px 16px',
        minHeight: '44px', // Ensure consistent radio option height
        minWidth: '120px', // Ensure minimum radio option width
        width: '100%', // Take full available width
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderRadius: '4px',
        transition: 'all 0.2s',
      };

      // Add hover effect for radio options
      if (isSelected) {
        baseStyle.backgroundColor = '#f3f4f6';
      }
    }

    return baseStyle;
  };

  // Font family styling - handle both Tailwind classes and CSS font-family values
  const getFontFamilyStyle = () => {
    if (fontFamily === 'grilledcheese') {
      return { fontFamily: 'grilledcheese' };
    } else if (fontFamily.startsWith('font-')) {
      return {};
    } else {
      return { fontFamily: fontFamily };
    }
  };

  const fontFamilyStyle = getFontFamilyStyle();
  const fontFamilyClass = fontFamily.startsWith('font-') ? fontFamily : '';

  // Widget container styling
  const containerStyle = hasBackground && !completelyTransparent ? {
    backgroundColor: backgroundColor,
    opacity: backgroundOpacity,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
  } : {};

  // Complete transparency override
  const widgetOpacity = completelyTransparent ? 0 : 1;

  return (
    <div 
      className={`single-choice-widget ${fontSize} ${fontWeight} ${fontFamilyClass}`}
      style={{
        ...containerStyle,
        ...fontFamilyStyle,
        opacity: widgetOpacity,
        minHeight: '80px', // Ensure minimum height even without question
        display: 'flex',
        flexDirection: 'column',
        width: 'auto', // Auto width to allow natural sizing
        minWidth: '200px', // Ensure minimum width for usability
        maxWidth: '100%', // Don't exceed container bounds
      }}
    >
      {/* Question */}
      {showQuestion && (
        <div className="mb-4" style={{ color: textColor }}>
          <h3 className="font-medium">{question}</h3>
        </div>
      )}

      {/* Options Container - maintains proper sizing regardless of question visibility */}
      <div 
        className="space-y-2" 
        style={{ 
          gap: `${optionSpacing}px`,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          width: 'auto', // Auto width to match parent
          minWidth: '200px', // Ensure minimum width for options
        }}
      >
        {/* Options */}
        {options.map((option: any, index: number) => {
          const isSelected = selectedOption === index;
          const optionStyles = getOptionStyling(index, option.isCorrect);
          
          // Generate dynamic CSS for hover effects when button style is used
          const hoverStyles = optionStyle === 'button' && properties.buttonHoverEnabled !== false ? `
            .single-choice-option-${index}:hover {
              background-color: ${properties.buttonHoverBackgroundColor || '#f3f4f6'} !important;
              color: ${properties.buttonHoverTextColor || '#1f2937'} !important;
              border-color: ${properties.buttonHoverBorderColor || '#9ca3af'} !important;
              transform: ${properties.buttonHoverTransform && properties.buttonHoverTransform !== 'none' 
                ? properties.buttonHoverTransform.replace('scale-', 'scale(1.').replace(')', ')').replace('translateY-', 'translateY(-').replace('px', 'px)')
                : 'none'} !important;
            }
          ` : '';

          return (
            <div key={index}>
              {hoverStyles && (
                <style dangerouslySetInnerHTML={{ __html: hoverStyles }} />
              )}
              <div
                onClick={() => handleOptionSelect(index)}
                className={`flex items-center cursor-pointer single-choice-option-${index} ${
                  optionStyle === 'button' ? 'transition-all' : ''
                } ${
                  optionStyle === 'button' && properties.buttonFontFamily?.startsWith('font-') 
                    ? properties.buttonFontFamily 
                    : ''
                } ${
                  optionStyle === 'button' && properties.buttonFontSize?.startsWith('text-') 
                    ? properties.buttonFontSize 
                    : ''
                }`}
                style={optionStyles}
              >
                {optionStyle === 'radio' && (
                  <div className="flex items-center mr-3">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={isInputDisabled}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                )}
                
                <span className="flex-1">{option.text}</span>
                
                {/* Show validation icon for selected option */}
                {isSelected && hasAnswered && instantFeedback && (
                  <span className="ml-2">
                    {option.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Messages */}
      {showFeedback && showMessages && hasAnswered && instantFeedback && (
        <div className={`mt-4 text-sm font-medium ${
          isCorrect() ? 'text-green-600' : 'text-red-600'
        }`}>
          {isCorrect() ? successMessage : errorMessage}
        </div>
      )}

      {/* Score indicator */}
      {showScore && hasAnswered && (
        <div className="mt-4 text-right text-sm text-gray-600">
          Puntuación: {isCorrect() ? 1 : 0}/1
        </div>
      )}

      {/* Attempts counter */}
      {!allowRetry && maxAttempts > 0 && attempts > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Intentos: {attempts}/{maxAttempts}
        </div>
      )}

      {/* Infinite attempts indicator */}
      {!allowRetry && maxAttempts === 0 && attempts > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Intentos: {attempts} (Ilimitados)
        </div>
      )}

      {/* Hint */}
      {properties.hint && (
        <div className="mt-4 text-sm text-blue-600 italic">
          💡 {properties.hint}
        </div>
      )}

      {/* Explanation */}
      {properties.explanation && (isCorrect() || (!allowRetry && hasExceededAttempts)) && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          📝 {properties.explanation}
        </div>
      )}
    </div>
  );
};
