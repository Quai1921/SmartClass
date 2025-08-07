import React from 'react';

// Improved tooltip component with better positioning and wider tooltips for long text
export const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Determine tooltip width based on text length - prioritize width over height but constrain to sidebar
  const getTooltipWidth = (text: string) => {
    if (text.length > 200) return 'max-w-[20rem] w-[20rem]'; // Reduced from 32rem
    if (text.length > 120) return 'max-w-[18rem] w-[18rem]'; // Reduced from 28rem  
    if (text.length > 80) return 'max-w-[16rem] w-[16rem]';  // Reduced from 24rem
    if (text.length > 50) return 'max-w-64 w-64';           // Keep medium for medium text (320px)
    return 'max-w-48 w-48'; // Reduced from max-w-64 for shorter text
  };

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative group inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`fixed z-[99999] px-4 py-3 text-xs text-white bg-gray-900 rounded-lg shadow-2xl whitespace-normal ${getTooltipWidth(text)} text-left leading-relaxed pointer-events-none border border-gray-700 transform -translate-x-1/2 -translate-y-full`}
          style={{
            left: position.x,
            top: position.y
          }}
        >
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
        </div>
      )}
    </>
  );
};

// Tooltip for select options
export const OptionTooltip: React.FC<{ value: string; tooltip: string; children: React.ReactNode }> = ({ value, tooltip, children }) => (
  <option value={value} title={tooltip}>
    {children}
  </option>
);
