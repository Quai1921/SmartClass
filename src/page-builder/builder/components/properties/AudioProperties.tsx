import React, { useState } from 'react';
import { Upload, X, Play, Volume2, AudioWaveform, Music, Disc, Radio, Headphones, Mic, Speaker, VolumeX } from 'lucide-react';
import type { Element } from '../../../types';
import { BorderSelector } from './BorderSelector';

interface AudioPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  openAudioChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

// Icon options for the dropdown
const iconOptions = [
  { value: 'audio-waveform', label: 'Audio Waveform', icon: AudioWaveform },
  { value: 'volume2', label: 'Volume', icon: Volume2 },
  { value: 'volume-x', label: 'Volume Muted', icon: VolumeX },
  { value: 'speaker', label: 'Speaker', icon: Speaker },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'disc', label: 'Disc', icon: Disc },
  { value: 'radio', label: 'Radio', icon: Radio },
  { value: 'headphones', label: 'Headphones', icon: Headphones },
  { value: 'mic', label: 'Microphone', icon: Mic },
];

export const AudioProperties: React.FC<AudioPropertiesProps> = ({
  element,
  onPropertyChange,
  openAudioChoiceModal,
}) => {
  const properties = element.properties as any;
  const [audioModalOpen, setAudioModalOpen] = useState(false);

  const handleAudioSelect = (src: string, title?: string) => {
    onPropertyChange('src', src);
    onPropertyChange('title', title || 'Audio');
    setAudioModalOpen(false);
  };

  const removeAudio = () => {
    onPropertyChange('src', '');
    onPropertyChange('title', '');
  };

  const handleOpenAudioModal = () => {
    // Set up global callback for audio selection
    (window as any).connectionAudioCallback = (src: string) => {
      handleAudioSelect(src, 'Audio');
    };
    (window as any).connectionAudioElementId = element.id;
    
    if (openAudioChoiceModal) {
      // Use the proper audio choice modal with file manager integration
      openAudioChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      // Fallback to simple modal
      setAudioModalOpen(true);
    }
  };

  const selectedIcon = iconOptions.find(option => option.value === (properties.iconType || 'audio-waveform'));
  const SelectedIconComponent = selectedIcon?.icon || AudioWaveform;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Audio</h4>
        <p className="text-sm text-gray-400">
          Personaliza completamente la apariencia y comportamiento del widget de audio.
        </p>
      </div>

      {/* Audio Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Audio</label>
        
        {properties.src ? (
          <div className="relative p-4 bg-gray-700 rounded border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-blue-400" />
                <span className="text-sm text-gray-300">{properties.title || 'Audio cargado'}</span>
              </div>
              <button
                onClick={removeAudio}
                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
            <audio controls className="w-full mt-3">
              <source src={properties.src} />
              Tu navegador no soporta audio.
            </audio>
          </div>
        ) : (
          <div className="w-full h-24 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin audio seleccionado</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleOpenAudioModal}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            {properties.src ? 'Cambiar audio' : 'Seleccionar audio'}
          </button>
          {properties.src && (
            <button
              onClick={removeAudio}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Icono del Audio</label>
        <div className="space-y-4">
          {/* Icon Type Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Tipo de Icono</label>
            <div className="relative">
              <select
                value={properties.iconType || 'audio-waveform'}
                onChange={(e) => onPropertyChange('iconType', e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none appearance-none pr-10"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SelectedIconComponent size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Customization */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Personalización del Botón</label>
        <div className="space-y-4 p-4 bg-gray-700 rounded border border-gray-600">
          {/* Button Colors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.backgroundColor || '#4b5563'}
                    onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.backgroundColor || '#4b5563'}
                  onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#4b5563"
                />
                <button
                  type="button"
                  onClick={() => onPropertyChange('backgroundColor', 'transparent')}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded text-xs transition-colors"
                  title="Hacer transparente"
                >
                  Transparente
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color cuando Reproduzca</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.playingColor || '#7c3aed'}
                    onChange={(e) => onPropertyChange('playingColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.playingColor || '#7c3aed'}
                  onChange={(e) => onPropertyChange('playingColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#7c3aed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color del Ícono</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.iconColor || '#ffffff'}
                    onChange={(e) => onPropertyChange('iconColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.iconColor || '#ffffff'}
                  onChange={(e) => onPropertyChange('iconColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Button Size */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Tamaño del Botón</span>
              <span>{properties.buttonSize || 48}px</span>
            </label>
            <input
              type="range"
              min="32"
              max="120"
              step="4"
              value={properties.buttonSize || 48}
              onChange={(e) => onPropertyChange('buttonSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>32px</span>
              <span>120px</span>
            </div>
          </div>

          {/* Icon Size */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Tamaño del Ícono</span>
              <span>{properties.iconSize || 20}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="80"
              step="2"
              value={properties.iconSize || 20}
              onChange={(e) => onPropertyChange('iconSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>80px</span>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Radio del Borde</span>
              <span>{properties.borderRadius !== undefined ? properties.borderRadius : 50}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={properties.borderRadius !== undefined ? properties.borderRadius : 50}
              onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0% (Cuadrado)</span>
              <span>50% (Circular)</span>
            </div>
          </div>

          {/* Border Configuration */}
          <div>
            <BorderSelector
              borderWidth={properties.borderWidth || 0}
              borderColor={properties.borderColor || '#e2e8f0'}
              borderStyle={properties.borderStyle || 'solid'}
              onBorderWidthChange={(width) => onPropertyChange('borderWidth', width)}
              onBorderColorChange={(color) => onPropertyChange('borderColor', color)}
              onBorderStyleChange={(style) => onPropertyChange('borderStyle', style)}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> El widget de audio es completamente personalizable. Puedes cambiar el icono, colores, tamaño y bordes para que coincida con el diseño de tu aplicación.
        </p>
      </div>

      {/* Fallback Audio Modal (when openAudioChoiceModal is not available) */}
      {audioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Seleccionar Audio
            </h3>
            <p className="text-gray-400 mb-4">Aquí se integraría el selector de archivos de audio del sistema.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setAudioModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAudioSelect(
                  'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                  'Audio de ejemplo'
                )}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Usar Audio de Ejemplo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
