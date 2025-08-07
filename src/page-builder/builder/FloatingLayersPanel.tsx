import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  X, 
  Minimize2,
  Maximize2,
  GripVertical
} from 'lucide-react';
import { LayersPanel } from './LayersPanel';

interface FloatingLayersPanelProps {
  className?: string;
}

export const FloatingLayersPanel: React.FC<FloatingLayersPanelProps> = ({
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 }); // Start below toolbar
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Handle dragging functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 300);
      const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 400);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+L to toggle layers panel
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsMinimized(true);
        }
      }
      // Escape to close panel
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setIsMinimized(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    // Move to bottom left corner
    setPosition({ x: 20, y: window.innerHeight - 60 });
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    // Move to a better position when expanded
    setPosition({ x: 20, y: 80 });
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Minimized floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 border border-gray-600 
                   rounded-lg shadow-lg p-3 transition-all duration-200 hover:shadow-xl 
                   hover:scale-105 ${className}`}
        title="Abrir panel de capas (Alt+L)"
      >
        <Layers className="w-5 h-5 text-gray-300" />
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          C
        </div>
      </button>
    );
  }

  // Minimized panel state
  if (isMinimized) {
    return (
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000
        }}
        className={`bg-gray-800 border border-gray-600 rounded-lg shadow-lg transition-all duration-200 ${className}`}
      >
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between p-2 cursor-move bg-gray-700 rounded-lg border-b border-gray-600"
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <Layers className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-200">Capas</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleMaximize}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
              title="Maximizar"
            >
              <Maximize2 className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-red-600 hover:text-red-200 rounded transition-colors"
              title="Cerrar"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full panel state
  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        width: '320px',
        height: '500px'
      }}
      className={`bg-gray-800 border border-gray-600 rounded-lg shadow-xl flex flex-col 
                  transform transition-all duration-300 ease-in-out ${className}`}
    >
      {/* Header */}
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className={`flex items-center justify-between p-3 cursor-move bg-gray-700 
                    rounded-t-lg border-b border-gray-600 transition-colors duration-200 
                    ${isDragging ? 'bg-gray-600' : ''}`}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className={`w-4 h-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
          <Layers className="w-4 h-4 text-gray-300" />
          <span className="text-sm font-medium text-gray-200">Panel de Capas</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
            title="Minimizar"
          >
            <Minimize2 className="w-3 h-3 text-gray-400" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-600 hover:text-red-200 rounded transition-colors"
            title="Cerrar"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto h-full max-h-full bg-gray-800 rounded-b-lg pb-20">
        <LayersPanel />
      </div>
    </div>
  );
};
