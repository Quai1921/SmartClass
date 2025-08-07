import React from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { usePageNavigation } from './hooks/usePageNavigation';
import { usePageManagement, usePageTitleEditor } from './hooks/usePageManagement';
import { useDropdownMenu } from './hooks/useDropdownMenu';
import { PageNavigation } from './components/PageNavigation';
import { PageTitleEditor } from './components/PageTitleEditor';
import { PageActions } from './components/PageActions';

interface PageToolbarProps {
  className?: string;
}

/**
 * Refactored PageToolbar using modular hooks and components
 * Maintains exact same functionality and styling as the original
 */
export const PageToolbar: React.FC<PageToolbarProps> = ({ className = '' }) => {
  const { currentPage } = useBuilder();
  
  // Navigation hook for prev/next page functionality
  const {
    pages,
    currentPageIndex,
    canGoPrevious,
    canGoNext,
    goToPreviousPage,
    goToNextPage,
  } = usePageNavigation();

  // Page management hook for add/duplicate/delete operations
  const {
    handleAddPage,
    handleDuplicatePage,
    handleDeletePage,
  } = usePageManagement();

  // Title editing hook for inline page title editing
  const {
    editingTitle,
    setEditingTitle,
    startEditing,
    saveTitle,
    cancelEdit,
    isEditing,
  } = usePageTitleEditor();

  // Dropdown menu hook for page options menu
  const {
    menuRef,
    toggleMenu,
    closeMenu,
    isMenuOpen,
    getMenuPosition,
  } = useDropdownMenu();

  // Handler functions for component interactions
  const handleStartEdit = () => {
    if (currentPage) {
      startEditing(currentPage);
    }
  };

  const handleToggleMenu = () => {
    if (currentPage) {
      toggleMenu(currentPage.id);
    }
  };

  const handleMenuDuplicate = (pageId: string) => {
    handleDuplicatePage(pageId);
    closeMenu();
  };

  const handleMenuDelete = (pageId: string) => {
    handleDeletePage(pageId);
    closeMenu();
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Page Navigation Component */}
      <PageNavigation
        currentPageIndex={currentPageIndex}
        totalPages={pages.length}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />

      {/* Current Page Title Editor Component */}
      <div className="flex items-center">
        <PageTitleEditor
          currentPage={currentPage}
          isEditing={isEditing(currentPage?.id || '')}
          editingTitle={editingTitle}
          onTitleChange={setEditingTitle}
          onStartEdit={handleStartEdit}
          onSaveTitle={saveTitle}
          onCancelEdit={cancelEdit}
        />
      </div>

      {/* Page Actions Component */}
      <PageActions
        currentPage={currentPage}
        pages={pages}
        menuRef={menuRef}
        isMenuOpen={isMenuOpen(currentPage?.id || '')}
        onAddPage={handleAddPage}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={closeMenu}
        onDuplicatePage={handleMenuDuplicate}
        onDeletePage={handleMenuDelete}
        getMenuPosition={getMenuPosition}
      />
    </div>
  );
};
