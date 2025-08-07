import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import type { Module } from '../../../actions/modules/modules';
import { ModuleCard } from './ModuleCard';

interface ModuleGridProps {
  filteredModules: Module[];
  searchTerm: string;
  onCreateModule: () => void;
  onEditModule: (moduleId: string) => void; // Quick edit (modal)
  onEditContent: (moduleId: string) => void; // Edit content (page builder)
  onDeleteModule: (moduleId: string) => void;
  onPublishModule: (moduleId: string) => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  filteredModules,
  searchTerm,
  onCreateModule,
  onEditModule,
  onEditContent,
  onDeleteModule,
  onPublishModule,
}) => {
  const displayModules = filteredModules;

  if (displayModules.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Sin módulos</h3>
        <p className="text-gray-500 mb-6">
          {searchTerm ? 'No se encontraron módulos que coincidan con tu búsqueda' : 'Comienza agregando el primer módulo a tu curso'}
        </p>
        {!searchTerm && (
          <button
            onClick={onCreateModule}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Crear primer módulo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayModules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          onEdit={onEditModule}
          onEditContent={onEditContent}
          onDelete={onDeleteModule}
          onPublish={onPublishModule}
        />
      ))}
    </div>
  );
};
