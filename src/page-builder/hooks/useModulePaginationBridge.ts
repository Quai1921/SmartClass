import { useCallback, useRef } from 'react';

/**
 * Bridge hook that connects existing module selection with pagination
 * This allows the existing ModulesTab to communicate with pagination components
 */
export const useModulePaginationBridge = () => {
  const paginationCallbackRef = useRef<((content: any) => void) | null>(null);

  // Register a callback function to be called when module content is loaded
  const registerPaginationCallback = useCallback((callback: (content: any) => void) => {
    paginationCallbackRef.current = callback;
  }, []);

  // Notify pagination components when module content is loaded
  const notifyModuleContentLoaded = useCallback((moduleContent: any) => {
    if (paginationCallbackRef.current) {
      paginationCallbackRef.current(moduleContent);
    }
  }, []);

  // Unregister the callback
  const unregisterPaginationCallback = useCallback(() => {
    paginationCallbackRef.current = null;
  }, []);

  return {
    registerPaginationCallback,
    notifyModuleContentLoaded,
    unregisterPaginationCallback
  };
};
