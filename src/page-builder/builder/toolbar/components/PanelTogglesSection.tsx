import React from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

interface PanelTogglesSectionProps {
  sidebarVisible: boolean;
  propertyPanelVisible: boolean;
  onToggleSidebar: () => void;
  onTogglePropertyPanel: () => void;
}

/**
 * Panel toggles section component - sidebar and property panel toggles
 */
export const PanelTogglesSection: React.FC<PanelTogglesSectionProps> = ({
  sidebarVisible,
  propertyPanelVisible,
  onToggleSidebar,
  onTogglePropertyPanel
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleSidebar}
        className="toolbar-button p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title={sidebarVisible ? "Ocultar barra lateral" : "Mostrar barra lateral"}
      >
        {sidebarVisible ? (
          <>
            <PanelRightClose size={16} className="sm:hidden" />
            <PanelRightClose size={18} className="hidden sm:block" />
          </>
        ) : (
          <>
            <PanelRightOpen size={16} className="sm:hidden" />
            <PanelRightOpen size={18} className="hidden sm:block" />
          </>
        )}
      </button>

      <button
        onClick={onTogglePropertyPanel}
        className="toolbar-button p-2 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title={propertyPanelVisible ? "Ocultar propiedades" : "Mostrar propiedades"}
      >
        {propertyPanelVisible ? (
          <>
            <PanelRightClose size={16} className="sm:hidden" />
            <PanelRightClose size={18} className="hidden sm:block" />
          </>
        ) : (
          <>
            <PanelRightOpen size={16} className="sm:hidden" />
            <PanelRightOpen size={18} className="hidden sm:block" />
          </>
        )}
      </button>
    </div>
  );
};
