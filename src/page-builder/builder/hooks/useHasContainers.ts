import { useContainerMetadata } from './useContainerMetadata.tsx';

/**
 * Optimized hook that returns a stable boolean for whether containers exist
 * Uses ContainerMetadataContext to avoid re-renders during element property changes
 */
export const useHasContainers = (): boolean => {
  const { hasContainers } = useContainerMetadata();
  return hasContainers;
};

/**
 * Hook that returns the current container count
 * Uses ContainerMetadataContext to avoid re-renders during element property changes
 */
export const useContainerCount = (): number => {
  const { containerCount } = useContainerMetadata();
  return containerCount;
};
