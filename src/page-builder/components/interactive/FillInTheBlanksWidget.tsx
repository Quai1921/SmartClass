import React, { useState, useEffect } from 'react';
import type { Element } from '../../types';

interface FillInTheBlanksWidgetProps {
  element: Element;
  isSelected: boolean;
}

interface ParsedBlank {
  expectedAnswer: string;
  userAnswer: string;
  index: number;
}

export const FillInTheBlanksWidget: React.FC<FillInTheBlanksWidgetProps> = ({ element, isSelected }) => {
  const properties = element.properties as any;
  
  // State for user input and attempts
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  
  // Get properties with defaults
  const questionText = properties.questionText || 'I like [red] [apples]!';
  const caseSensitive = properties.caseSensitive || false;
  const trimWhitespace = properties.trimWhitespace !== false;
  const accentSensitive = properties.accentSensitive || false;
  const placeholder = properties.placeholder || 'Escribe aquí...';
  const showPlaceholder = properties.showPlaceholder !== false;
  const inputWidth = properties.inputWidth || 120;
  const inputHeight = properties.inputHeight || 36;
  const showScore = properties.showScore !== false;
  const showFeedback = properties.showFeedback !== false;
  const showMessages = properties.showMessages !== false;
  const instantFeedback = properties.instantFeedback !== false;
  const allowRetry = properties.allowRetry !== false;
  const resetOnIncorrect = properties.resetOnIncorrect || false;
  const maxAttempts = properties.maxAttempts || 3;
  
  // Styling properties
  const fontSize = properties.fontSize || 'text-base';
  const fontWeight = properties.fontWeight || 'font-normal';
  const fontFamily = properties.fontFamily || 'font-sans';
  const textColor = properties.textColor || '#374151';
  const correctTextColor = properties.correctTextColor || '#166534';
  const incorrectTextColor = properties.incorrectTextColor || '#991b1b';
  const inputBackgroundColor = properties.inputBackgroundColor || '#ffffff';
  const inputTransparent = properties.inputTransparent || false;
  const inputBorderRadius = properties.inputBorderRadius || 6;
  const hasBackground = properties.hasBackground !== false;
  const completelyTransparent = properties.completelyTransparent || false;
  const backgroundColor = properties.backgroundColor || '#ffffff';
  const backgroundOpacity = properties.backgroundOpacity || 1;
  const borderRadius = properties.borderRadius || 8;
  const padding = properties.padding || 16;
  
  // Custom messages
  const successMessage = properties.successMessage || '✓ ¡Correcto!';
  const errorMessage = properties.errorMessage || '✗ Intenta de nuevo';

  // Parse the question text to find [word] patterns and extract expected answers
  const parseQuestionText = (): { expectedAnswers: string[], textParts: string[] } => {
    const bracketRegex = /\[([^\]]+)\]/g;
    const expectedAnswers: string[] = [];
    const textParts: string[] = [];
    let lastIndex = 0;
    let match;
    
    // Extract all expected answers and split text into parts
    while ((match = bracketRegex.exec(questionText)) !== null) {
      // Add text before the bracket (preserve exactly as is)
      textParts.push(questionText.slice(lastIndex, match.index));
      // Add the expected answer
      expectedAnswers.push(match[1]);
      // Update last index to after the closing bracket
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last bracket (preserve exactly as is)
    textParts.push(questionText.slice(lastIndex));
    
    return { expectedAnswers, textParts };
  };

  const { expectedAnswers, textParts } = parseQuestionText();

  // Initialize user answers array when expected answers change
  useEffect(() => {
    setUserAnswers(new Array(expectedAnswers.length).fill(''));
  }, [expectedAnswers.length]);

  // Remove accents for comparison if needed
  const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Check if a single answer is correct
  const isAnswerCorrect = (userAnswer: string, expectedAnswer: string): boolean => {
    if (!userAnswer) return false;
    
    let userInput = userAnswer;
    let expected = expectedAnswer;

    // Trim whitespace if enabled
    if (trimWhitespace) {
      userInput = userInput.trim();
      expected = expected.trim();
    }

    // Handle accent sensitivity
    if (!accentSensitive) {
      userInput = removeAccents(userInput);
      expected = removeAccents(expected);
    }

    // Handle case sensitivity
    if (!caseSensitive) {
      userInput = userInput.toLowerCase();
      expected = expected.toLowerCase();
    }

    return userInput === expected;
  };

  // Check if all answers are correct
  const isCorrect = (): boolean => {
    if (expectedAnswers.length === 0) return false;
    return expectedAnswers.every((expected, index) => 
      isAnswerCorrect(userAnswers[index] || '', expected)
    );
  };

  // Handle input change for a specific blank
  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    
    if (resetOnIncorrect && !isAnswerCorrect(value, expectedAnswers[index]) && value.length > 0) {
      // Don't reset immediately, wait for a brief moment
      const timeoutId = setTimeout(() => {
        if (!isAnswerCorrect(value, expectedAnswers[index])) {
          newAnswers[index] = '';
          setUserAnswers([...newAnswers]);
          setAttempts(prev => prev + 1);
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  // Check if input should be disabled
  const isInputDisabled = (): boolean => {
    if (allowRetry) return false;
    if (maxAttempts === 0) return false; // Infinite attempts
    return attempts >= maxAttempts;
  };

  // Check if max attempts exceeded
  const hasExceededAttempts = (): boolean => {
    if (allowRetry) return false;
    if (maxAttempts === 0) return false; // Infinite attempts
    return attempts >= maxAttempts;
  };

  // Border configuration
  const inputBorders = properties.inputBorders || {
    all: { width: 1, color: '#d1d5db', style: 'solid' },
    top: { width: 0, color: '#000000', style: 'solid' },
    right: { width: 0, color: '#000000', style: 'solid' },
    bottom: { width: 0, color: '#000000', style: 'solid' },
    left: { width: 0, color: '#000000', style: 'solid' }
  };

  // Generate border styles from configuration
  const generateBorderStyles = () => {
    const { all, top, right, bottom, left } = inputBorders;
    
    // If "all" is configured, use it for all sides
    if (all && all.width > 0) {
      return {
        borderTop: `${all.width}px ${all.style} ${all.color}`,
        borderRight: `${all.width}px ${all.style} ${all.color}`,
        borderBottom: `${all.width}px ${all.style} ${all.color}`,
        borderLeft: `${all.width}px ${all.style} ${all.color}`
      };
    }
    
    // Otherwise, build individual border styles
    const borderTop = top && top.width > 0 ? `${top.width}px ${top.style} ${top.color}` : 'none';
    const borderRight = right && right.width > 0 ? `${right.width}px ${right.style} ${right.color}` : 'none';
    const borderBottom = bottom && bottom.width > 0 ? `${bottom.width}px ${bottom.style} ${bottom.color}` : 'none';
    const borderLeft = left && left.width > 0 ? `${left.width}px ${left.style} ${left.color}` : 'none';
    
    return {
      borderTop,
      borderRight,
      borderBottom,
      borderLeft
    };
  };

  // Get input styling
  const getInputStyling = () => {
    const getFontSizeFromClass = (sizeClass: string) => {
      const sizeMap: { [key: string]: string } = {
        'text-xs': '12px',
        'text-sm': '14px',
        'text-base': '16px',
        'text-lg': '18px',
        'text-xl': '20px',
        'text-2xl': '24px',
        'text-3xl': '30px',
        'text-4xl': '36px',
        'text-5xl': '48px',
        'text-6xl': '60px',
        'text-7xl': '72px',
        'text-8xl': '96px',
        'text-9xl': '128px'
      };
      return sizeMap[sizeClass] || '16px';
    };

    // Calculate dynamic width based on expected answer length
    const getDynamicWidth = (expectedAnswer: string) => {
      const minWidth = 40; // Further reduced minimum width
      const maxWidth = 200; // Reduced maximum width
      const charWidth = 10; // Increased character width to prevent clipping
      const extraPadding = 16; // Increased extra padding for longer words
      const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, (expectedAnswer.length * charWidth) + extraPadding));
      return calculatedWidth;
    };

    return (expectedAnswer?: string) => ({
      width: `${expectedAnswer ? getDynamicWidth(expectedAnswer) : inputWidth}px`,
      height: `${inputHeight}px`,
      backgroundColor: inputTransparent ? 'transparent' : inputBackgroundColor,
      ...generateBorderStyles(),
      borderRadius: `${inputBorderRadius}px`,
      padding: '0 3px', // Increased padding to prevent word merging
      margin: '0 0 0 2px', // Small left margin to prevent word merging
      fontSize: getFontSizeFromClass(fontSize),
      fontFamily: fontFamily === 'grilledcheese' ? 'grilledcheese' : fontFamily.startsWith('font-') ? 'inherit' : fontFamily,
      fontWeight: fontWeight === 'font-normal' ? 'normal' : fontWeight === 'font-bold' ? 'bold' : fontWeight,
      color: textColor,
      boxSizing: 'border-box' as const,
      verticalAlign: 'baseline', // Align with text baseline
      lineHeight: '1.2', // Match text line height
      letterSpacing: 'normal', // Normal letter spacing
      wordSpacing: 'normal', // Normal word spacing
      textIndent: '0', // No text indent
      outline: 'none', // Remove outline
      borderSpacing: '0', // No border spacing
    });
  };

  const renderQuestion = () => {
    if (expectedAnswers.length === 0) {
      return (
        <div className="flex items-center flex-wrap">
          <span style={{ color: textColor }}>{questionText}</span>
        </div>
      );
    }

    const elements: React.ReactNode[] = [];
    
    // Render text and input fields alternately
    for (let i = 0; i < textParts.length; i++) {
      // Add text part (preserve original spacing)
      if (textParts[i] !== undefined) {
        elements.push(
          <span key={`text-${i}`} style={{ color: textColor }}>
            {textParts[i]}
          </span>
        );
      }
      
      // Add input field after text part (except for the last text part)
      if (i < expectedAnswers.length) {
        const isThisAnswerCorrect = isAnswerCorrect(userAnswers[i] || '', expectedAnswers[i]);
        const inputStyle = {
          ...getInputStyling()(expectedAnswers[i]),
          color: instantFeedback && userAnswers[i] ? 
            (isThisAnswerCorrect ? correctTextColor : incorrectTextColor) : 
            textColor
        };

        elements.push(
          <input
            key={`input-${i}`}
            type="text"
            value={userAnswers[i] || ''}
            onChange={(e) => handleInputChange(i, e.target.value)}
            placeholder={showPlaceholder ? placeholder : ''}
            disabled={isInputDisabled()}
            className="inline-block focus:outline-none transition-colors"
            style={inputStyle}
          />
        );
      }
    }
    
    return (
      <div className="flex items-baseline flex-wrap" style={{ letterSpacing: 'normal', wordSpacing: 'normal' }}>
        {elements}
      </div>
    );
  };

  const correct = isCorrect();

  // Widget container styling
  const containerStyle = hasBackground && !completelyTransparent ? {
    backgroundColor: backgroundColor,
    opacity: backgroundOpacity,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
  } : {};

  // Font family styling - handle both Tailwind classes and CSS font-family values
  const getFontFamilyStyle = () => {
    if (fontFamily === 'grilledcheese') {
      return { fontFamily: 'grilledcheese' };
    } else if (fontFamily.startsWith('font-')) {
      // Tailwind class - will be applied via className
      return {};
    } else {
      // CSS font-family value
      return { fontFamily: fontFamily };
    }
  };

  const fontFamilyStyle = getFontFamilyStyle();
  const fontFamilyClass = fontFamily.startsWith('font-') ? fontFamily : '';

  // Complete transparency override
  const widgetOpacity = completelyTransparent ? 0 : 1;

  return (
    <div 
      className={`fill-in-blanks-widget ${fontSize} ${fontWeight} ${fontFamilyClass}`}
      style={{
        ...containerStyle,
        ...fontFamilyStyle,
        opacity: widgetOpacity,
      }}
    >
      {/* Question with inline input */}
      <div className="leading-normal">
        {renderQuestion()}
      </div>
      
      {/* Feedback - only show when enabled and there's input */}
      {showFeedback && showMessages && userAnswers.some(answer => answer) && instantFeedback && (
        <div className={`mt-2 text-xs font-medium ${
          correct ? 'text-green-600' : 'text-red-600'
        }`}>
          {correct ? successMessage : errorMessage}
        </div>
      )}

      {/* Score indicator - only show if enabled */}
      {showScore && (
        <div className="mt-2 text-right text-xs text-gray-600">
          Puntuación: {correct ? expectedAnswers.length : 0}/{expectedAnswers.length}
        </div>
      )}

      {/* Attempts counter - show if retry is limited and maxAttempts > 0 */}
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

      {/* Hint - show if provided */}
      {properties.hint && (
        <div className="mt-2 text-xs text-blue-600 italic">
          💡 {properties.hint}
        </div>
      )}

      {/* Explanation - show after correct answer or max attempts reached (if not infinite) */}
      {properties.explanation && (correct || (!allowRetry && hasExceededAttempts())) && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
          📝 {properties.explanation}
        </div>
      )}
    </div>
  );
};
