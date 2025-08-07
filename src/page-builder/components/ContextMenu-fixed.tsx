import React, { useEffect, useRef } from 'react';
import { ImageIcon, Trash2, Copy, Move3D, Settings, X } from 'lucide-react';
import type { Element } from '../types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  element: Element;
  onRemoveBackgroundImage?: () => void;
  onSetBackgroundImage?: () => void;
  onDeleteElement?: () => void;
  onDuplicateElement?: () => void;
  onMoveElement?: () => void;
  onElementSettings?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  onClose,
  position,
  element,
  onRemoveBackgroundImage,
  onSetBackgroundImage,
  onDeleteElement,
  onDuplicateElement,
  onMoveElement,
  onElementSettings,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasBackgroundImage = element.properties.backgroundImage;
  
  
  const menuItems = [
    // Background image options (for containers)
    ...(element.type === 'container' ? [
      {
        label: hasBackgroundImage ? 'Cambiar Imagen de Fondo' : 'Agregar Imagen de Fondo',
        icon: <ImageIcon size={16} />,
        onClick: onSetBackgroundImage,
        color: 'text-slate-400 hover:text-slate-300'
      },
      ...(hasBackgroundImage ? [{
        label: 'Quitar Imagen de Fondo',
        icon: <X size={16} />,
        onClick: onRemoveBackgroundImage,
        color: 'text-amber-500 hover:text-amber-400'
      }] : [])
    ] : []),
    
    // Separator
    ...(element.type === 'container' ? [{ separator: true }] : []),
    
    // Common element actions
    {
      label: 'Configuración',
      icon: <Settings size={16} />,
      onClick: onElementSettings,
      color: 'text-gray-400 hover:text-gray-300'
    },
    {
      label: 'Duplicar',
      icon: <Copy size={16} />,
      onClick: onDuplicateElement,
      color: 'text-emerald-500 hover:text-emerald-400'
    },
    {
      label: 'Mover',
      icon: <Move3D size={16} />,
      onClick: onMoveElement,
      color: 'text-violet-500 hover:text-violet-400'
    },
    { separator: true },
    {
      label: 'Eliminar',
      icon: <Trash2 size={16} />,
      onClick: onDeleteElement,
      color: 'text-rose-500 hover:text-rose-400'
    }
  ];

  // Calculate smart position to avoid going off-screen
  let finalX = position.x;
  let finalY = position.y;
  
  // Add small offset to avoid cursor overlap
  finalX += 2;
  finalY += 2;
  
  // Simple boundary check
  const menuWidth = 200;
  const menuHeight = 300;
  
  if (finalX + menuWidth > window.innerWidth) {
    finalX = position.x - menuWidth - 2;
  }
  
  if (finalY + menuHeight > window.innerHeight) {
    finalY = position.y - menuHeight - 2;
  }
  
  // Ensure it doesn't go negative
  finalX = Math.max(10, finalX);
  finalY = Math.max(10, finalY);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-[200px] z-[9999]"
      style={{
        left: `${finalX}px`,
        top: `${finalY}px`,
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-600 text-xs text-gray-400 uppercase tracking-wide">
        {element.type === 'container' ? 'Contenedor' : 'Elemento'}
      </div>

      {menuItems.map((item, index) => {
        if ('separator' in item && item.separator) {
          return (
            <div
              key={`separator-${index}`}
              className="h-px bg-gray-600 my-1 mx-2"
            />
          );
        }

        return (
          <button
            key={index}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-700 transition-colors ${item.color}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Footer info */}
      <div className="px-3 py-2 border-t border-gray-600 text-xs text-gray-500">
        ID: {element.id.slice(0, 8)}...
      </div>
    </div>
  );
};
