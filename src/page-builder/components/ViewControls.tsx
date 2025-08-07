import React from 'react';
import { PanelRightOpen, PanelRightClose, Plus, Eye } from 'lucide-react';

interface ViewControlsProps {
  sidebarVisible: boolean;
  propertyPanelVisible: boolean;
  onToggleSidebar: () => void;
  onTogglePropertyPanel: () => void;
  onNewProject: () => void;
  onPreview: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  sidebarVisible,
  propertyPanelVisible,
  onToggleSidebar,
  onTogglePropertyPanel,
  onNewProject,
  onPreview
}) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={onNewProject}
        className="toolbar-button p-1.5 sm:p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Nuevo proyecto"
      >
        <Plus size={16} className="sm:hidden" />
        <Plus size={18} className="hidden sm:block" />
      </button>

      <button
        onClick={onPreview}
        className="toolbar-button p-1.5 sm:p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Vista previa"
      >
        <Eye size={16} className="sm:hidden" />
        <Eye size={18} className="hidden sm:block" />
      </button>

      <button
        onClick={onToggleSidebar}
        className={`toolbar-button p-1.5 sm:p-2 rounded transition-colors ${
          sidebarVisible 
            ? 'text-blue-400 bg-blue-900/30' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-gray-200'
        }`}
        title={sidebarVisible ? "Ocultar barra lateral" : "Mostrar barra lateral"}
      >
        <PanelRightOpen size={16} className="sm:hidden" />
        <PanelRightOpen size={18} className="hidden sm:block" />
      </button>

      <button
        onClick={onTogglePropertyPanel}
        className={`toolbar-button p-1.5 sm:p-2 rounded transition-colors ${
          propertyPanelVisible 
            ? 'text-blue-400 bg-blue-900/30' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-gray-200'
        }`}
        title={propertyPanelVisible ? "Ocultar panel de propiedades" : "Mostrar panel de propiedades"}
      >
        <PanelRightClose size={16} className="sm:hidden" />
        <PanelRightClose size={18} className="hidden sm:block" />
      </button>
    </div>
  );
};
