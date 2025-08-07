import React from 'react';
import { RotateCcw } from 'lucide-react';

interface DynamicStyles {
  gap: string | number;
  buttonPadding: string;
  buttonFontSize: string;
  needsCompactLayout?: boolean;
}

export interface TrueFalseButtonsProps {
  /** Widget properties object – may include trueButton / falseButton customization */
  properties: any;
  /** Whether the rendering context is preview (editor) mode */
  isPreviewMode?: boolean;
  /** Has the user already answered? */
  hasAnswered: boolean;
  /** Is the answer correct? */
  isCorrect: boolean | undefined;
  /** Are we currently showing the result? */
  showingResult: boolean;
  /** Computed dynamic style helpers from the host widget */
  dynamicStyles: DynamicStyles;
  /** Called when the user clicks either button */
  onAnswer: (answer: boolean) => void;
  /** Optional reset handler (used when allowRetry = true) */
  onReset?: () => void;
}

/**
 * DRY component rendering Verdadero / Falso buttons (and optional result UI)
 * Shared by AudioTrueFalseWidget, TextStatementWidget, ImageChoiceWidget, etc.
 */
export const TrueFalseButtons: React.FC<TrueFalseButtonsProps> = ({
  properties,
  isPreviewMode = false,
  hasAnswered,
  isCorrect,
  showingResult,
  dynamicStyles,
  onAnswer,
  onReset,
}) => {
  // Helper to build button styles (ported from AudioTrueFalseWidget)
  const buildButtonStyles = (
    buttonType: 'true' | 'false',
  ): React.CSSProperties => {
    const buttonProps = buttonType === 'true' ? properties.trueButton : properties.falseButton;
    const baseColor = buttonType === 'true' ? '#059669' : '#dc2626'; // green-600 / red-600

    const buildBorderStyles = (): React.CSSProperties => {
      const borderStyles: React.CSSProperties = {};
      const borderWidth = buttonProps?.borderWidth || 0;
      const borderColor = buttonProps?.borderColor || '#e2e8f0';
      const borderStyleVal = buttonProps?.borderStyle || 'solid';

      const maybeSet = (
        side: 'Top' | 'Right' | 'Bottom' | 'Left',
        widthKey: keyof typeof buttonProps,
        colorKey: keyof typeof buttonProps,
        styleKey: keyof typeof buttonProps,
      ) => {
        const w = buttonProps?.[widthKey as any];
        const c = buttonProps?.[colorKey as any];
        const s = buttonProps?.[styleKey as any];
        if (w !== undefined || c || s) {
          (borderStyles as any)[`border${side}`] = `${w ?? borderWidth}px ${s ?? borderStyleVal} ${c ?? borderColor}`;
        }
      };

      maybeSet('Top', 'borderTopWidth', 'borderTopColor', 'borderTopStyle');
      maybeSet('Right', 'borderRightWidth', 'borderRightColor', 'borderRightStyle');
      maybeSet('Bottom', 'borderBottomWidth', 'borderBottomColor', 'borderBottomStyle');
      maybeSet('Left', 'borderLeftWidth', 'borderLeftColor', 'borderLeftStyle');

      if (
        !borderStyles.borderTop &&
        !borderStyles.borderRight &&
        !borderStyles.borderBottom &&
        !borderStyles.borderLeft &&
        borderWidth > 0
      ) {
        borderStyles.border = `${borderWidth}px ${borderStyleVal} ${borderColor}`;
      }

      return borderStyles;
    };

    // Default (no result yet)
    if (!hasAnswered || !properties.showResult) {
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
        borderRadius: typeof buttonProps?.borderRadius === 'number' ? `${buttonProps.borderRadius}px` : buttonProps?.borderRadius || '6px',
        padding: buttonProps?.padding || dynamicStyles.buttonPadding,
        fontSize: typeof buttonProps?.fontSize === 'number' ? `${buttonProps.fontSize}px` : buttonProps?.fontSize || dynamicStyles.buttonFontSize,
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

    // Result state
    const userSelected = properties.userAnswer === (buttonType === 'true');
    const isCorrectAnswer = properties.correctAnswer === (buttonType === 'true');

    let backgroundColor = buttonProps?.backgroundColor || baseColor;
    let styleObj: React.CSSProperties = {};
    let opacity = 1;

    const keepOriginal = buttonProps?.keepOriginalStyling === true;

    if (keepOriginal) {
      // Subtle style changes only
      opacity = userSelected ? 1 : 0.4;
      if (userSelected && !isCorrect) {
        backgroundColor = '#dc2626'; // wrong – red
      }
      if (isCorrectAnswer) {
        backgroundColor = '#059669';
      }
    } else {
      // Full validation styling
      if (userSelected) {
        backgroundColor = isCorrect ? '#059669' : '#dc2626';
      } else if (isCorrectAnswer) {
        backgroundColor = '#059669';
      } else {
        opacity = 0.5;
      }
    }

    styleObj = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      color: '#fff',
      ...buildBorderStyles(),
      borderRadius: typeof buttonProps?.borderRadius === 'number' ? `${buttonProps.borderRadius}px` : buttonProps?.borderRadius || '6px',
      padding: buttonProps?.padding || dynamicStyles.buttonPadding,
      fontSize: typeof buttonProps?.fontSize === 'number' ? `${buttonProps.fontSize}px` : buttonProps?.fontSize || dynamicStyles.buttonFontSize,
      fontWeight: buttonProps?.fontWeight || '500',
      transition: 'all 0.2s ease',
      minWidth: dynamicStyles.needsCompactLayout ? '60px' : '80px',
      opacity,
      ...(buttonProps?.customCSS || {}),
    };

    return styleObj;
  };

  const gapStyle = typeof dynamicStyles.gap === 'number' ? `${dynamicStyles.gap}px` : dynamicStyles.gap;

  return (
    <div className="flex" style={{ gap: gapStyle }}>
      <button
        onClick={() => onAnswer(true)}
        disabled={isPreviewMode || (hasAnswered && !properties.allowRetry)}
        style={buildButtonStyles('true')}
        title="Verdadero"
      >
        {properties.trueButton?.text || 'Verdadero'}
      </button>
      <button
        onClick={() => onAnswer(false)}
        disabled={isPreviewMode || (hasAnswered && !properties.allowRetry)}
        style={buildButtonStyles('false')}
        title="Falso"
      >
        {properties.falseButton?.text || 'Falso'}
      </button>
      {hasAnswered && properties.showResult && properties.allowRetry && onReset && (
        <button
          onClick={onReset}
          className="ml-2 inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
          title="Intentar de nuevo"
          style={{ fontSize: dynamicStyles.buttonFontSize }}
        >
          <RotateCcw size={16} />
        </button>
      )}
    </div>
  );
}; 