import { useState, useEffect, useCallback } from 'react';

type TabType = 'elements' | 'modules';

export const useSidebarState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('elements');

  // Enhanced setActiveTab that dispatches tab switch event
  const handleTabChange = useCallback((newTab: TabType) => {
    const previousTab = activeTab;
    setActiveTab(newTab);
    
    // Dispatch tab switch event for other components to listen to
    if (previousTab !== newTab) {
      window.dispatchEvent(new CustomEvent('sidebarTabSwitch', {
        detail: { fromTab: previousTab, toTab: newTab }
      }));
    }
  }, [activeTab]);

  // Keyboard shortcut to toggle between tabs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+T to switch between tabs
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        const newTab = activeTab === 'elements' ? 'modules' : 'elements';
        handleTabChange(newTab);
      }
    };
    
    // Listen for auto-switch to modules tab event
    const handleSwitchToModules = () => {
      handleTabChange('modules');
    };
    
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('switchToModulesTab', handleSwitchToModules);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('switchToModulesTab', handleSwitchToModules);
    };
  }, [activeTab, handleTabChange]);

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
};
