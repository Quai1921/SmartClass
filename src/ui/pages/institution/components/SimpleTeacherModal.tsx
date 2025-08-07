import React from 'react';

interface SimpleTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  teacher?: any;
}

export const SimpleTeacherModal: React.FC<SimpleTeacherModalProps> = ({
  isOpen,
  onClose,
  mode,
  teacher
}) => {


  // Early return if not open to prevent unnecessary rendering
  if (!isOpen) {

    return null;
  }


  // Simplified render for debugging
  try {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {mode === 'edit' ? 'Editar Profesor' : 'Crear Profesor'}
          </h3>
          <p className="text-gray-700 mb-4">
            Modal de prueba funcionando correctamente. Mode: {mode}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Cerrar
            </button>
            <button 
              onClick={() => console.log('Test button clicked')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Test
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // console.error('❌ SimpleTeacherModal render error:', error);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">Error al cargar el modal del profesor: {(error as Error)?.message}</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }
};
