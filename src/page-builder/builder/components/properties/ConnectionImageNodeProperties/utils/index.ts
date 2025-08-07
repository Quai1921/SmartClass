// Utility functions for ConnectionImageNodeProperties

export const updateTargetedBoxShadow = (properties: any, onPropertyChange: (property: string, value: any) => void) => {
  const x = properties.targetedBoxShadowX || '0px';
  const y = properties.targetedBoxShadowY || '4px';
  const blur = properties.targetedBoxShadowBlur || '16px';
  const color = properties.targetedBoxShadowColor || '#00000033';
  onPropertyChange('targetedBoxShadow', `${x} ${y} ${blur} ${color}`);
};

export const updateSuccessBoxShadow = (properties: any, onPropertyChange: (property: string, value: any) => void) => {
  const x = properties.successBoxShadowX || '0px';
  const y = properties.successBoxShadowY || '4px';
  const blur = properties.successBoxShadowBlur || '16px';
  const color = properties.successBoxShadowColor || '#00000033';
  onPropertyChange('successBoxShadow', `${x} ${y} ${blur} ${color}`);
};

export const updateErrorBoxShadow = (properties: any, onPropertyChange: (property: string, value: any) => void) => {
  const x = properties.errorBoxShadowX || '0px';
  const y = properties.errorBoxShadowY || '4px';
  const blur = properties.errorBoxShadowBlur || '16px';
  const color = properties.errorBoxShadowColor || '#00000033';
  onPropertyChange('errorBoxShadow', `${x} ${y} ${blur} ${color}`);
};

export const handleImageSelect = (
  src: string, 
  alt: string | undefined, 
  properties: any, 
  updateElement: (elementId: string, updates: any) => void,
  elementId: string,
  setImageModalOpen: (open: boolean) => void
) => {
  const updatedProperties = {
    ...properties,
    imageUrl: src,
    imageSrc: src,
    ...(alt && { imageAlt: alt })
  };
  
  updateElement(elementId, {
    properties: updatedProperties
  });
  
  setImageModalOpen(false);
};

export const handleOpenImageModal = (
  elementId: string,
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void,
  setImageModalOpen?: (open: boolean) => void
) => {
  (window as any).connectionImageCallback = (src: string, alt?: string) => {
    // This will be handled by the component
  };
  (window as any).connectionImageElementId = elementId;
  
  if (openImageChoiceModal) {
    openImageChoiceModal(elementId, 'ADD_ELEMENT');
  } else if (setImageModalOpen) {
    setImageModalOpen(true);
  }
}; 