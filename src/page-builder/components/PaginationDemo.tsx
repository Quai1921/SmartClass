/**
 * Pagination Demo Component
 * Step 5: Simple demo to test our pagination system
 */

import React from 'react';
import { usePagination } from '../hooks/usePagination';
import { PaginationUI } from '../components/PaginationUI';
import type { Element } from '../types';

const PaginationDemo: React.FC = () => {
  const pagination = usePagination();

  // Helper to add a test element to current page
  const addTestElement = () => {
    const newElement: Element = {
      id: `element_${Date.now()}`,
      type: 'text',
      name: `Test Element ${(pagination.currentPage?.elements.length || 0) + 1}`,
      properties: {
        text: `Test element ${(pagination.currentPage?.elements.length || 0) + 1}`,
        style: {
          position: 'absolute',
          left: Math.random() * 400,
          top: Math.random() * 300 + 100,
          width: 200,
          height: 50
        }
      }
    };

    pagination.addElementToPage(pagination.content.currentPageId, newElement);
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      {/* Pagination UI */}
      <PaginationUI
        currentPage={pagination.currentPage}
        orderedPages={pagination.orderedPages}
        canGoNext={pagination.canGoNext}
        canGoPrev={pagination.canGoPrev}
        onNextPage={pagination.nextPage}
        onPrevPage={pagination.prevPage}
        onSwitchToPage={pagination.switchToPage}
        onCreatePage={() => pagination.createPage()}
        onDeletePage={pagination.deletePage}
        onUpdatePage={pagination.updatePage}
        hasUnsavedChanges={pagination.hasUnsavedChanges}
        error={pagination.error}
      />

      {/* Content Area */}
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={addTestElement}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Test Element
          </button>
        </div>

        {/* Current Page Content */}
        <div className="border border-gray-600 rounded-lg p-4 bg-gray-800 min-h-96 relative">
          <h3 className="text-lg font-semibold mb-4">
            Current Page: {pagination.currentPage?.title}
          </h3>
          
          {/* Render Elements */}
          {pagination.currentPage?.elements.map((element) => (
            <div
              key={element.id}
              className="absolute bg-blue-600 text-white p-2 rounded text-sm cursor-pointer hover:bg-blue-700"
              style={{
                left: element.properties.style?.left || 0,
                top: element.properties.style?.top || 0,
                width: element.properties.style?.width || 'auto',
                height: element.properties.style?.height || 'auto'
              }}
              onClick={() => {
                if (confirm('Delete this element?')) {
                  pagination.removeElementFromPage(pagination.content.currentPageId, element.id);
                }
              }}
            >
              {element.properties.text || element.name}
            </div>
          ))}

          {pagination.currentPage?.elements.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No elements on this page. Click "Add Test Element" to add some!
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify({
              currentPageId: pagination.content.currentPageId,
              totalPages: pagination.content.totalPages,
              hasUnsavedChanges: pagination.hasUnsavedChanges,
              currentPageElements: pagination.currentPage?.elements.length || 0,
              error: pagination.error
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PaginationDemo;
