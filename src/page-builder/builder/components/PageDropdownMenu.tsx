import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import type { Page } from '../../types';

interface PageDropdownMenuProps {
  currentPage: Page;
  pages: Page[];
  position: { top: number; right: number };
  onCloseMenu: () => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

export const PageDropdownMenu: React.FC<PageDropdownMenuProps> = ({
  currentPage,
  pages,
  position,
  onCloseMenu,
  onDuplicatePage,
  onDeletePage,
}) => {
  const handleDuplicate = () => {
    onDuplicatePage(currentPage.id);
    onCloseMenu();
  };

  const handleDelete = () => {
    onDeletePage(currentPage.id);
    onCloseMenu();
  };

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onCloseMenu}>
      <div 
        className="absolute w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden"
        style={{
          top: position.top,
          right: position.right,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <button
            onClick={handleDuplicate}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-gray-100 flex items-center space-x-2"
          >
            <Copy size={12} />
            <span>Duplicar página</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center space-x-2"
            disabled={pages.length <= 1}
          >
            <Trash2 size={12} />
            <span>Eliminar página</span>
          </button>
        </div>
      </div>
    </div>
  );
};
