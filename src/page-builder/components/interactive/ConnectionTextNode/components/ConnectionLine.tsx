import React from 'react';
import { createPortal } from 'react-dom';

interface ConnectionLineProps {
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
  lineColor: string;
  lineWidth?: number;
  connectionPointSize?: number;
  connectionPointColor?: string;
  showArrow?: boolean;
  arrowSize?: number;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  lineColor,
  lineWidth = 3,
  connectionPointSize = 8,
  connectionPointColor,
  showArrow = false,
  arrowSize = 10
}) => {
  if (!start || !end) {
    return null;
  }

  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  return createPortal(
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {/* Connection Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeLinecap="round"
      />
      
      {/* Start Point */}
      <circle
        cx={x1}
        cy={y1}
        r={connectionPointSize}
        fill={connectionPointColor || lineColor}
      />
      
      {/* End Point */}
      <circle
        cx={x2}
        cy={y2}
        r={connectionPointSize}
        fill={connectionPointColor || lineColor}
      />
      
      {/* Arrow if enabled */}
      {showArrow && (() => {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        // Arrow points
        const arrowX = x2;
        const arrowY = y2;
        const leftX = x2 - arrowSize * Math.cos(angle - Math.PI / 8);
        const leftY = y2 - arrowSize * Math.sin(angle - Math.PI / 8);
        const rightX = x2 - arrowSize * Math.cos(angle + Math.PI / 8);
        const rightY = y2 - arrowSize * Math.sin(angle + Math.PI / 8);
        return (
          <polygon
            points={`${arrowX},${arrowY} ${leftX},${leftY} ${rightX},${rightY}`}
            fill={lineColor}
          />
        );
      })()}
    </svg>,
    document.body
  );
}; 