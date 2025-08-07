import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Eye, AlertCircle } from 'lucide-react';

type ModuleType = 'ACADEMIC' | 'EVALUATIVE';
type ModuleStatus = 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';

interface ModuleEditModalProps {
  isOpen: boolean;
  module: any;
  onClose: () => void;
  onSave: (moduleData: {
    title: string;
    description: string;
    type: ModuleType;
    status: ModuleStatus;
    content?: string;
  }) => void;
  isSaving?: boolean;
  title?: string; // Optional custom title
  subtitle?: string; // Optional custom subtitle
}

const statusOptions: Array<{
  value: ModuleStatus;
  label: string;
  description: string;
  color: string;
  icon: any;
}> = [
  {
    value: 'DRAFT',
    label: 'Borrador',
    description: 'El módulo está en desarrollo',
    color: 'text-gray-600',
    icon: Clock
  },
  {
    value: 'IN_REVIEW',
    label: 'En Revisión',
    description: 'El módulo está siendo revisado',
    color: 'text-orange-600',
    icon: AlertCircle
  },
  {
    value: 'PUBLISHED',
    label: 'Publicado',
    description: 'El módulo está disponible para estudiantes',
    color: 'text-green-600',
    icon: Eye
  }
];

export const ModuleEditModal: React.FC<ModuleEditModalProps> = ({
  isOpen,
  module,
  onClose,
  onSave,
  isSaving = false,
  title,
  subtitle
}) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: ModuleType;
    status: ModuleStatus;
    content: string;
  }>({
    title: '',
    description: '',
    type: 'ACADEMIC',
    status: 'DRAFT',
    content: ''
  });

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        type: module.type || 'ACADEMIC',
        status: module.status || 'DRAFT',
        content: module.content || ''
      });
    } else {
      // Reset form for creating new module
      setFormData({
        title: '',
        description: '',
        type: 'ACADEMIC',
        status: 'DRAFT',
        content: ''
      });
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {title || (module ? 'Editar Módulo' : 'Crear Nuevo Módulo')}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {subtitle || (module ? 'Modifica la información del módulo y actualiza su estado' : 'Ingresa la información para crear un nuevo módulo')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título del Módulo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ingresa el título del módulo"
              required
              disabled={isSaving}
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Describe el contenido del módulo..."
              disabled={isSaving}
            />
          </div>

          {/* Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Módulo
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isSaving}
            >
              <option value="ACADEMIC">Académico - Contenido educativo y materiales de aprendizaje</option>
              <option value="EVALUATIVE">Evaluativo - Exámenes, cuestionarios y evaluaciones</option>
            </select>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Estado del Módulo
            </label>
            <div className="space-y-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.status === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="sr-only"
                      disabled={isSaving}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        formData.status === option.value ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {formData.status === option.value && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700 bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !formData.title.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Módulo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
