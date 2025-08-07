/**
 * Pagination UI Component
 * Step 4: React component for managing page navigation and display
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit3 } from 'lucide-react';
import type { PageData } from '../types/pagination';

interface PaginationUIProps {
  currentPage: PageData;
  orderedPages: PageData[];
  canGoNext: boolean;
  canGoPrev: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSwitchToPage: (pageId: string) => void;
  onCreatePage: () => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePage: (pageId: string, updates: Partial<PageData>) => void;
  hasUnsavedChanges: boolean;
  error?: string | null;
}

export const PaginationUI: React.FC<PaginationUIProps> = ({
  currentPage,
  orderedPages,
  canGoNext,
  canGoPrev,
  onNextPage,
  onPrevPage,
  onSwitchToPage,
  onCreatePage,
  onDeletePage,
  onUpdatePage,
  hasUnsavedChanges,
  error
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(currentPage?.title || '');

  React.useEffect(() => {
    setEditTitle(currentPage?.title || '');
  }, [currentPage?.title]);

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== currentPage.title) {
      onUpdatePage(currentPage.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (orderedPages.length <= 1) {
      alert("Cannot delete the last page");
      return;
    }
    if (confirm(`Are you sure you want to delete "${orderedPages.find(p => p.id === pageId)?.title}"?`)) {
      onDeletePage(pageId);
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-600 p-3">
      {/* Error Display */}
      {error && (
        <div className="bg-red-800 text-red-200 px-3 py-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      {/* Page Title Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                className="bg-gray-700 text-white px-2 py-1 rounded text-lg font-semibold"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="text-green-400 hover:text-green-300"
              >
                ✓
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                {currentPage?.title || 'Untitled Page'}
              </h2>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-400 hover:text-white"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <span className="text-yellow-400 text-sm">● Unsaved changes</span>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          {/* Page Selector */}
          <div className="flex items-center gap-1">
            {orderedPages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => onSwitchToPage(page.id)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  page.id === currentPage?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title={page.title}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={onNextPage}
            disabled={!canGoNext}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Page Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCreatePage}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            title="Add new page"
          >
            <Plus size={16} />
            Add Page
          </button>

          {orderedPages.length > 1 && (
            <button
              onClick={() => handleDeletePage(currentPage.id)}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              title="Delete current page"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Page Info */}
      <div className="mt-2 text-xs text-gray-400 flex justify-between">
        <span>
          Page {orderedPages.findIndex(p => p.id === currentPage?.id) + 1} of {orderedPages.length}
        </span>
        <span>
          {currentPage?.elements?.length || 0} elements
        </span>
      </div>
    </div>
  );
};

export default PaginationUI;
