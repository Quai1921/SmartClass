import React, { useEffect, useState } from 'react';

interface BoundaryIndicatorProps {
  isConstrained: boolean;
  constraintType: 'horizontal' | 'vertical' | 'both' | null;
  parentName?: string;
}

export const BoundaryIndicator: React.FC<BoundaryIndicatorProps> = ({
  isConstrained,
  constraintType,
  parentName // unused but kept for potential future use
}) => {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (isConstrained) {
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 2000); // Show for 2 seconds

      return () => clearTimeout(timer);
    } else {
      // Reset immediately when constraint is released
      setShowIndicator(false);
    }
  }, [isConstrained]);

  if (!showIndicator) return null;
  const getConstraintMessage = () => {
    switch (constraintType) {
      case 'horizontal':
        return `↔️ No se puede mover más hacia los lados`;
      case 'vertical':
        return `↕️ No se puede mover más hacia arriba o abajo`;
      case 'both':
        return `� Has llegado al límite del contenedor`;
      default:
        return `⚠️ Movimiento restringido dentro del contenedor`;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      zIndex: 10000,
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
      border: '2px solid #dc2626',
      animation: 'bounceIn 0.3s ease-out',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>{getConstraintMessage()}</div>
        <div style={{ 
          fontSize: '12px', 
          opacity: 0.9, 
          marginTop: '2px' 
        }}>
          Usa el botón verde para mover entre contenedores
        </div>
      </div>
    </div>
  );
};

// Add the animation to the CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: translateX(-50%) scale(0.3);
    }
    50% {
      opacity: 1;
      transform: translateX(-50%) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }
`;
document.head.appendChild(style);
