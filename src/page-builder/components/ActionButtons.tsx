import React from 'react';
import { Save, FolderOpen, FileDown, Undo, Redo } from 'lucide-react';

interface ActionButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpenProjects: () => void;
  onExport: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canUndo,
  canRedo,
  hasUnsavedChanges,
  onUndo,
  onRedo,
  onSave,
  onOpenProjects,
  onExport
}) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`toolbar-button p-1.5 sm:p-2 rounded transition-colors ${
          canUndo 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-200' 
            : 'text-gray-500 cursor-not-allowed'
        }`}
        title="Deshacer (Ctrl+Z)"
      >
        <Undo size={16} className="sm:hidden" />
        <Undo size={18} className="hidden sm:block" />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`toolbar-button p-1.5 sm:p-2 rounded transition-colors ${
          canRedo 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-200' 
            : 'text-gray-500 cursor-not-allowed'
        }`}
        title="Rehacer (Ctrl+Y)"
      >
        <Redo size={16} className="sm:hidden" />
        <Redo size={18} className="hidden sm:block" />
      </button>

      <button
        onClick={onOpenProjects}
        className="toolbar-button p-1.5 sm:p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Abrir proyecto"
      >
        <FolderOpen size={16} className="sm:hidden" />
        <FolderOpen size={18} className="hidden sm:block" />
      </button>
      
      <button
        onClick={onSave}
        className={`toolbar-button relative p-1.5 sm:p-2 rounded transition-colors ${
          hasUnsavedChanges 
            ? 'text-yellow-400 hover:bg-yellow-900/30 hover:text-yellow-300 bg-yellow-900/20' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-gray-200'
        }`}
        title={hasUnsavedChanges ? "Guardar contenido del módulo (Ctrl+S) - Hay cambios sin guardar" : "Guardar contenido del módulo (Ctrl+S)"}
      >
        <Save size={16} className="sm:hidden" />
        <Save size={18} className="hidden sm:block" />
        {hasUnsavedChanges && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </button>
      
      <button
        onClick={onExport}
        className="toolbar-button p-1.5 sm:p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Exportar proyecto con archivos multimedia embebidos"
      >
        <FileDown size={16} className="sm:hidden" />
        <FileDown size={18} className="hidden sm:block" />
      </button>
    </div>
  );
};
