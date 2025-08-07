import React, { useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import { useContainerStore } from '../hooks/useContainerStore';

/**
 * Component that syncs container data from BuilderContext to ContainerStore
 * This runs in the background and doesn't render anything
 * It allows other components to use the isolated store without context re-renders
 */
export const ContainerStoreSync: React.FC = () => {
  const { elements } = useBuilder();
  const updateContainers = useContainerStore(state => state.updateContainers);
  
  // 🔍 DEBUG: Track sync component activity
  
  useEffect(() => {
    // Only sync when elements array reference changes (add/remove operations)
    updateContainers(elements);
  }, [elements, updateContainers]);
  
  // This component doesn't render anything
  return null;
};

export default ContainerStoreSync;
