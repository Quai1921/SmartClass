import React from 'react';
import { FileText, Trash2, Settings } from 'lucide-react';
import { formatDateRelative } from '../../../../../../utils/dateUtils';
import { getModuleCardStyling, getModuleIconStyling } from '../utils/moduleStyling';

interface ModuleCardProps {
  module: any;
  currentModuleInfo: any;
  updatingModuleId: string | null;
  isServerDown?: boolean;
  onModuleSelect: (module: any) => void;
  onDeleteModule: (module: any, event: React.MouseEvent) => void;
  onEditModule: (module: any) => void;
  onStatusChange: (moduleId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  currentModuleInfo,
  updatingModuleId,
  isServerDown = false,
  onModuleSelect,
  onDeleteModule,
  onEditModule,
  onStatusChange
}) => {
  const cardStyling = getModuleCardStyling(module, currentModuleInfo);
  const iconStyling = getModuleIconStyling(module, currentModuleInfo);

  // Check if this module should be disabled
  const isDisabled = isServerDown && !module.isDraft;

  // Debug: Log what we're rendering

  const handleCardClick = () => {
    if (isDisabled) {
      return; // Don't allow clicking on disabled modules
    }
    onModuleSelect(module);
  };

  return (
    <div
      key={module.id}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 group hover:shadow-xl border backdrop-blur-sm ${cardStyling.border} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Status indicator stripe at top */}
      <div className={`h-1.5 w-full transition-all duration-300 ${cardStyling.stripe}`}></div>
      
      <div className="px-5 py-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${iconStyling}`}>
              <FileText className="w-4 h-4" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and badges row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 
                className={`text-sm font-semibold text-white truncate leading-tight transition-colors ${
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-blue-300'
                }`}
                onClick={handleCardClick}
                title={module.title}
              >
                {module.title}
              </h4>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Current Module Badge */}
                {currentModuleInfo?.id === module.id && (
                  <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-md font-medium">
                    EDITANDO
                  </span>
                )}
                {/* Edit/Manage Button */}
                <button
                  onClick={() => onEditModule(module)}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-md transition-all duration-200 hover:scale-105 flex items-center gap-1"
                  title="Editar módulo"
                >
                  <Settings className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Delete Button - Shows for all modules */}
          <button
            onClick={(e) => onDeleteModule(module, e)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 flex-shrink-0 hover:scale-110 hover:shadow-sm"
            title="Eliminar módulo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Info section: type, dates, progress, status - spans full width */}
        <div className="w-full mt-1">
          <div className="flex flex-row items-center gap-3 text-xs mb-2">
            <span className="text-gray-300 font-medium uppercase tracking-wide whitespace-nowrap">
              {module.type}
            </span>
            <span className="text-gray-500 select-none">•</span>
            <div className="flex flex-col gap-0.5 text-gray-400 flex-1 min-w-0">
              <span className="flex items-center gap-1 whitespace-nowrap truncate" title={`Creado: ${module.createdAt ? new Date(module.createdAt).toLocaleString() : 'Desconocido'}`}> 
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-medium text-gray-300">Creado:</span> {formatDateRelative(module.createdAt)}
              </span>
              {module.updatedAt && module.updatedAt !== module.createdAt && (
                <span className="flex items-center gap-1 text-orange-400 whitespace-nowrap truncate" title={`Editado: ${new Date(module.updatedAt).toLocaleString()}`}> 
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                  <span className="font-medium">Editado:</span> {formatDateRelative(module.updatedAt)}
                </span>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2 mb-1 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
                module.status === 'PUBLISHED' ? 'bg-gradient-to-r from-green-500 to-emerald-400 w-full shadow-green-500/20' :
                module.status === 'IN_REVIEW' ? 'bg-gradient-to-r from-yellow-500 to-amber-400 w-3/4 shadow-yellow-500/20' :
                'bg-gradient-to-r from-orange-500 to-red-400 w-1/3 shadow-orange-500/20'
              }`}
            ></div>
          </div>
          {/* Status text */}
          <div className="text-xs text-gray-400">
            {module.status === 'PUBLISHED' ? 'Módulo publicado' :
             module.status === 'IN_REVIEW' ? 'En revisión' :
             'Borrador'}
          </div>
        </div>
      </div>
    </div>
  );
};
