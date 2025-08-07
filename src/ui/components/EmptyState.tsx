import React from 'react';
import { IconComponent } from '../pages/admin/components/Icon';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No hay datos",
  message = "No se encontraron elementos para mostrar.",
  actionLabel,
  onAction,
  icon = "SearchIcon"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="bg-gray-50 rounded-full p-4 mb-6">
        <IconComponent name={icon as keyof typeof import('../pages/admin/components/Icons')} size={48} color="#9CA3AF" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconComponent name="Plus" size={16} color="#FFFFFF" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
