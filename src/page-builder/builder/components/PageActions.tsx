import React from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { PageDropdownMenu } from './PageDropdownMenu';
import type { Page } from '../../types';

interface PageActionsProps {
  currentPage: Page | null;
  pages: Page[];
  menuRef: React.RefObject<HTMLDivElement | null>;
  isMenuOpen: boolean;
  onAddPage: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  getMenuPosition: () => { top: number; right: number };
}

export const PageActions: React.FC<PageActionsProps> = ({
  currentPage,
  pages,
  menuRef,
  isMenuOpen,
  onAddPage,
  onToggleMenu,
  onCloseMenu,
  onDuplicatePage,
  onDeletePage,
  getMenuPosition,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {/* Add Page */}
      <button
        onClick={onAddPage}
        className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
        title="Agregar página"
      >
        <Plus size={16} />
      </button>

      {/* Page Menu */}
      {currentPage && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={onToggleMenu}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded"
            title="Opciones de página"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <PageDropdownMenu
              currentPage={currentPage}
              pages={pages}
              onCloseMenu={onCloseMenu}
              onDuplicatePage={onDuplicatePage}
              onDeletePage={onDeletePage}
              position={getMenuPosition()}
            />
          )}
        </div>
      )}
    </div>
  );
};
