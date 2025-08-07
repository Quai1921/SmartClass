import React from 'react';
import { 
  Package, 
  Type, 
  AlignLeft, 
  BookOpen, 
  Image as ImageIcon, 
  Video,
  AudioWaveform, 
  MousePointerClick, 
  MessageSquare,
  ImageIcon as ImageChoice,
  Copy,
  Headphones,
  Volume2,
  Mic,
  CheckCircle,
  Link2,
  Beaker,
  Calculator
} from 'lucide-react';
import { DraggableElement } from './DraggableElement';
import { HeadingElement } from '../../components';

interface ElementsTabProps {
  hasContainers: boolean;
}

export const ElementsTab: React.FC<ElementsTabProps> = ({ hasContainers }) => {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 pt-4 px-4">
        <h2 className="text-lg font-semibold text-white mb-1">Elementos</h2>
        <p className="text-sm text-gray-400">Arrastra elementos al lienzo para crear tu curso</p>
      </div>
      {/* Scrollable elements list */}
      <div className="flex-1 min-h-0 pb-36 px-4">
        {/* Container Interactive - Highlighted Section */}
        <div className="mb-6">
          <div className="bg-blue-900 border-2 border-blue-600 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <div className="text-orange-400 mr-2">✨</div>
              <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wide">CONTENEDOR INTERACTIVO</h3>
            </div>
            <p className="text-xs text-blue-400 mb-3">Elemento principal para organizar el layout</p>
            <DraggableElement
              type="container"
              label="Contenedor"
              icon={<Package size={20} strokeWidth={2.5} />}
            />
          </div>
        </div>

        {/* Warning when no containers exist */}
        {!hasContainers && (
          <div className="mb-4 p-3 bg-amber-900 border border-amber-600 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="text-amber-400 mr-2">⚠️</div>
              <h4 className="text-xs font-bold text-amber-300 uppercase">Contenedor Requerido</h4>
            </div>
            <p className="text-xs text-amber-400">
              Agrega un contenedor primero para poder usar otros widgets
            </p>
          </div>
        )}

        {/* Basic Content Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Contenido Básico</h3>
          {/* Heading Element - Full width */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="text-blue-400 mr-2">✨</div>
              <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">Encabezados</p>
            </div>
            <HeadingElement
              hasContainers={hasContainers}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
          </div>
          {/* Other Elements - 2-column grid */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Elementos de Texto</p>
            <div className="grid grid-cols-2 gap-3">
              <DraggableElement
                type="paragraph"
                label="Párrafo"
                icon={<AlignLeft size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="quote"
                label="Cita"
                icon={<BookOpen size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="image"
                label="Imagen"
                icon={<ImageIcon size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="video"
                label="Video"
                icon={<Video size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="audio"
                label="Audio"
                icon={<AudioWaveform size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="button"
                label="Botón"
                icon={<MousePointerClick size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
              <DraggableElement
                type="simple-container"
                label="Contenedor"
                icon={<Package size={20} strokeWidth={2.5} />}
                disabled={!hasContainers}
                disabledMessage="Requiere al menos un contenedor"
              />
            </div>
          </div>
        </div>

        {/* Interactive Elements Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Interactivos</h3>
          <div className="grid grid-cols-2 gap-3">
            <DraggableElement
              type="text-statement"
              label="Declaración"
              icon={<MessageSquare size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="image-choice"
              label="Imagen V/F"
              icon={<ImageChoice size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="image-comparison"
              label="Comparar Img"
              icon={<Copy size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="audio-comparison"
              label="Audio V/F"
              icon={<Headphones size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="audio-true-false"
              label="Audio + Botones"
              icon={<Volume2 size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="area-true-false"
              label="Área V/F"
              icon={<MousePointerClick size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="speech-recognition"
              label="Reconocimiento de Voz"
              icon={<Mic size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="fill-in-blanks"
              label="Completar Huecos"
              icon={<Type size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="single-choice"
              label="Selección Única"
              icon={<CheckCircle size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="connection-widget"
              label="Nodos de Conexión"
              icon={<Link2 size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="drag-drop-widget"
              label="Arrastra y Suelta"
              icon={<MousePointerClick size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
            <DraggableElement
              type="math-calculator"
              label="Calculadora"
              icon={<Calculator size={20} strokeWidth={2.5} />}
              disabled={!hasContainers}
              disabledMessage="Requiere al menos un contenedor"
            />
          </div>
        </div>
        {/* Add explicit spacer for bottom padding */}
        <div className="h-10" />
      </div>
    </div>
  );
};
