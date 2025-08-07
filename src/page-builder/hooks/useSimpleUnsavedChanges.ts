import { useEffect, useRef, useState, useCallback } from 'react';
import { useBuilder } from './useBuilder';

// 🎯 SINGLETON STATE: Only one instance across the entire app
let globalState = {
  hasUnsavedChanges: false,
  currentModuleId: null as string | null,
  isTracking: false,
  baselineElements: '[]',
  listeners: new Set<() => void>()
};

/**
 * Singleton unsaved changes hook - ensures single source of truth
 */
export const useSimpleUnsavedChanges = () => {
  const { elements } = useBuilder();
  const [localState, setLocalState] = useState(globalState.hasUnsavedChanges);
  const forceUpdateRef = useRef<(() => void) | null>(null);

  // Subscribe to global state changes
  useEffect(() => {
    const updateLocal = () => {
      setLocalState(globalState.hasUnsavedChanges);
    };
    
    forceUpdateRef.current = updateLocal;
    globalState.listeners.add(updateLocal);
    
    return () => {
      globalState.listeners.delete(updateLocal);
    };
  }, []);

  // Notify all listeners of state changes
  const notifyListeners = useCallback(() => {
    globalState.listeners.forEach(listener => listener());
  }, []);

  // Track changes to elements
  useEffect(() => {
    if (!globalState.isTracking && elements.length > 0) {
      globalState.isTracking = true;
      globalState.baselineElements = JSON.stringify(elements);
      globalState.hasUnsavedChanges = false;
      notifyListeners();
      return;
    }

    if (!globalState.isTracking) {
      return;
    }

    const currentState = JSON.stringify(elements);
    const hasChanges = currentState !== globalState.baselineElements;
    
    if (globalState.hasUnsavedChanges !== hasChanges) {
      globalState.hasUnsavedChanges = hasChanges;
      notifyListeners();
    }
  }, [elements, notifyListeners]);

  // Start tracking
  const startTracking = useCallback((moduleId: string, initialElements?: any[]) => {
    const elementsToUse = initialElements || elements;
    globalState.currentModuleId = moduleId;
    globalState.baselineElements = JSON.stringify(elementsToUse);
    globalState.isTracking = true;
    globalState.hasUnsavedChanges = false;
    notifyListeners();
  }, [elements, notifyListeners]);

  // Mark as saved
  const markAsSaved = useCallback(() => {
    if (!globalState.isTracking) {
      return;
    }

    const currentState = JSON.stringify(elements);
    globalState.baselineElements = currentState;
    globalState.hasUnsavedChanges = false;
    
    notifyListeners();
  }, [elements, notifyListeners]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    globalState.isTracking = false;
    globalState.hasUnsavedChanges = false;
    globalState.currentModuleId = null;
    notifyListeners();
  }, [notifyListeners]);

  // Debug functions
  const getDebugInfo = useCallback(() => {
    return {
      hasUnsavedChanges: globalState.hasUnsavedChanges,
      currentModuleId: globalState.currentModuleId,
      isTracking: globalState.isTracking,
      elementsCount: elements.length,
      baselineLength: globalState.baselineElements.length,
      listenersCount: globalState.listeners.size
    };
  }, [elements]);

  // Setup window debugging
  useEffect(() => {
    (window as any).debugSimpleUnsaved = {
      getInfo: getDebugInfo,
      markAsSaved,
      testSave: () => {
        markAsSaved();
      },
      globalState: () => globalState
    };
  }, [getDebugInfo, markAsSaved]);

  return {
    hasUnsavedChanges: localState,
    currentModuleId: globalState.currentModuleId,
    startTracking,
    stopTracking,
    markAsSaved,
    getDebugInfo
  };
};
