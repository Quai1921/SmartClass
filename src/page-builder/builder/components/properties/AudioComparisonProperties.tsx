import React, { useState, useEffect } from 'react';
import { Upload, X, Play, AudioWaveform, Volume2, VolumeX, Speaker, Music, Disc, Radio, Headphones, Mic } from 'lucide-react';
import type { Element } from '../../../types';

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

interface AudioComparisonPropertiesProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openAudioChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND', elementType?: 'audio' | 'audio-true-false') => void;
}

export const AudioComparisonProperties: React.FC<AudioComparisonPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  openAudioChoiceModal,
}) => {
  const properties = element.properties;
  const [audioModalOpen, setAudioModalOpen] = useState<'true' | 'false' | null>(null);

  const handleAudioSelect = (type: 'true' | 'false', src: string) => {
    if (type === 'true') {
      onPropertyChange('trueAudioUrl', src);
    } else {
      onPropertyChange('falseAudioUrl', src);
    }
    
    // Force a re-render by updating the element if onElementUpdate is available
    if (onElementUpdate) {
      const updates = type === 'true' 
        ? { trueAudioUrl: src }
        : { falseAudioUrl: src };
        
      onElementUpdate(element.id, {
        properties: {
          ...element.properties,
          ...updates
        }
      });
    }
    
    setAudioModalOpen(null);
    
    // Clear the global callback after use
    (window as any).connectionAudioCallback = null;
    (window as any).connectionAudioElementId = null;
  };

  const handleOpenAudioModal = (type: 'true' | 'false') => {
    // Set up global callback for audio selection
    (window as any).connectionAudioCallback = (src: string) => {
      handleAudioSelect(type, src);
    };
    (window as any).connectionAudioElementId = element.id;
    
    if (openAudioChoiceModal) {
      // Use the proper audio choice modal with file manager integration
      openAudioChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      // Fallback to simple modal
      setAudioModalOpen(type);
    }
  };

  // Ensure audio callback persists for this component
  useEffect(() => {
    // Set up and maintain the callback reference
    if ((window as any).connectionAudioElementId === element.id) {
      // Callback is already set in handleOpenAudioModal
    }
    
    return () => {
      // Only clear if this is our callback
      if ((window as any).connectionAudioElementId === element.id) {
        // Don't clear the callback during cleanup - let it persist until the modal closes
      }
    };
  }, [element.id]);

  const removeAudio = (type: 'true' | 'false') => {
    if (type === 'true') {
      onPropertyChange('trueAudioUrl', '');
    } else {
      onPropertyChange('falseAudioUrl', '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Audio Comparación</h4>
        <p className="text-sm text-gray-400">
          Configura dos audios: Audio A y Audio B. Los usuarios escuchan ambos audios y hacen clic en el audio correspondiente para responder.
        </p>
      </div>

      {/* True Audio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Audio A (Verdadero)</label>
        
        {properties.trueAudioUrl ? (
          <div className="relative p-4 bg-gray-700 rounded border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play size={20} className="text-green-400" />
                <span className="text-sm text-gray-300">Audio A cargado</span>
                <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">Verdadero</span>
              </div>
              <button
                onClick={() => removeAudio('true')}
                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
            <audio controls className="w-full mt-3">
              <source src={properties.trueAudioUrl} />
              Tu navegador no soporta audio.
            </audio>
          </div>
        ) : (
          <div className="w-full h-24 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin Audio A seleccionado</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleOpenAudioModal('true')}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            {properties.trueAudioUrl ? 'Cambiar Audio A' : 'Seleccionar Audio A'}
          </button>
          {properties.trueAudioUrl && (
            <button
              onClick={() => removeAudio('true')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* False Audio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Audio B (Falso)</label>
        
        {properties.falseAudioUrl ? (
          <div className="relative p-4 bg-gray-700 rounded border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play size={20} className="text-red-400" />
                <span className="text-sm text-gray-300">Audio B cargado</span>
                <span className="text-xs text-red-400 bg-red-900 px-2 py-1 rounded">Falso</span>
              </div>
              <button
                onClick={() => removeAudio('false')}
                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </div>
            <audio controls className="w-full mt-3">
              <source src={properties.falseAudioUrl} />
              Tu navegador no soporta audio.
            </audio>
          </div>
        ) : (
          <div className="w-full h-24 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin Audio B seleccionado</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleOpenAudioModal('false')}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            {properties.falseAudioUrl ? 'Cambiar Audio B' : 'Seleccionar Audio B'}
          </button>
          {properties.falseAudioUrl && (
            <button
              onClick={() => removeAudio('false')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* Container Styling */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Estilo del Contenedor</h5>
        
        {/* Container Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo del Contenedor</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.containerBackgroundColor || '#f8fafc'}
              onChange={(e) => onPropertyChange('containerBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.containerBackgroundColor || '#f8fafc'}
              onChange={(e) => onPropertyChange('containerBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#f8fafc"
            />
          </div>
        </div>

        {/* Container Border Radius */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Radio del Borde del Contenedor</span>
            <span>{properties.containerBorderRadius || 8}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={properties.containerBorderRadius || 8}
            onChange={(e) => onPropertyChange('containerBorderRadius', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px (Cuadrado)</span>
            <span>20px (Redondeado)</span>
          </div>
        </div>
      </div>

      {/* Audio Card Styling */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Estilo de las Tarjetas de Audio</h5>
        
        {/* Card Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo de las Tarjetas</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardBackgroundColor || '#ffffff'}
              onChange={(e) => onPropertyChange('cardBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardBackgroundColor || '#ffffff'}
              onChange={(e) => onPropertyChange('cardBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Card Border Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde de las Tarjetas</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardBorderColor || '#e2e8f0'}
              onChange={(e) => onPropertyChange('cardBorderColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardBorderColor || '#e2e8f0'}
              onChange={(e) => onPropertyChange('cardBorderColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#e2e8f0"
            />
          </div>
        </div>

        {/* Card Border Width */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Ancho del Borde de las Tarjetas</span>
            <span>{properties.cardBorderWidth || 2}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={properties.cardBorderWidth || 2}
            onChange={(e) => onPropertyChange('cardBorderWidth', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px (Sin borde)</span>
            <span>10px (Borde grueso)</span>
          </div>
        </div>

        {/* Card Border Radius */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Radio del Borde de las Tarjetas</span>
            <span>{properties.cardBorderRadius || 12}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="30"
            step="2"
            value={properties.cardBorderRadius || 12}
            onChange={(e) => onPropertyChange('cardBorderRadius', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px (Cuadrado)</span>
            <span>30px (Muy redondeado)</span>
          </div>
        </div>

        {/* Card Padding */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Relleno Interior de las Tarjetas</span>
            <span>{properties.cardPadding || 16}px</span>
          </label>
          <input
            type="range"
            min="8"
            max="40"
            step="2"
            value={properties.cardPadding || 16}
            onChange={(e) => onPropertyChange('cardPadding', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8px (Compacto)</span>
            <span>40px (Espacioso)</span>
          </div>
        </div>

        {/* Card Min Height */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Altura Mínima de las Tarjetas</span>
            <span>{properties.cardMinHeight || 120}px</span>
          </label>
          <input
            type="range"
            min="80"
            max="200"
            step="10"
            value={properties.cardMinHeight || 120}
            onChange={(e) => onPropertyChange('cardMinHeight', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>80px (Bajo)</span>
            <span>200px (Alto)</span>
          </div>
        </div>

        {/* Card Max Width */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Ancho Máximo de las Tarjetas</span>
            <span>{properties.cardMaxWidth || 200}px</span>
          </label>
          <input
            type="range"
            min="120"
            max="400"
            step="20"
            value={properties.cardMaxWidth || 200}
            onChange={(e) => onPropertyChange('cardMaxWidth', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>120px (Estrecho)</span>
            <span>400px (Ancho)</span>
          </div>
        </div>

        {/* Card Gap */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Espacio Entre Tarjetas</span>
            <span>{properties.cardGap || 16}px</span>
          </label>
          <input
            type="range"
            min="8"
            max="40"
            step="2"
            value={properties.cardGap || 16}
            onChange={(e) => onPropertyChange('cardGap', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8px (Cerca)</span>
            <span>40px (Separado)</span>
          </div>
        </div>

        {/* Card Hover Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo al Pasar el Mouse</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardHoverBackgroundColor || '#ffffff'}
              onChange={(e) => onPropertyChange('cardHoverBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardHoverBackgroundColor || '#ffffff'}
              onChange={(e) => onPropertyChange('cardHoverBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Card Hover Border Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde al Pasar el Mouse</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardHoverBorderColor || '#3b82f6'}
              onChange={(e) => onPropertyChange('cardHoverBorderColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardHoverBorderColor || '#3b82f6'}
              onChange={(e) => onPropertyChange('cardHoverBorderColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        {/* Card Hover Transform */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Efecto de Transformación al Pasar el Mouse</label>
          <select
            value={properties.cardHoverTransform || 'scale(1.02)'}
            onChange={(e) => onPropertyChange('cardHoverTransform', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="none">Ninguno</option>
            <option value="scale(1.02)">Escalar ligeramente (1.02x)</option>
            <option value="scale(1.05)">Escalar más (1.05x)</option>
            <option value="scale(1.1)">Escalar mucho (1.1x)</option>
            <option value="translateY(-2px)">Elevar ligeramente</option>
            <option value="translateY(-4px)">Elevar más</option>
            <option value="rotate(1deg)">Rotar ligeramente</option>
            <option value="rotate(-1deg)">Rotar inverso</option>
          </select>
        </div>

        {/* Card Hover Shadow */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Sombra al Pasar el Mouse</label>
          <select
            value={properties.cardHoverShadow || '0 4px 12px rgba(59, 130, 246, 0.15)'}
            onChange={(e) => onPropertyChange('cardHoverShadow', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="none">Ninguna</option>
            <option value="0 2px 8px rgba(0, 0, 0, 0.1)">Sombra sutil</option>
            <option value="0 4px 12px rgba(59, 130, 246, 0.15)">Sombra azul</option>
            <option value="0 4px 12px rgba(34, 197, 94, 0.15)">Sombra verde</option>
            <option value="0 4px 12px rgba(239, 68, 68, 0.15)">Sombra roja</option>
            <option value="0 8px 25px rgba(0, 0, 0, 0.15)">Sombra pronunciada</option>
            <option value="0 0 20px rgba(59, 130, 246, 0.3)">Resplandor azul</option>
          </select>
        </div>
      </div>

      {/* Audio Card Answer State Colors */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Colores de Estado de Respuesta</h5>
        
        {/* Card Correct Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo - Respuesta Correcta</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardCorrectBackgroundColor || '#dcfce7'}
              onChange={(e) => onPropertyChange('cardCorrectBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardCorrectBackgroundColor || '#dcfce7'}
              onChange={(e) => onPropertyChange('cardCorrectBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#dcfce7"
            />
          </div>
        </div>

        {/* Card Correct Border Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde - Respuesta Correcta</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardCorrectBorderColor || '#22c55e'}
              onChange={(e) => onPropertyChange('cardCorrectBorderColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardCorrectBorderColor || '#22c55e'}
              onChange={(e) => onPropertyChange('cardCorrectBorderColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#22c55e"
            />
          </div>
        </div>

        {/* Card Incorrect Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo - Respuesta Incorrecta</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardIncorrectBackgroundColor || '#fee2e2'}
              onChange={(e) => onPropertyChange('cardIncorrectBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardIncorrectBackgroundColor || '#fee2e2'}
              onChange={(e) => onPropertyChange('cardIncorrectBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#fee2e2"
            />
          </div>
        </div>

        {/* Card Incorrect Border Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde - Respuesta Incorrecta</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.cardIncorrectBorderColor || '#ef4444'}
              onChange={(e) => onPropertyChange('cardIncorrectBorderColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.cardIncorrectBorderColor || '#ef4444'}
              onChange={(e) => onPropertyChange('cardIncorrectBorderColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#ef4444"
            />
          </div>
        </div>

        {/* Card Answered Transform */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Efecto de Transformación al Responder</label>
          <select
            value={properties.cardAnsweredTransform || 'scale(1.02)'}
            onChange={(e) => onPropertyChange('cardAnsweredTransform', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="none">Ninguno</option>
            <option value="scale(1.02)">Escalar ligeramente (1.02x)</option>
            <option value="scale(1.05)">Escalar más (1.05x)</option>
            <option value="scale(1.1)">Escalar mucho (1.1x)</option>
            <option value="translateY(-2px)">Elevar ligeramente</option>
            <option value="translateY(-4px)">Elevar más</option>
            <option value="rotate(1deg)">Rotar ligeramente</option>
            <option value="rotate(-1deg)">Rotar inverso</option>
          </select>
        </div>
      </div>

      {/* Audio Widget Styling */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Personalización de Audio Widgets</h5>
        
        {/* Icon Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Icono</label>
          <div className="relative">
            <select
              value={properties.audioIconType || 'audio-waveform'}
              onChange={(e) => onPropertyChange('audioIconType', e.target.value)}
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
                const selectedIcon = iconOptions.find(option => option.value === (properties.audioIconType || 'audio-waveform'));
                const SelectedIconComponent = selectedIcon?.icon || AudioWaveform;
                return <SelectedIconComponent size={16} className="text-gray-400" />;
              })()}
            </div>
          </div>
        </div>

        {/* Icon Size */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Tamaño del Icono</span>
            <span>{properties.audioIconSize || 20}px</span>
          </label>
          <input
            type="range"
            min="12"
            max="80"
            step="2"
            value={properties.audioIconSize || 20}
            onChange={(e) => onPropertyChange('audioIconSize', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12px</span>
            <span>80px</span>
          </div>
        </div>

        {/* Button Size */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Tamaño del Botón</span>
            <span>{properties.audioButtonSize || 48}px</span>
          </label>
          <input
            type="range"
            min="32"
            max="120"
            step="4"
            value={properties.audioButtonSize || 48}
            onChange={(e) => onPropertyChange('audioButtonSize', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>32px</span>
            <span>120px</span>
          </div>
        </div>

        {/* Icon Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Icono</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.audioIconColor || '#ffffff'}
              onChange={(e) => onPropertyChange('audioIconColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.audioIconColor || '#ffffff'}
              onChange={(e) => onPropertyChange('audioIconColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo del Audio</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.audioBackgroundColor || '#4b5563'}
              onChange={(e) => onPropertyChange('audioBackgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.audioBackgroundColor || '#4b5563'}
              onChange={(e) => onPropertyChange('audioBackgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#4b5563"
            />
          </div>
        </div>

        {/* Playing Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Reproducción</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={properties.audioPlayingColor || '#7c3aed'}
              onChange={(e) => onPropertyChange('audioPlayingColor', e.target.value)}
              className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
            />
            <input
              type="text"
              value={properties.audioPlayingColor || '#7c3aed'}
              onChange={(e) => onPropertyChange('audioPlayingColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#7c3aed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Color que se muestra cuando el audio está reproduciéndose
          </p>
        </div>

        {/* Border Radius */}
        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
            <span>Radio del Borde del Audio</span>
            <span>{properties.audioBorderRadius || 50}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={properties.audioBorderRadius || 50}
            onChange={(e) => onPropertyChange('audioBorderRadius', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0% (Cuadrado)</span>
            <span>50% (Circular)</span>
          </div>
        </div>
      </div>

      {/* Text Styling */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Estilo de Texto</h5>
        
        {/* Card Title Styling */}
        <div className="mb-6">
          <h6 className="text-sm font-medium text-gray-300 mb-3">Títulos de Tarjetas (Audio A, Audio B)</h6>
          
          {/* Title Font Family */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Familia de Fuente</label>
            <select
              value={properties.cardTitleFontFamily || 'inherit'}
              onChange={(e) => onPropertyChange('cardTitleFontFamily', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="inherit">Predeterminada</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="grilledcheese">Grilled Cheese</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Lucida Sans Unicode, sans-serif">Lucida Sans Unicode</option>
            </select>
          </div>

          {/* Title Font Size */}
          <div className="mb-4">
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Tamaño de Fuente</span>
              <span>{properties.cardTitleFontSize || 18}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={properties.cardTitleFontSize || 18}
              onChange={(e) => onPropertyChange('cardTitleFontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>48px</span>
            </div>
          </div>

          {/* Title Font Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Peso de Fuente</label>
            <select
              value={properties.cardTitleFontWeight || '600'}
              onChange={(e) => onPropertyChange('cardTitleFontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Muy Delgado (100)</option>
              <option value="200">Delgado (200)</option>
              <option value="300">Ligero (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medio (500)</option>
              <option value="600">Semi Negrita (600)</option>
              <option value="700">Negrita (700)</option>
              <option value="800">Extra Negrita (800)</option>
              <option value="900">Muy Negrita (900)</option>
            </select>
          </div>

          {/* Title Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color del Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.cardTitleColor || '#1f2937'}
                onChange={(e) => onPropertyChange('cardTitleColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={properties.cardTitleColor || '#1f2937'}
                onChange={(e) => onPropertyChange('cardTitleColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#1f2937"
              />
            </div>
          </div>

          {/* Title Text Align */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Alineación del Texto</label>
            <select
              value={properties.cardTitleTextAlign || 'center'}
              onChange={(e) => onPropertyChange('cardTitleTextAlign', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
              <option value="justify">Justificado</option>
            </select>
          </div>
        </div>

        {/* Card Subtitle Styling */}
        <div className="mb-6">
          <h6 className="text-sm font-medium text-gray-300 mb-3">Subtítulos de Tarjetas (Escuchar Audio)</h6>
          
          {/* Subtitle Font Family */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Familia de Fuente</label>
            <select
              value={properties.cardSubtitleFontFamily || 'inherit'}
              onChange={(e) => onPropertyChange('cardSubtitleFontFamily', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="inherit">Predeterminada</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="grilledcheese">Grilled Cheese</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Lucida Sans Unicode, sans-serif">Lucida Sans Unicode</option>
            </select>
          </div>

          {/* Subtitle Font Size */}
          <div className="mb-4">
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Tamaño de Fuente</span>
              <span>{properties.cardSubtitleFontSize || 14}px</span>
            </label>
            <input
              type="range"
              min="10"
              max="32"
              step="1"
              value={properties.cardSubtitleFontSize || 14}
              onChange={(e) => onPropertyChange('cardSubtitleFontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Subtitle Font Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Peso de Fuente</label>
            <select
              value={properties.cardSubtitleFontWeight || '400'}
              onChange={(e) => onPropertyChange('cardSubtitleFontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Muy Delgado (100)</option>
              <option value="200">Delgado (200)</option>
              <option value="300">Ligero (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medio (500)</option>
              <option value="600">Semi Negrita (600)</option>
              <option value="700">Negrita (700)</option>
              <option value="800">Extra Negrita (800)</option>
              <option value="900">Muy Negrita (900)</option>
            </select>
          </div>

          {/* Subtitle Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color del Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.cardSubtitleColor || '#6b7280'}
                onChange={(e) => onPropertyChange('cardSubtitleColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={properties.cardSubtitleColor || '#6b7280'}
                onChange={(e) => onPropertyChange('cardSubtitleColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#6b7280"
              />
            </div>
          </div>

          {/* Subtitle Text Align */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Alineación del Texto</label>
            <select
              value={properties.cardSubtitleTextAlign || 'center'}
              onChange={(e) => onPropertyChange('cardSubtitleTextAlign', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
              <option value="justify">Justificado</option>
            </select>
          </div>
        </div>

        {/* Result Text Styling */}
        <div className="mb-6">
          <h6 className="text-sm font-medium text-gray-300 mb-3">Texto de Resultado (¡Correcto!, Incorrecto)</h6>
          
          {/* Result Font Family */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Familia de Fuente</label>
            <select
              value={properties.resultTextFontFamily || 'inherit'}
              onChange={(e) => onPropertyChange('resultTextFontFamily', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="inherit">Predeterminada</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="grilledcheese">Grilled Cheese</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Lucida Sans Unicode, sans-serif">Lucida Sans Unicode</option>
            </select>
          </div>

          {/* Result Font Size */}
          <div className="mb-4">
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Tamaño de Fuente</span>
              <span>{properties.resultTextFontSize || 14}px</span>
            </label>
            <input
              type="range"
              min="10"
              max="32"
              step="1"
              value={properties.resultTextFontSize || 14}
              onChange={(e) => onPropertyChange('resultTextFontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Result Font Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Peso de Fuente</label>
            <select
              value={properties.resultTextFontWeight || '500'}
              onChange={(e) => onPropertyChange('resultTextFontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Muy Delgado (100)</option>
              <option value="200">Delgado (200)</option>
              <option value="300">Ligero (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medio (500)</option>
              <option value="600">Semi Negrita (600)</option>
              <option value="700">Negrita (700)</option>
              <option value="800">Extra Negrita (800)</option>
              <option value="900">Muy Negrita (900)</option>
            </select>
          </div>

          {/* Result Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color del Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.resultTextColor || '#059669'}
                onChange={(e) => onPropertyChange('resultTextColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={properties.resultTextColor || '#059669'}
                onChange={(e) => onPropertyChange('resultTextColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#059669"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Este color se usará para respuestas correctas. Las incorrectas mantendrán el color rojo por defecto.
            </p>
          </div>

          {/* Result Text Align */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Alineación del Texto</label>
            <select
              value={properties.resultTextTextAlign || 'center'}
              onChange={(e) => onPropertyChange('resultTextTextAlign', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
              <option value="justify">Justificado</option>
            </select>
          </div>
        </div>

        {/* Feedback Text Styling */}
        <div className="mb-6">
          <h6 className="text-sm font-medium text-gray-300 mb-3">Texto de Retroalimentación</h6>
          
          {/* Feedback Font Family */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Familia de Fuente</label>
            <select
              value={properties.feedbackTextFontFamily || 'inherit'}
              onChange={(e) => onPropertyChange('feedbackTextFontFamily', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="inherit">Predeterminada</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="grilledcheese">Grilled Cheese</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="Tahoma, sans-serif">Tahoma</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Lucida Sans Unicode, sans-serif">Lucida Sans Unicode</option>
            </select>
          </div>

          {/* Feedback Font Size */}
          <div className="mb-4">
            <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
              <span>Tamaño de Fuente</span>
              <span>{properties.feedbackTextFontSize || 12}px</span>
            </label>
            <input
              type="range"
              min="8"
              max="24"
              step="1"
              value={properties.feedbackTextFontSize || 12}
              onChange={(e) => onPropertyChange('feedbackTextFontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Feedback Font Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Peso de Fuente</label>
            <select
              value={properties.feedbackTextFontWeight || '400'}
              onChange={(e) => onPropertyChange('feedbackTextFontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Muy Delgado (100)</option>
              <option value="200">Delgado (200)</option>
              <option value="300">Ligero (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medio (500)</option>
              <option value="600">Semi Negrita (600)</option>
              <option value="700">Negrita (700)</option>
              <option value="800">Extra Negrita (800)</option>
              <option value="900">Muy Negrita (900)</option>
            </select>
          </div>

          {/* Feedback Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Color del Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={properties.feedbackTextColor || '#6b7280'}
                onChange={(e) => onPropertyChange('feedbackTextColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
              />
              <input
                type="text"
                value={properties.feedbackTextColor || '#6b7280'}
                onChange={(e) => onPropertyChange('feedbackTextColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#6b7280"
              />
            </div>
          </div>

          {/* Feedback Text Align */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Alineación del Texto</label>
            <select
              value={properties.feedbackTextTextAlign || 'center'}
              onChange={(e) => onPropertyChange('feedbackTextTextAlign', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
              <option value="justify">Justificado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Settings */}
      <div>
        <h5 className="text-md font-medium text-gray-300 mb-3">Configuración Interactiva</h5>
        
        {/* Allow Retry */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={properties.allowRetry || false}
              onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Permitir reintentar</span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Permite al usuario cambiar su respuesta después de responder
          </p>
        </div>

        {/* Show Result */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={properties.showResult !== false}
              onChange={(e) => onPropertyChange('showResult', e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Mostrar resultado</span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Muestra si la respuesta es correcta o incorrecta
          </p>
        </div>

        {/* Correct Answer */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Respuesta Correcta</label>
          <select
            value={properties.correctAnswer === false ? 'false' : 'true'}
            onChange={(e) => onPropertyChange('correctAnswer', e.target.value === 'true')}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="true">Audio A (Verdadero)</option>
            <option value="false">Audio B (Falso)</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Define cuál audio representa la respuesta correcta
          </p>
        </div>

        {/* Feedback Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
          <textarea
            value={properties.feedbackMessage || ''}
            onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
            placeholder="Mensaje que se mostrará después de responder..."
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Los usuarios escucharán ambos audios y harán clic en el audio correspondiente para responder. El resultado se mostrará después de la selección.
        </p>
      </div>
    </div>
  );
};
