import React from 'react';
import { TabNavigation } from './ConnectionImageNodeProperties/components/TabNavigation';
import { BasicTab } from './ConnectionImageNodeProperties/components/BasicTab';
import { StylingTab } from './ConnectionImageNodeProperties/components/StylingTab';
import { ConnectionTab } from './ConnectionImageNodeProperties/components/ConnectionTab';
import { AdvancedTab } from './ConnectionImageNodeProperties/components/AdvancedTab';
import { usePropertiesState } from './ConnectionImageNodeProperties/hooks/usePropertiesState';
import type { Element } from '../../../types';

interface ConnectionImageNodePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ConnectionImageNodeProperties: React.FC<ConnectionImageNodePropertiesProps> = ({
  element,
  onPropertyChange,
  openImageChoiceModal,
}) => {
  const {
    properties,
    activeTab,
    setActiveTab,
    handleOpenImageModal,
  } = usePropertiesState({ element, onPropertyChange, openImageChoiceModal });

  return (
    <div className="space-y-6">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'basic' && (
        <BasicTab
          properties={properties}
          onPropertyChange={onPropertyChange}
          handleOpenImageModal={handleOpenImageModal}
        />
      )}
      {activeTab === 'styling' && (
        <StylingTab
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      )}
      {activeTab === 'connection' && (
        <ConnectionTab
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      )}
      {activeTab === 'advanced' && (
        <AdvancedTab
          properties={properties}
          element={element}
          onPropertyChange={onPropertyChange}
        />
      )}
    </div>
  );
};
