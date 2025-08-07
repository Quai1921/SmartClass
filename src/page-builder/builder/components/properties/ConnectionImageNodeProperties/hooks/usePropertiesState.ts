import { useState } from 'react';
import { useBuilder } from '../../../../../hooks/useBuilder';
import type { Element } from '../../../../../types';
import { handleImageSelect, handleOpenImageModal } from '../utils';

interface UsePropertiesStateProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const usePropertiesState = ({ 
  element, 
  onPropertyChange, 
  openImageChoiceModal 
}: UsePropertiesStateProps) => {
  const properties = element.properties as any;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  // Tab state management
  type TabType = 'basic' | 'styling' | 'connection' | 'advanced';
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  
  const { updateElement } = useBuilder();

  const handleImageSelectCallback = (src: string, alt?: string) => {
    handleImageSelect(src, alt, properties, updateElement, element.id, setImageModalOpen);
  };

  const handleOpenImageModalCallback = () => {
    handleOpenImageModal(element.id, openImageChoiceModal, setImageModalOpen);
  };

  return {
    properties,
    imageModalOpen,
    setImageModalOpen,
    activeTab,
    setActiveTab,
    handleImageSelect: handleImageSelectCallback,
    handleOpenImageModal: handleOpenImageModalCallback,
    onPropertyChange
  };
}; 