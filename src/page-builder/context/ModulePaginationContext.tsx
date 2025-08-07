import React, { createContext, useContext } from 'react';
import { useModulePaginationBridge } from '../hooks/useModulePaginationBridge';

interface ModulePaginationContextType {
  registerPaginationCallback: (callback: (content: any) => void) => void;
  notifyModuleContentLoaded: (moduleContent: any) => void;
  unregisterPaginationCallback: () => void;
}

const ModulePaginationContext = createContext<ModulePaginationContextType | null>(null);

export const ModulePaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bridge = useModulePaginationBridge();

  return (
    <ModulePaginationContext.Provider value={bridge}>
      {children}
    </ModulePaginationContext.Provider>
  );
};

export const useModulePaginationContext = () => {
  const context = useContext(ModulePaginationContext);
  if (!context) {
    throw new Error('useModulePaginationContext must be used within a ModulePaginationProvider');
  }
  return context;
};
