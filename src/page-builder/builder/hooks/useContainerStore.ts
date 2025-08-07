import { create } from 'zustand';
import type { Element } from '../../types';

/**
 * Separate store for container metadata that doesn't trigger React re-renders
 * This store only updates when containers are added or removed, not when properties change
 */
interface ContainerStore {
  containerCount: number;
  hasContainers: boolean;
  containerIds: string[];
  updateContainers: (elements: Element[]) => void;
  resetContainers: () => void;
}

export const useContainerStore = create<ContainerStore>((set, get) => ({
  containerCount: 0,
  hasContainers: false,
  containerIds: [],
  
  updateContainers: (elements: Element[]) => {
    const containers = elements.filter(el => el.type === 'container');
    const newContainerCount = containers.length;
    const newContainerIds = containers.map(c => c.id).sort();
    const currentState = get();
    
    // Only update if container composition actually changed
    const hasChanged = 
      newContainerCount !== currentState.containerCount ||
      newContainerIds.length !== currentState.containerIds.length ||
      !newContainerIds.every((id, index) => id === currentState.containerIds[index]);
    
    if (hasChanged) {
      set({
        containerCount: newContainerCount,
        hasContainers: newContainerCount > 0,
        containerIds: newContainerIds,
      });
    }
  },
  
  resetContainers: () => {
    set({
      containerCount: 0,
      hasContainers: false,
      containerIds: [],
    });
  },
}));

/**
 * Optimized hook that only returns hasContainers boolean
 * This prevents re-renders when only the container count changes
 */
export const useHasContainers = () => {
  return useContainerStore(state => state.hasContainers);
};
