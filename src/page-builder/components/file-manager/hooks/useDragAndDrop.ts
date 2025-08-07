import { useState, useCallback } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { StoredFile } from '../types';

export const useDragAndDrop = (
  files: StoredFile[],
  moveFileToFolder: (fileId: string, targetFolderId: string | undefined) => void
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setActiveId(null);
      return;
    }

    const draggedFileId = active.id as string;
    const targetFolderId = over.id === 'root' ? undefined : over.id as string;
    
    // Find the dragged file
    const draggedFile = files.find(file => file.id === draggedFileId);
    if (!draggedFile) {
      setActiveId(null);
      return;
    }

    // If file is already in the target folder, do nothing
    if (draggedFile.folderId === targetFolderId) {
      setActiveId(null);
      return;
    }

    // Move file to new folder
    moveFileToFolder(draggedFileId, targetFolderId);
    setActiveId(null);
  }, [files, moveFileToFolder]);

  const getActiveFile = useCallback(() => {
    return activeId ? files.find(file => file.id === activeId) : null;
  }, [activeId, files]);

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
    getActiveFile,
  };
};
