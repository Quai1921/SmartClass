import React from 'react';

interface TabNavigationProps {
  activeTab: 'basic' | 'styling' | 'connection' | 'advanced';
  setActiveTab: (tab: 'basic' | 'styling' | 'connection' | 'advanced') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-200 mb-4">Nodo de Imagen</h4>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-3 py-2 rounded text-sm ${
            activeTab === 'basic'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Básico
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`px-3 py-2 rounded text-sm ${
            activeTab === 'styling'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Estilo
        </button>
        <button
          onClick={() => setActiveTab('connection')}
          className={`px-3 py-2 rounded text-sm ${
            activeTab === 'connection'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Conexión
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-3 py-2 rounded text-sm ${
            activeTab === 'advanced'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Avanzado
        </button>
      </div>
    </div>
  );
}; 