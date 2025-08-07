import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface RootDroppableProps {
  children: React.ReactNode;
  currentFolderId: string | undefined;
}

export const RootDroppable: React.FC<RootDroppableProps> = ({ 
  children, 
  currentFolderId 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'root',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
        isOver && currentFolderId ? 'bg-blue-500/5 rounded-xl p-4' : ''
      }`}
    >
      {children}
    </div>
  );
};
