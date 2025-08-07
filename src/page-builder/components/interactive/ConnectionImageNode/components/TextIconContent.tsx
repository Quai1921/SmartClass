import React from 'react';
import { Target, Check, X } from 'lucide-react';
import { calculateOpacity, calculateVisibility } from '../utils';

interface TextIconContentProps {
  properties: any;
  isConnected: boolean;
  isTargeted: boolean;
  feedbackType: 'success' | 'error' | null;
}

export const TextIconContent: React.FC<TextIconContentProps> = ({
  properties,
  isConnected,
  isTargeted,
  feedbackType
}) => {
  const getResultStyling = () => {
    const props = properties;
    
    if (isConnected) {
      return {
        iconType: 'success',
        iconSize: props.successIconSize || props.iconSize || 32,
        iconColor: props.successIconColor || props.successColor || '#22c55e',
        iconBg: props.successIconBgTransparent ? 'transparent' : (props.successIconBg || '#dcfce7'),
        message: props.successMessage || 'Correcto',
        textColor: props.successColor || '#22c55e',
        cardBg: props.successCardNoBackground ? 'transparent' : props.successCardBg || '#22c55e',
        cardOpacity: props.successCardOpacity || 10
      };
    }
    
    if (feedbackType === 'error') {
      return {
        iconType: 'error',
        iconSize: props.incorrectIconSize || props.iconSize || 32,
        iconColor: props.incorrectIconColor || props.incorrectColor || '#ef4444',
        iconBg: props.incorrectIconBgTransparent ? 'transparent' : (props.incorrectIconBg || '#fee2e2'),
        message: props.incorrectMessage || 'Incorrecto',
        textColor: props.incorrectColor || '#ef4444',
        cardBg: props.incorrectCardNoBackground ? 'transparent' : props.incorrectCardBg || '#ef4444',
        cardOpacity: props.incorrectCardOpacity || 10
      };
    }
    
    // Default state
    return {
      iconType: 'target',
      iconSize: props.iconSize || 32,
      iconColor: props.iconColor || props.lineColor || '#64748b',
      iconBg: 'transparent',
      message: props.text || 'Drop here!',
      textColor: props.textColor || props.lineColor || '#64748b',
      cardBg: 'transparent',
      cardOpacity: 0
    };
  };

  const getIconComponent = (iconType: string, size: number, isSuccess: boolean) => {
    switch (iconType) {
      case 'success':
        return <Check size={size} />;
      case 'error':
        return <X size={size} />;
      case 'target':
      default:
        return <Target size={size} />;
    }
  };

  const styling = getResultStyling();
  const opacity = calculateOpacity(properties, isConnected, isTargeted);
  const visibility = calculateVisibility(properties, isConnected, isTargeted);

  return (
    <div style={{
      display: 'flex',
      flexDirection: properties.contentDirection || 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${properties.contentGap || 8}px`,
      color: isConnected ? 
        (properties.connectedTextColor || '#22c55e') : 
        (properties.textColor || properties.lineColor || '#64748b'),
      pointerEvents: 'none',
      width: '100%',
      height: '100%',
      textAlign: 'center' as const,
      opacity,
      visibility,
    }}>
      {/* Icon */}
      {properties.showIcon !== false && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${styling.iconSize + 16}px`,
          height: `${styling.iconSize + 16}px`,
          borderRadius: '50%',
          backgroundColor: styling.iconBg,
          color: styling.iconColor,
          fontSize: `${styling.iconSize}px`,
          transition: 'all 0.3s ease'
        }}>
          {styling.iconType === 'target' ? (
            <Target size={styling.iconSize} />
          ) : (
            getIconComponent(
              styling.iconType, 
              styling.iconSize, 
              feedbackType === 'success' || isConnected
            )
          )}
        </div>
      )}
      
      {/* Text */}
      {properties.showText !== false && (
        <span style={{
          fontSize: `${properties.fontSize || 12}px`,
          fontWeight: properties.fontWeight || '500',
          fontFamily: properties.fontFamily || 'Poppins, sans-serif',
          fontStyle: properties.fontStyle || 'normal',
          textDecoration: properties.textDecoration || 'none',
          textTransform: properties.textTransform || 'none',
          letterSpacing: properties.letterSpacing ? `${properties.letterSpacing}px` : 'normal',
          lineHeight: properties.lineHeight || 'normal',
          textShadow: properties.textShadow || 'none',
          transition: 'all 0.3s ease',
          color: styling.textColor,
          // Gradient text support
          background: properties.textGradient || 'none',
          WebkitBackgroundClip: properties.textGradient ? 'text' : 'initial',
          WebkitTextFillColor: properties.textGradient ? 'transparent' : 'initial',
        }}>
          {styling.message}
        </span>
      )}
    </div>
  );
}; 