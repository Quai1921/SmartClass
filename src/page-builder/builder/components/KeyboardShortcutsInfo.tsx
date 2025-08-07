import React from 'react';

export const KeyboardShortcutsInfo: React.FC = () => {
  return (
    <div className="bg-gray-700 border-b border-gray-600 px-4 py-3 flex-shrink-0" style={{ padding: '14px 16px' }}>
      <div className="flex items-center justify-between text-sm text-gray-300" style={{ fontSize: '0.875rem' }}>
        <div className="flex items-center space-x-3 flex-wrap gap-y-1 keyboard-shortcuts">
          <span>
            <strong className="text-gray-200">Atajos:</strong>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Supr
            </kbd>{' '}
            <span className="text-gray-300">Eliminar</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              ↑↓
            </kbd>{' '}
            <span className="text-gray-300">Mover</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              F9
            </kbd>{' '}
            <span className="text-gray-300">Panel</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Ctrl+S
            </kbd>{' '}
            <span className="text-gray-300">Guardar</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Ctrl+Z
            </kbd>{' '}
            <span className="text-gray-300">Deshacer</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Ctrl+Y
            </kbd>{' '}
            <span className="text-gray-300">Rehacer</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Ctrl+C
            </kbd>{' '}
            <span className="text-gray-300">Copiar</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Ctrl+V
            </kbd>{' '}
            <span className="text-gray-300">Pegar</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Esc
            </kbd>{' '}
            <span className="text-gray-300">Deseleccionar</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-gray-600 text-gray-200 rounded text-xs">
              Alt+T
            </kbd>{' '}
            <span className="text-gray-300">Cambiar pestaña</span>
          </span>
        </div>
      </div>
    </div>
  );
};
