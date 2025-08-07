import React from 'react';
import { Save, FolderOpen, FileDown, Plus, FileText } from 'lucide-react';

interface FileOperationsSectionProps {
  onSave: () => void;
  onSaveDraft: () => void;
  onShowProjectsModal: () => void;
  onExport: () => void;
  onNewProject: () => void;
}

/**
 * File operations section component - save, load, export, new project
 */
export const FileOperationsSection: React.FC<FileOperationsSectionProps> = ({
  onSave,
  onSaveDraft,
  onShowProjectsModal,
  onExport,
  onNewProject
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onSave}
        className="p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Guardar"
      >
        <Save size={16} className="sm:hidden" />
        <Save size={18} className="hidden sm:block" />
      </button>
      <button
        onClick={onSaveDraft}
        className="p-2 sm:p-2.5 rounded text-gray-300 hover:bg-yellow-600 hover:text-white"
        title="Guardar Borrador"
      >
        <FileText size={16} className="sm:hidden" />
        <FileText size={18} className="hidden sm:block" />
      </button>
      <button
        onClick={onShowProjectsModal}
        className="p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Proyectos Guardados"
      >
        <FolderOpen size={16} className="sm:hidden" />
        <FolderOpen size={18} className="hidden sm:block" />
      </button>
      <button
        onClick={onExport}
        className="p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Exportar"
      >
        <FileDown size={16} className="sm:hidden" />
        <FileDown size={18} className="hidden sm:block" />
      </button>
      <button
        onClick={onNewProject}
        className="p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Nuevo Proyecto"
      >
        <Plus size={16} className="sm:hidden" />
        <Plus size={18} className="hidden sm:block" />
      </button>
    </div>
  );
};
