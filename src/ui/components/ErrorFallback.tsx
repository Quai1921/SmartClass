import React from 'react';
import { IconComponent } from '../pages/admin/components/Icon';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = "Error de conexión",
  message = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo nuevamente.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="bg-red-50 rounded-full p-4 mb-6">
        <IconComponent name="Close" size={48} color="#DC2626" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconComponent name="FolderSync" size={16} color="#FFFFFF" />
          Reintentar
        </button>
      )}
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Si el problema persiste, contacta al administrador del sistema</p>
      </div>
    </div>
  );
};
