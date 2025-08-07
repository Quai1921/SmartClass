import React from 'react';

interface ModuleActionsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const ModuleActions: React.FC<ModuleActionsProps> = ({
  onSaveDraft,
  onPublish
}) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <button
        onClick={onSaveDraft}
        className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        title="Guardar como borrador local"
      >
        Guardar Borrador
      </button>
      
      <button
        onClick={onPublish}
        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        title="Publicar curso - Revisar y actualizar información antes de publicar"
      >
        Publicar Curso
      </button>
    </div>
  );
};
