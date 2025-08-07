import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Edit3,
  MoreVertical
} from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import type { Page } from '../types';

interface PageToolbarProps {
  className?: string;
}

export const PageToolbar: React.FC<PageToolbarProps> = ({ className = '' }) => {
  const { 
    course, 
    currentPage,
    addPage,
    removePage,
    duplicatePage,
    switchPage,
    updatePage
  } = useBuilder();

  const [showPageMenu, setShowPageMenu] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside (not needed anymore since we handle it in the overlay)
  // The overlay div handles the click outside functionality

  const pages = course?.pages || [];
  const currentPageIndex = pages.findIndex(page => page.id === currentPage?.id);

  const handleAddPage = () => {
    const newPageId = addPage(`Página ${pages.length + 1}`);
    switchPage(newPageId);
  };

  const handleDuplicatePage = (pageId: string) => {
    const newPageId = duplicatePage(pageId);
    switchPage(newPageId);
    setShowPageMenu(null);
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      alert('No puedes eliminar la única página del módulo');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta página?')) {
      const pageIndex = pages.findIndex(p => p.id === pageId);
      removePage(pageId);
      
      // Switch to another page if we deleted the current one
      if (currentPage?.id === pageId) {
        const newIndex = Math.max(0, pageIndex - 1);
        if (pages[newIndex] && pages[newIndex].id !== pageId) {
          switchPage(pages[newIndex].id);
        }
      }
    }
    setShowPageMenu(null);
  };

  const handleEditTitle = (page: Page) => {
    setEditingPageId(page.id);
    setEditingTitle(page.title);
    setShowPageMenu(null);
  };

  const handleSaveTitle = () => {
    if (editingPageId && editingTitle.trim()) {
      updatePage(editingPageId, { title: editingTitle.trim() });
    }
    setEditingPageId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingTitle('');
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (currentPageIndex > 0) {
              switchPage(pages[currentPageIndex - 1].id);
            }
          }}
          disabled={currentPageIndex <= 0}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        
        <span className="text-xs font-medium text-gray-300 px-2 whitespace-nowrap">
          {currentPageIndex + 1} de {pages.length}
        </span>
        
        <button
          onClick={() => {
            if (currentPageIndex < pages.length - 1) {
              switchPage(pages[currentPageIndex + 1].id);
            }
          }}
          disabled={currentPageIndex >= pages.length - 1}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Current Page Title */}
      <div className="flex items-center">
        {editingPageId === currentPage?.id ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="px-2 py-1 bg-gray-700 border border-gray-600 text-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-24"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              onBlur={handleSaveTitle}
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => currentPage && handleEditTitle(currentPage)}
            className="px-2 py-1 text-xs font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded flex items-center space-x-1 whitespace-nowrap"
          >
            <span className="max-w-24 truncate">{currentPage?.title || 'Sin título'}</span>
            <Edit3 size={12} className="text-gray-400 flex-shrink-0" />
          </button>
        )}
      </div>

      {/* Page Actions */}
      <div className="flex items-center space-x-1">
        {/* Add Page */}
        <button
          onClick={handleAddPage}
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
          title="Agregar página"
        >
          <Plus size={16} />
        </button>

        {/* Page Menu */}
        {currentPage && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowPageMenu(showPageMenu === currentPage.id ? null : currentPage.id)}
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded"
              title="Opciones de página"
            >
              <MoreVertical size={16} />
            </button>

            {showPageMenu === currentPage.id && (
              <div className="fixed inset-0 z-[9999]" onClick={() => setShowPageMenu(null)}>
                <div 
                  className="absolute w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden"
                  style={{
                    top: menuRef.current?.getBoundingClientRect().bottom ? 
                      menuRef.current.getBoundingClientRect().bottom + 4 : 'auto',
                    right: window.innerWidth - (menuRef.current?.getBoundingClientRect().right || 0),
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleDuplicatePage(currentPage.id)}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-gray-100 flex items-center space-x-2"
                    >
                      <Copy size={12} />
                      <span>Duplicar página</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeletePage(currentPage.id)}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center space-x-2"
                      disabled={pages.length <= 1}
                    >
                      <Trash2 size={12} />
                      <span>Eliminar página</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
