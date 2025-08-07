import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import type { Element } from '../../types';

/**
 * Container metadata context that only updates when containers are added/removed
 * This prevents re-renders when individual element properties change
 */
interface ContainerMetadataContextType {
  containerCount: number;
  hasContainers: boolean;
  containerIds: string[];
}

const ContainerMetadataContext = createContext<ContainerMetadataContextType | null>(null);

interface ContainerMetadataProviderProps {
  children: ReactNode;
}

/**
 * Provider that tracks container metadata without subscribing to property changes
 * Uses element array reference equality to prevent re-renders during property updates
 */
export const ContainerMetadataProvider: React.FC<ContainerMetadataProviderProps> = ({ children }) => {
  const { elements } = useBuilder();
  
  // Only recalculate when elements array reference changes (add/remove operations)
  // Property updates don't change the array reference, so this won't trigger
  const containerMetadata = useMemo(() => {
    const containers = elements.filter((el: Element) => el.type === 'container');
    const containerCount = containers.length;
    const hasContainers = containerCount > 0;
    const containerIds = containers.map(c => c.id);
    
    return {      containerCount,
      hasContainers,
      containerIds,
    };
  }, [elements]); // Only depends on elements array reference

  return (
    <ContainerMetadataContext.Provider value={containerMetadata}>
      {children}
    </ContainerMetadataContext.Provider>
  );
};

/**
 * Hook to access container metadata without subscribing to element property changes
 */
export const useContainerMetadata = (): ContainerMetadataContextType => {
  const context = useContext(ContainerMetadataContext);
  
  if (!context) {
    throw new Error('useContainerMetadata must be used within a ContainerMetadataProvider');
  }
  
  return context;
};
