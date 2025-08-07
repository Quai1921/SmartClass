import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  fileName: string;
  fileType?: 'file' | 'folder';
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  fileName,
  fileType = 'file',
}) => {
  const handleConfirm = () => {
    onConfirmDelete();
    onClose();
  };

  if (!isOpen) return null;

  const isFolder = fileType === 'folder';
  const isBatchDelete = fileName.includes('elementos:');
  const itemTypeSpanish = isBatchDelete ? 'elementos' : isFolder ? 'carpeta' : 'archivo';

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[10000]">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">
              Eliminar {itemTypeSpanish}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-gray-300">
            <p className="mb-2">
              {isBatchDelete 
                ? '¿Estás seguro de que deseas eliminar los siguientes elementos?'
                : `¿Estás seguro de que deseas eliminar ${isFolder ? 'la carpeta' : 'el archivo'}:`
              }
            </p>
            <p className="font-medium text-white bg-gray-700 px-3 py-2 rounded-lg break-all">
              "{fileName}"
            </p>
            {(isFolder || isBatchDelete) && (
              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ {isBatchDelete 
                  ? 'Esta acción eliminará múltiples archivos y/o carpetas con todo su contenido.'
                  : 'Esta acción también eliminará todo el contenido de la carpeta.'
                }
              </p>
            )}
            <p className="text-sm text-red-400 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <AlertTriangle size={16} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
