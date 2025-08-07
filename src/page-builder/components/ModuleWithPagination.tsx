import React, { useState, useCallback } from 'react';
import { useModuleSelectionV3 } from '../hooks/useModuleSelectionV3';
import PaginationUIV3 from '../components/PaginationUIV3';

interface ModuleWithPaginationProps {
  moduleData?: any;
  courseId?: string;
  onSave?: (content: string) => void;
}

/**
 * Enhanced module component with V3 pagination support
 * Can be integrated into existing ModulesTab or used standalone
 */
export const ModuleWithPagination: React.FC<ModuleWithPaginationProps> = ({
  moduleData,
  courseId,
  onSave
}) => {
  const {
    currentModuleV3,
    currentPageId,
    pages,
    totalPages,
    isLoading,
    loadModuleV3,
    switchToPage,
    createNewPage,
    deletePage,
    getSerializedV3Content
  } = useModuleSelectionV3();

  const [isInitialized, setIsInitialized] = useState(false);

  // Load module when data is provided
  React.useEffect(() => {
    if (moduleData && courseId && !isInitialized) {
      loadModuleV3(moduleData, courseId);
      setIsInitialized(true);
    }
  }, [moduleData, courseId, isInitialized, loadModuleV3]);

  // Handle page navigation
  const handlePageChange = useCallback((pageId: string) => {
    switchToPage(pageId);
  }, [switchToPage]);

  // Handle new page creation
  const handleCreatePage = useCallback(() => {
    const newPage = createNewPage();
    if (newPage) {
    }
  }, [createNewPage]);

  // Handle page deletion
  const handleDeletePage = useCallback((pageId: string) => {
    const success = deletePage(pageId);
    if (success) {
    }
  }, [deletePage]);

  // Handle save
  const handleSave = useCallback(() => {
    const content = getSerializedV3Content();
    if (onSave && content) {
      onSave(content);
    }
  }, [getSerializedV3Content, onSave]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 text-white p-4 text-center">
        <div className="text-sm text-gray-400">Loading pagination...</div>
      </div>
    );
  }

  if (!currentModuleV3) {
    return (
      <div className="bg-gray-800 text-white p-4 text-center">
        <div className="text-sm text-gray-400">No module loaded</div>
        <button
          onClick={() => {
            // Test with sample data
            const sampleModule = {
              id: 'test-module',
              title: 'Test Module',
              content: JSON.stringify([
                { id: '1', type: 'text', text: 'Sample element 1' },
                { id: '2', type: 'text', text: 'Sample element 2' }
              ])
            };
            loadModuleV3(sampleModule, 'test-course');
            setIsInitialized(true);
          }}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Load Test Module
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white">
      {/* Module Info */}
      <div className="px-4 py-2 border-b border-gray-600">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            📄 {currentModuleV3.content.metadata.moduleId}
          </div>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
          >
            Save V3
          </button>
        </div>
      </div>

      {/* Pagination UI */}
      <PaginationUIV3
        pages={pages}
        currentPageId={currentPageId}
        onPageChange={handlePageChange}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
        canDelete={totalPages > 1}
      />

      {/* Debug Info */}
      <div className="px-4 py-2 border-t border-gray-600 bg-gray-900">
        <div className="text-xs text-gray-400">
          V3 Format: {totalPages} page{totalPages !== 1 ? 's' : ''} | 
          Current: {pages.find(p => p.id === currentPageId)?.title || 'None'}
        </div>
      </div>
    </div>
  );
};

export default ModuleWithPagination;
