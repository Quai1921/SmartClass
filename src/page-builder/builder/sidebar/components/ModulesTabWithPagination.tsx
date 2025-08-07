import React, { useState, useCallback, useEffect } from 'react';
import { ModulesTab } from './ModulesTab';
import ModulePagination from '../../../components/ModulePagination';
import { useBuilder } from '../../../hooks/useBuilder';
import { ModulePaginationProvider, useModulePaginationContext } from '../../../context/ModulePaginationContext';

/**
 * Inner component that uses the pagination context
 */
const ModulesTabWithPaginationInner: React.FC = () => {
  const { importProject } = useBuilder();
  const { registerPaginationCallback, unregisterPaginationCallback } = useModulePaginationContext();
  const [selectedModuleContent, setSelectedModuleContent] = useState<any>(null);
  const [showPagination, setShowPagination] = useState(false);

  // Register for module content notifications
  useEffect(() => {
    const handleModuleContentLoaded = (moduleContent: any) => {
      setSelectedModuleContent(moduleContent);
      setShowPagination(true);
    };

    registerPaginationCallback(handleModuleContentLoaded);

    return () => {
      unregisterPaginationCallback();
    };
  }, [registerPaginationCallback, unregisterPaginationCallback]);

  // Handle page changes from pagination
  const handlePageChange = useCallback((pageElements: any[]) => {
    
    // Create a simplified project structure for the page elements
    const projectData = {
      elements: pageElements,
      pages: [{
        id: 'current-page',
        title: 'Current Page',
        elements: pageElements,
        order: 0
      }]
    };
    
    importProject(JSON.stringify(projectData));
  }, [importProject]);

  // Handle saving updated content
  const handleSaveContent = useCallback((updatedContent: string) => {
    // This would integrate with the existing save mechanism
    // For now, just log the updated content
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Original ModulesTab */}
      <div className={showPagination ? 'flex-1' : 'h-full'}>
        <ModulesTab />
      </div>
      
      {/* Pagination Panel - Only show when a module is selected */}
      {showPagination && selectedModuleContent && (
        <div className="border-t border-gray-600">
          <ModulePagination
            moduleContent={selectedModuleContent}
            onPageChange={handlePageChange}
            onSave={handleSaveContent}
          />
        </div>
      )}
      
      {/* Debug Panel (removable) */}
      <div className="bg-gray-900 p-2 border-t border-gray-600">
        <div className="text-xs text-gray-400 mb-1">Debug: Pagination Integration</div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Test with sample content
              const sampleContent = {
                version: 2,
                elements: [
                  { id: '1', type: 'heading', text: 'Page 1 Title' },
                  { id: '2', type: 'paragraph', text: 'This is page 1 content' }
                ],
                pages: [
                  { id: 'page-1', title: 'Page 1', elementIds: ['1', '2'], order: 1 },
                  { id: 'page-2', title: 'Page 2', elementIds: [], order: 2 }
                ]
              };
              setSelectedModuleContent(JSON.stringify(sampleContent));
              setShowPagination(true);
            }}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            Test Pagination
          </button>
          <button
            onClick={() => setShowPagination(false)}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
          >
            Hide Pagination
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced ModulesTab with integrated pagination support
 * This wraps the existing ModulesTab and adds pagination functionality
 */
export const ModulesTabWithPagination: React.FC = () => {
  return (
    <ModulePaginationProvider>
      <ModulesTabWithPaginationInner />
    </ModulePaginationProvider>
  );
};

export default ModulesTabWithPagination;
