import React from 'react';

interface ConnectionTabProps {
  properties: any;
  onPropertyChange: (property: string, value: any) => void;
}

export const ConnectionTab: React.FC<ConnectionTabProps> = ({ properties, onPropertyChange }) => {
  return (
    <div className="space-y-6">
      {/* Connection Settings */}
      <div className="space-y-4">
        <h5 className="text-md font-medium text-gray-300">Configuración de Conexión</h5>
        {/* Connection State */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Estado de Conexión</label>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              properties.connectionState === 'connected' 
                ? 'bg-green-500' 
                : properties.connectionState === 'connecting'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}></div>
            <span className="text-gray-300 text-sm capitalize">
              {properties.connectionState === 'connected' 
                ? 'Conectado' 
                : properties.connectionState === 'connecting'
                ? 'Conectando'
                : 'Desconectado'}
            </span>
          </div>
        </div>
        {/* Line Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Línea</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={properties.lineColor || '#3b82f6'}
              onChange={(e) => onPropertyChange('lineColor', e.target.value)}
              className="w-12 h-8 border border-gray-600 rounded cursor-pointer"
              disabled={properties.randomLineColor === true}
            />
            <input
              type="text"
              value={properties.lineColor || '#3b82f6'}
              onChange={(e) => onPropertyChange('lineColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#3b82f6"
              disabled={properties.randomLineColor === true}
            />
          </div>
          {/* Random Color Toggle */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-300 text-sm">Colores aleatorios por par</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={properties.randomLineColor === true}
                onChange={(e) => {
                  const useRandom = e.target.checked;
                  onPropertyChange('randomLineColor', useRandom);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {properties.randomLineColor === true && (
            <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700/30 rounded text-xs text-blue-300">
              💡 Cada par de nodos conectados recibe automáticamente un color único al conectarse
            </div>
          )}
        </div>
        {/* Connection Options */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Permitir reintentos</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={properties.allowRetry !== false}
              onChange={e => onPropertyChange('allowRetry', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      {/* Connection State Transparency */}
      <div className="space-y-4 border-t border-gray-600 pt-4">
        <h6 className="text-sm font-semibold text-gray-200 mb-2">Transparencia por Estado</h6>
        <div className="grid grid-cols-1 gap-4">
          {/* Connected State */}
          <div className="rounded-lg bg-gray-800 p-4 flex flex-col gap-2 border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Estado Conectado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Transparente al Conectar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={properties.connectedTransparency === 0 || properties.hideOnConnectedTransparency}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onPropertyChange('connectedTransparency', 0);
                      onPropertyChange('hideOnConnectedTransparency', true);
                    } else {
                      onPropertyChange('connectedTransparency', 100);
                      onPropertyChange('hideOnConnectedTransparency', false);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
              </label>
            </div>
          </div>
          {/* Targeted State */}
          <div className="rounded-lg bg-gray-800 p-4 flex flex-col gap-2 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Estado Objetivo</span>
            </div>
            <label className="block text-xs text-gray-300 mb-1">
              Transparencia como Objetivo: <span className="font-semibold text-purple-300">{properties.targetedTransparency ?? 100}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={properties.targetedTransparency ?? 100}
              onChange={(e) => onPropertyChange('targetedTransparency', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 