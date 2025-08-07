import React from 'react';
import { Edit3 } from 'lucide-react';
import type { Page } from '../../types';

interface PageTitleEditorProps {
  currentPage: Page | null;
  isEditing: boolean;
  editingTitle: string;
  onTitleChange: (title: string) => void;
  onStartEdit: () => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
}

export const PageTitleEditor: React.FC<PageTitleEditorProps> = ({
  currentPage,
  isEditing,
  editingTitle,
  onTitleChange,
  onStartEdit,
  onSaveTitle,
  onCancelEdit,
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="px-2 py-1 bg-gray-700 border border-gray-600 text-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-24"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSaveTitle();
            if (e.key === 'Escape') onCancelEdit();
          }}
          onBlur={onSaveTitle}
          autoFocus
        />
      </div>
    );
  }

  return (
    <button
      onClick={onStartEdit}
      className="px-2 py-1 text-xs font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded flex items-center space-x-1 whitespace-nowrap"
    >
      <span className="max-w-24 truncate">{currentPage?.title || 'Sin título'}</span>
      <Edit3 size={12} className="text-gray-400 flex-shrink-0" />
    </button>
  );
};
