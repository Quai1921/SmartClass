import React from 'react';
import { Edit3, Eye, Trash2, Calendar, Clock, FileEdit } from 'lucide-react';
import type { Module } from '../../../actions/modules/modules';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
import { Tooltip } from '../../builder/components/properties/Tooltip';

interface ModuleCardProps {
  module: Module;
  onEdit: (moduleId: string) => void; // Quick edit (modal)
  onEditContent: (moduleId: string) => void; // Edit content (page builder)
  onDelete: (moduleId: string) => void;
  onPublish: (moduleId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onEdit,
  onEditContent,
  onDelete,
  onPublish,
}) => {
  const isDraft = module.status === 'DRAFT';

  return (
    <div className={`bg-gray-800 border rounded-lg overflow-hidden hover:border-gray-600 transition-colors group flex flex-col h-full ${
      isDraft ? 'border-yellow-600/50 shadow-yellow-900/20' : 'border-gray-700'
    }`}>
      {/* Draft Indicator Stripe */}
      {isDraft && (
        <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
      )}
      
      {/* Module Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
              isDraft ? 'bg-yellow-600' : 'bg-blue-600'
            }`}>
              {module.order || '?'}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              module.status === 'PUBLISHED' 
                ? 'bg-green-900 text-green-300 border border-green-700'
                : module.status === 'IN_REVIEW'
                ? 'bg-orange-900 text-orange-300 border border-orange-700'
                : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
            }`}>
              {module.status === 'PUBLISHED' ? 'Publicado' : module.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            module.type === 'ACADEMIC' 
              ? 'bg-blue-900 text-blue-300' 
              : 'bg-purple-900 text-purple-300'
          }`}>
            {module.type === 'ACADEMIC' ? 'Académico' : 'Evaluativo'}
          </span>
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 line-clamp-2 leading-tight ${
          isDraft ? 'text-yellow-100' : 'text-white'
        }`}>
          {module.title}
        </h3>
      </div>

      {/* Module Content - Flexible space */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-1">
          {module.description && module.description.length > 0
            ? (module.description.length > 120 
                ? `${module.description.substring(0, 120)}...` 
                : module.description)
            : 'Sin descripción'
          }
        </p>

        {/* Module Meta and Actions - Always at bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{module.estimatedTime || 30} min</span>
              </div>
              {module.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span title={`Creado: ${formatDateTime(module.createdAt)}`}>
                    {formatDate(module.createdAt)}
                  </span>
                </div>
              )}
              {module.updatedAt && module.updatedAt !== module.createdAt && (
                <div className="flex items-center space-x-1" title={`Última actualización: ${formatDateTime(module.updatedAt)}`}>
                  <Edit3 size={12} />
                  <span className="text-orange-400">
                    {formatDate(module.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Module Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Tooltip text="Editar detalles del módulo (nombre, estado, descripción)">
                <button
                  onClick={() => onEdit(module.id)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </Tooltip>
              <Tooltip text="Editar contenido del módulo en el constructor">
                <button
                  onClick={() => onEditContent(module.id)}
                  className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FileEdit size={16} />
                </button>
              </Tooltip>
              <Tooltip text={module.status === 'PUBLISHED' ? 'Despublicar módulo' : module.status === 'IN_REVIEW' ? 'Aprobar módulo' : 'Publicar módulo'}>
                <button
                  onClick={() => onPublish(module.id)}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye size={16} />
                </button>
              </Tooltip>
              <Tooltip text="Eliminar módulo permanentemente">
                <button
                  onClick={() => onDelete(module.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
