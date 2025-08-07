import React from 'react';
import { Palette, GraduationCap } from 'lucide-react';

type TabType = 'elements' | 'modules';

interface SidebarTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="sidebar-tabs">
      <button
        onClick={() => onTabChange('elements')}
        className={`sidebar-tab ${
          activeTab === 'elements' ? 'active' : ''
        }`}
      >
        <Palette className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Elementos</span>
      </button>
      <button
        onClick={() => onTabChange('modules')}
        className={`sidebar-tab ${
          activeTab === 'modules' ? 'active' : ''
        }`}
      >
        <GraduationCap className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Módulos</span>
      </button>
    </div>
  );
};
