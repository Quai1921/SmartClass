import React, { useState } from 'react';
import { X, BookOpen, FileText } from 'lucide-react';

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateModule: (type: 'ACADEMIC' | 'EVALUATIVE', title: string, description?: string) => void;
  courseName: string;
}

export const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  isOpen,
  onClose,
  onCreateModule,
  courseName,
}) => {
  const [moduleType, setModuleType] = useState<'ACADEMIC' | 'EVALUATIVE'>('ACADEMIC');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateModule(moduleType, title.trim(), description.trim() || undefined);
      // Reset form
      setTitle('');
      setDescription('');
      setModuleType('ACADEMIC');
      onClose();
    } catch (error) {
      // console.error('Error creating module:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setTitle('');
      setDescription('');
      setModuleType('ACADEMIC');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Crear Nuevo Módulo</h3>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-4">
              Creando módulo para el curso: <span className="text-white font-medium">{courseName}</span>
            </p>
          </div>

          {/* Module Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de Módulo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModuleType('ACADEMIC')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  moduleType === 'ACADEMIC'
                    ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <BookOpen size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">Académico</div>
                <div className="text-xs text-gray-400 mt-1">Contenido educativo</div>
              </button>
              
              <button
                type="button"
                onClick={() => setModuleType('EVALUATIVE')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  moduleType === 'EVALUATIVE'
                    ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <FileText size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">Evaluativo</div>
                <div className="text-xs text-gray-400 mt-1">Exámenes y tareas</div>
              </button>
            </div>
          </div>

          {/* Module Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Título del Módulo *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Introducción a las fracciones"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isCreating}
            />
          </div>

          {/* Module Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el contenido de este módulo..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isCreating}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creando...' : 'Crear Módulo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
