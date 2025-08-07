import { useState, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import type { Page } from '../../types';

/**
 * Hook for page management operations (add, duplicate, delete, edit)
 */
export function usePageManagement() {
  const { 
    course, 
    currentPage,
    addPage,
    removePage,
    duplicatePage,
    switchPage
  } = useBuilder();

  const pages = course?.pages || [];

  const handleAddPage = useCallback(() => {
    const newPageId = addPage(`Página ${pages.length + 1}`);
    switchPage(newPageId);
  }, [addPage, pages.length, switchPage]);

  const handleDuplicatePage = useCallback((pageId: string) => {
    const newPageId = duplicatePage(pageId);
    switchPage(newPageId);
  }, [duplicatePage, switchPage]);

  const handleDeletePage = useCallback((pageId: string) => {
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
  }, [pages, removePage, currentPage?.id, switchPage]);

  return {
    pages,
    handleAddPage,
    handleDuplicatePage,
    handleDeletePage,
  };
}

/**
 * Hook for page title editing
 */
export function usePageTitleEditor() {
  const { updatePage } = useBuilder();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditing = useCallback((page: Page) => {
    setEditingPageId(page.id);
    setEditingTitle(page.title);
  }, []);

  const saveTitle = useCallback(() => {
    if (editingPageId && editingTitle.trim()) {
      updatePage(editingPageId, { title: editingTitle.trim() });
    }
    setEditingPageId(null);
    setEditingTitle('');
  }, [editingPageId, editingTitle, updatePage]);

  const cancelEdit = useCallback(() => {
    setEditingPageId(null);
    setEditingTitle('');
  }, []);

  const isEditing = (pageId: string) => editingPageId === pageId;

  return {
    editingTitle,
    setEditingTitle,
    startEditing,
    saveTitle,
    cancelEdit,
    isEditing,
  };
}
