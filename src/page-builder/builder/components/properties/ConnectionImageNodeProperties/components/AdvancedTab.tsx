import React from 'react';

interface AdvancedTabProps {
  properties: any;
  element: any;
  onPropertyChange: (property: string, value: any) => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ properties, element, onPropertyChange }) => {
  return (
    <div className="space-y-6">
      {/* Reset Connection */}
      {properties.connectionState === 'connected' && (
        <div>
          <button
            onClick={() => {
              onPropertyChange('connectionState', 'disconnected');
              onPropertyChange('connectedNodeId', undefined);
            }}
            className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
          >
            Resetear Conexión (Modo Edición)
          </button>
        </div>
      )}
      {/* Connection Group Info */}
      {properties.connectionGroupId && (
        <div className="bg-gray-800 p-3 rounded">
          <h6 className="text-sm font-medium text-gray-300 mb-2">Información del Grupo</h6>
          <p className="text-xs text-gray-400 break-all">
            ID del Grupo: {properties.connectionGroupId}
          </p>
        </div>
      )}
      {/* Debug Information */}
      <div className="bg-gray-800 p-3 rounded">
        <h6 className="text-sm font-medium text-gray-300 mb-2">Información de Debug</h6>
        <div className="text-xs text-gray-400 space-y-1">
          <div>Element ID: {element.id}</div>
          <div>Content Type: {properties.contentType || 'image'}</div>
          <div>Connection State: {properties.connectionState || 'disconnected'}</div>
          {properties.imageUrl && <div>Image URL: {properties.imageUrl.slice(0, 50)}...</div>}
        </div>
      </div>
    </div>
  );
}; 