import React from 'react';

interface PaginationUIV3Props {
  pages: Array<{
    id: string;
    title: string;
    elements: any[];
    order: number;
  }>;
  currentPageId: string;
  onPageChange: (pageId: string) => void;
  onCreatePage: () => void;
  onDeletePage: (pageId: string) => void;
  canDelete: boolean;
}

/**
 * Pagination UI for V3 module content
 */
export const PaginationUIV3: React.FC<PaginationUIV3Props> = ({
  pages,
  currentPageId,
  onPageChange,
  onCreatePage,
  onDeletePage,
  canDelete
}) => {
  const currentPageIndex = pages.findIndex(p => p.id === currentPageId);
  const currentPage = pages[currentPageIndex];

  if (!currentPage) {
    return (
      <div className="bg-gray-800 text-white p-4 text-center">
        <div className="text-sm text-gray-400">No pages available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white border-t border-gray-600">
      {/* Page Info Header */}
      <div className="px-4 py-2 border-b border-gray-600">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">Current Page:</span>
            <span className="ml-2 font-medium">{currentPage.title}</span>
          </div>
          <div className="text-xs text-gray-400">
            {currentPage.elements.length} elements
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              const prevIndex = currentPageIndex > 0 ? currentPageIndex - 1 : pages.length - 1;
              onPageChange(pages[prevIndex].id);
            }}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
          >
            ← Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {currentPageIndex + 1} of {pages.length}
            </span>
            <select
              value={currentPageId}
              onChange={(e) => onPageChange(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 min-w-0"
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => {
              const nextIndex = currentPageIndex < pages.length - 1 ? currentPageIndex + 1 : 0;
              onPageChange(pages[nextIndex].id);
            }}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Page Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCreatePage}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            + Add Page
          </button>
          {canDelete && (
            <button
              onClick={() => onDeletePage(currentPageId)}
              className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Pages List */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-400 mb-2">All Pages ({pages.length})</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                page.id === currentPageId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => onPageChange(page.id)}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{page.title}</span>
                <span className="text-xs opacity-70 ml-2 flex-shrink-0">
                  {page.elements.length} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaginationUIV3;
