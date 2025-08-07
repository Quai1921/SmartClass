import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Module } from '../../../actions/modules/modules';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  onSave: (moduleId: string, updates: { title: string; description: string; status: string }) => Promise<void>;
}

export const EditModuleModal: React.FC<EditModuleModalProps> = ({
  isOpen,
  onClose,
  module,
  onSave,
}) => {
  const [title, setTitle] = useState(module?.title || '');
  const [description, setDescription] = useState(module?.description || '');
  const [status, setStatus] = useState(module?.status || 'DRAFT');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens with new module
  useEffect(() => {
    if (isOpen && module) {
      setTitle(module.title);
      setDescription(module.description || '');
      setStatus(module.status);
      setError(null);
    }
  }, [isOpen, module]);

  const handleSave = async () => {
    if (!module) {
      setError('No hay módulo seleccionado');
      return;
    }

    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(module.id, {
        title: title.trim(),
        description: description.trim(),
        status: status
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el módulo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Editar Módulo</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Module Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título del Módulo *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el título del módulo"
              autoFocus
              disabled={isSaving}
            />
          </div>

          {/* Module Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe brevemente el contenido del módulo"
              disabled={isSaving}
            />
          </div>

          {/* Module Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSaving}
            >
              <option value="DRAFT">Borrador</option>
              <option value="IN_REVIEW">En Revisión</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-6 pb-3 text-xs text-gray-500">
          <span>Presiona Esc para cancelar o Ctrl+Enter para guardar</span>
        </div>
      </div>
    </div>
  );
};
