import React, { useState } from 'react';

interface TooltipProps {
  text: string; // Texto del tooltip
  position?: 'top' | 'bottom' | 'left' | 'right'; // Posición del tooltip
  children: React.ReactNode;
  onClick?: () => void; // Función opcional para manejar clics en el tooltip
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipPositionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative flex items-center w-[fit-content] h-[fit-content] cursor-pointer select-none"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}      {isVisible && (
        <div
          className={`absolute z-[9999] px-2 py-1 text-sm text-white bg-[#0F1D2E] rounded shadow-2xl drop-shadow-2xl border border-gray-600/50 whitespace-nowrap ${
            tooltipPositionClasses[position]
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;