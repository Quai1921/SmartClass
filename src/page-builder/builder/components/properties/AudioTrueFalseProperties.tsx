import React, { useState } from 'react';
import { Upload, X, Play, Volume2, AudioWaveform, Music, Disc, Radio, Headphones, Mic, Speaker, VolumeX } from 'lucide-react';
import type { Element } from '../../../types';
import { BorderSelector } from './BorderSelector';
import { TrueFalseButtonTabs } from './common/TrueFalseButtonTabs';

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

interface AudioTrueFalsePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

type ButtonPosition = 'north' | 'south' | 'east' | 'west';

export const AudioTrueFalseProperties: React.FC<AudioTrueFalsePropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties: any = element.properties;
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

  const buttonPositions: { value: ButtonPosition; label: string }[] = [
    { value: 'north', label: 'Arriba' },
    { value: 'south', label: 'Abajo' },
    { value: 'east', label: 'Derecha' },
    { value: 'west', label: 'Izquierda' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Audio Verdadero/Falso</h4>
        <p className="text-sm text-gray-400">
          Un widget de audio con botones Verdadero/Falso totalmente personalizables y posicionables.
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
            onClick={() => setAudioModalOpen(true)}
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
                {(() => {
                  const selectedIcon = iconOptions.find(option => option.value === (properties.iconType || 'audio-waveform'));
                  const SelectedIconComponent = selectedIcon?.icon || AudioWaveform;
                  return <SelectedIconComponent size={16} className="text-gray-400" />;
                })()}
              </div>
            </div>
          </div>

          {/* Icon Colors */}
          <div className="grid grid-cols-1 gap-4">
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

          {/* Button Size */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Tamaño del Botón de Audio</span>
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
        </div>
      </div>

      {/* Button Position */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Posición de Botones</label>
        <select
          value={properties.buttonPosition || 'south'}
          onChange={(e) => onPropertyChange('buttonPosition', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {buttonPositions.map(pos => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))}
        </select>
      </div>

      {/* Button Spacing Control */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Espaciado entre Botones</label>
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Distancia entre botones Verdadero/Falso</span>
              <span>{properties.gap || 8}px</span>
            </label>
            <input
              type="range"
              min="4"
              max="69"
              step="2"
              value={properties.gap || 8}
              onChange={(e) => onPropertyChange('gap', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4px</span>
              <span>69px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Play Button Customization */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Personalización del Botón de Audio</label>
        <div className="space-y-4 p-4 bg-gray-700 rounded border border-gray-600">
          {/* Play Button Colors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.playButton?.backgroundColor || '#4b5563'}
                    onChange={(e) => onPropertyChange('playButton', {
                      ...properties.playButton,
                      backgroundColor: e.target.value
                    })}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.playButton?.backgroundColor || '#4b5563'}
                  onChange={(e) => onPropertyChange('playButton', {
                    ...properties.playButton,
                    backgroundColor: e.target.value
                  })}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#4b5563"
                />
                <button
                  onClick={() => onPropertyChange('playButton', {
                    ...properties.playButton,
                    backgroundColor: 'transparent'
                  })}
                  className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
                  title="Hacer transparente"
                >
                  Transparente
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color de Reproducción</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.playButton?.playingColor || '#7c3aed'}
                    onChange={(e) => onPropertyChange('playButton', {
                      ...properties.playButton,
                      playingColor: e.target.value
                    })}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.playButton?.playingColor || '#7c3aed'}
                  onChange={(e) => onPropertyChange('playButton', {
                    ...properties.playButton,
                    playingColor: e.target.value
                  })}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#7c3aed"
                />
                <button
                  onClick={() => onPropertyChange('playButton', {
                    ...properties.playButton,
                    playingColor: 'transparent'
                  })}
                  className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
                  title="Hacer transparente"
                >
                  Transparente
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Color del Ícono</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={properties.playButton?.iconColor || '#ffffff'}
                    onChange={(e) => onPropertyChange('playButton', {
                      ...properties.playButton,
                      iconColor: e.target.value
                    })}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={properties.playButton?.iconColor || '#ffffff'}
                  onChange={(e) => onPropertyChange('playButton', {
                    ...properties.playButton,
                    iconColor: e.target.value
                  })}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Play Button Size */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Tamaño del Botón</span>
              <span>{properties.playButton?.size || 48}px</span>
            </label>
            <input
              type="range"
              min="32"
              max="80"
              step="4"
              value={properties.playButton?.size || 48}
              onChange={(e) => onPropertyChange('playButton', {
                ...properties.playButton,
                size: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>32px</span>
              <span>80px</span>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Radio del Borde</span>
              <span>{properties.playButton?.borderRadius || 50}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={properties.playButton?.borderRadius || 50}
              onChange={(e) => onPropertyChange('playButton', {
                ...properties.playButton,
                borderRadius: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0% (Cuadrado)</span>
              <span>50% (Circular)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Customization */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Personalización de Botones</label>
        <TrueFalseButtonTabs
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Respuesta Correcta</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === true}
              onChange={() => onPropertyChange('correctAnswer', true)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Verdadero</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === false}
              onChange={() => onPropertyChange('correctAnswer', false)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Falso</span>
          </label>
        </div>
      </div>

      {/* Feedback Message */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
        <textarea
          value={properties.feedbackMessage || ''}
          onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Mensaje opcional mostrado después de responder..."
          rows={2}
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Configuración</h5>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowRetry"
            checked={properties.allowRetry !== false}
            onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="allowRetry" className="text-sm font-medium text-gray-300">
            Permitir reintentos
          </label>
        </div>
      </div>

      {/* Result Text Customization */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Mensajes de Resultado</label>
        <div className="space-y-4 p-4 bg-gray-700 rounded border border-gray-600">
          {/* Show Result Text Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showResultText"
              checked={properties.showResultText !== false}
              onChange={(e) => onPropertyChange('showResultText', e.target.checked)}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="showResultText" className="text-sm font-medium text-gray-300">
              Mostrar mensaje de resultado
            </label>
          </div>

          {/* Custom Text Inputs - Only show if showResultText is enabled */}
          {properties.showResultText !== false && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Mensaje de Respuesta Correcta</label>
                <input
                  type="text"
                  value={properties.correctText || '¡Correcto!'}
                  onChange={(e) => onPropertyChange('correctText', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="¡Correcto!"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Mensaje de Respuesta Incorrecta</label>
                <input
                  type="text"
                  value={properties.incorrectText || 'Incorrecto'}
                  onChange={(e) => onPropertyChange('incorrectText', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Incorrecto"
                />
              </div>

              {/* Result Text Styling */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color Texto Correcto</label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={properties.correctTextColor || '#059669'}
                        onChange={(e) => onPropertyChange('correctTextColor', e.target.value)}
                        className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                        style={{ minWidth: '40px' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={properties.correctTextColor || '#059669'}
                      onChange={(e) => onPropertyChange('correctTextColor', e.target.value)}
                      className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="#059669"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Color Texto Incorrecto</label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={properties.incorrectTextColor || '#dc2626'}
                        onChange={(e) => onPropertyChange('incorrectTextColor', e.target.value)}
                        className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                        style={{ minWidth: '40px' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={properties.incorrectTextColor || '#dc2626'}
                      onChange={(e) => onPropertyChange('incorrectTextColor', e.target.value)}
                      className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="#dc2626"
                    />
                  </div>
                </div>
              </div>

              {/* Result Text Typography */}
              <div className="space-y-4">
                <h6 className="text-xs font-medium text-gray-400 border-b border-gray-600 pb-1">Tipografía del Resultado</h6>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Familia de Fuente</label>
                  <select
                    value={properties.resultFontFamily || 'inherit'}
                    onChange={(e) => onPropertyChange('resultFontFamily', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="inherit">Heredar</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                    <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                    <option value="Impact, sans-serif">Impact</option>
                    <option value="'Lucida Console', monospace">Lucida Console</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de Fuente</label>
                    <input
                      type="text"
                      value={properties.resultFontSize || '0.9rem'}
                      onChange={(e) => onPropertyChange('resultFontSize', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="0.9rem"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Peso de Fuente</label>
                    <select
                      value={properties.resultFontWeight || '500'}
                      onChange={(e) => onPropertyChange('resultFontWeight', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="300">Ligera</option>
                      <option value="400">Normal</option>
                      <option value="500">Media</option>
                      <option value="600">Semi-negrita</option>
                      <option value="700">Negrita</option>
                      <option value="800">Extra-negrita</option>
                      <option value="900">Ultra-negrita</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Estilo de Fuente</label>
                    <select
                      value={properties.resultFontStyle || 'normal'}
                      onChange={(e) => onPropertyChange('resultFontStyle', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="italic">Cursiva</option>
                      <option value="oblique">Oblicua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Decoración</label>
                    <select
                      value={properties.resultTextDecoration || 'none'}
                      onChange={(e) => onPropertyChange('resultTextDecoration', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="none">Ninguna</option>
                      <option value="underline">Subrayado</option>
                      <option value="overline">Línea superior</option>
                      <option value="line-through">Tachado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Transformación</label>
                    <select
                      value={properties.resultTextTransform || 'none'}
                      onChange={(e) => onPropertyChange('resultTextTransform', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="none">Normal</option>
                      <option value="uppercase">MAYÚSCULAS</option>
                      <option value="lowercase">minúsculas</option>
                      <option value="capitalize">Primera Letra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Alineación</label>
                    <select
                      value={properties.resultTextAlign || 'center'}
                      onChange={(e) => onPropertyChange('resultTextAlign', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="right">Derecha</option>
                      <option value="justify">Justificado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Altura de Línea</label>
                    <input
                      type="text"
                      value={properties.resultLineHeight || '1.5'}
                      onChange={(e) => onPropertyChange('resultLineHeight', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Espaciado de Letras</label>
                    <input
                      type="text"
                      value={properties.resultLetterSpacing || 'normal'}
                      onChange={(e) => onPropertyChange('resultLetterSpacing', e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="normal"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo del Widget</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={properties.backgroundColor || '#f8fafc'}
              onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              style={{ minWidth: '40px' }}
            />
          </div>
          <input
            type="text"
            value={properties.backgroundColor || '#f8fafc'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
            className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="#f8fafc"
          />
          <button
            onClick={() => onPropertyChange('backgroundColor', 'transparent')}
            className="px-3 py-2 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
            title="Hacer transparente"
          >
            Transparente
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Los usuarios escucharán el audio y seleccionarán Verdadero o Falso. Los botones son completamente personalizables y se pueden posicionar en cualquier dirección relativa al icono de audio.
        </p>
      </div>

      {/* Audio Modal */}
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
