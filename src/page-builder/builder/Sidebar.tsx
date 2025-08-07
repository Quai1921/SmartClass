import React from 'react';
import { SidebarTabs } from './sidebar/components/SidebarTabs';
import { ElementsTab } from './sidebar/components/ElementsTab';
import { ModulesTab } from './sidebar/components/ModulesTab';
import { useSidebarState } from './sidebar/hooks/useSidebarState';
import { useSidebarDebug } from './sidebar/hooks/useSidebarDebug';

interface SidebarProps {
  hasContainers: boolean; // Make it required
}

const SidebarComponent: React.FC<SidebarProps> = ({ hasContainers }) => {
  const { activeTab, setActiveTab } = useSidebarState();
  useSidebarDebug(hasContainers);
  
  return (
    <div className="sidebar h-full min-h-0 flex flex-col">
      {/* Tab Navigation */}
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content - Keep both mounted to preserve state */}
      <div className="tab-content h-full min-h-0 flex-1 flex flex-col">
        {/* Elements Tab */}
        <div 
          className={`elements-tab h-full min-h-0 flex-1 flex flex-col ${
            activeTab === 'elements' ? 'block' : 'hidden'
          }`}
        >
          <ElementsTab hasContainers={hasContainers} />
        </div>
        
        {/* Modules Tab */}
        <div 
          className={`sidebar-course-manager h-full min-h-0 flex-1 flex flex-col ${
            activeTab === 'modules' ? 'block' : 'hidden'
          }`}
        >
          <ModulesTab />
        </div>
      </div>
    </div>
  );
};

// Memoize the Sidebar component to prevent unnecessary re-renders
// Only re-render when hasContainers prop actually changes
export const Sidebar = React.memo(SidebarComponent, (prevProps, nextProps) => {
  return prevProps.hasContainers === nextProps.hasContainers;
});
