import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { ModuleCard } from './ModuleCard';

interface ModulesListProps {
  modules: any[];
  loading: boolean;
  currentModuleInfo: any;
  updatingModuleId: string | null;
  isServerDown?: boolean;
  onModuleSelect: (module: any) => void;
  onDeleteModule: (module: any, event: React.MouseEvent) => void;
  onEditModule: (module: any) => void;
  onStatusChange: (moduleId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => void;
  onCreateNewModule: () => void;
}

export const ModulesList: React.FC<ModulesListProps> = ({
  modules,
  loading,
  currentModuleInfo,
  updatingModuleId,
  isServerDown = false,
  onModuleSelect,
  onDeleteModule,
  onEditModule,
  onStatusChange,
  onCreateNewModule
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-sm font-semibold text-gray-200">
            Módulos del curso ({modules.length})
          </h4>
          <button
            onClick={onCreateNewModule}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p>Cargando módulos...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-700/50 flex items-center justify-center">
              <FileText className="w-8 h-8 opacity-60" />
            </div>
            <p className="mb-2 text-gray-300 font-medium">No hay módulos en este curso</p>
            <p className="mb-6 text-sm text-gray-500">Crea el primer módulo para empezar</p>
            <button
              onClick={onCreateNewModule}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm rounded-xl transition-all duration-200 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Crear primer módulo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                currentModuleInfo={currentModuleInfo}
                updatingModuleId={updatingModuleId}
                isServerDown={isServerDown}
                onModuleSelect={onModuleSelect}
                onDeleteModule={onDeleteModule}
                onEditModule={onEditModule}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
