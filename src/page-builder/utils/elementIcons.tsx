import React from 'react';
import { 
  Package, 
  Type, 
  AlignLeft, 
  BookOpen, 
  Image as ImageIcon, 
  Video, 
  MousePointerClick, 
  MessageSquare,
  Copy,
  Headphones,
  Mic,
  Volume2,
  Calculator
} from 'lucide-react';
import type { ElementType } from '../types';

interface ElementInfo {
  icon: React.ReactNode;
  label: string;
}

export function getElementInfo(type: ElementType): ElementInfo {
  switch (type) {
    case 'container':
      return {
        icon: <Package size={20} strokeWidth={2.5} />,
        label: 'Contenedor'
      };
    case 'heading':
      return {
        icon: <Type size={20} strokeWidth={2.5} />,
        label: 'Título'
      };
    case 'paragraph':
      return {
        icon: <AlignLeft size={20} strokeWidth={2.5} />,
        label: 'Párrafo'
      };
    case 'quote':
      return {
        icon: <BookOpen size={20} strokeWidth={2.5} />,
        label: 'Cita'
      };
    case 'image':
      return {
        icon: <ImageIcon size={20} strokeWidth={2.5} />,
        label: 'Imagen'
      };
    case 'video':
      return {
        icon: <Video size={20} strokeWidth={2.5} />,
        label: 'Video'
      };
    case 'button':
      return {
        icon: <MousePointerClick size={20} strokeWidth={2.5} />,
        label: 'Botón'
      };
    case 'text-statement':
      return {
        icon: <MessageSquare size={20} strokeWidth={2.5} />,
        label: 'Declaración'
      };
    case 'image-choice':
      return {
        icon: <ImageIcon size={20} strokeWidth={2.5} />,
        label: 'Imagen V/F'
      };
    case 'image-comparison':
      return {
        icon: <Copy size={20} strokeWidth={2.5} />,
        label: 'Comparar Imagen'
      };
    case 'audio-comparison':
      return {
        icon: <Headphones size={20} strokeWidth={2.5} />,
        label: 'Comparar Audio'
      };
    case 'audio-true-false':
      return {
        icon: <Volume2 size={20} strokeWidth={2.5} />,
        label: 'Audio V/F'
      };
    case 'area-true-false':
      return {
        icon: <MousePointerClick size={20} strokeWidth={2.5} />,
        label: 'Área V/F'
      };
    case 'speech-recognition':
      return {
        icon: <Mic size={20} strokeWidth={2.5} />,
        label: 'Reconocimiento de Voz'
      };
    case 'math-calculator':
      return {
        icon: <Calculator size={20} strokeWidth={2.5} />,
        label: 'Math Calculator'
      };
    default:
      return {
        icon: <Package size={20} strokeWidth={2.5} />,
        label: 'Elemento'
      };
  }
}

interface DragOverlayCardProps {
  type: ElementType;
  className?: string;
}

export const DragOverlayCard: React.FC<DragOverlayCardProps> = ({ type, className = '' }) => {
  const { icon, label } = getElementInfo(type);
  
  return (
    <div className={`border rounded-lg p-3 bg-gray-700 border-gray-600 shadow-lg ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center text-xl text-gray-300">
          {icon}
        </div>
        <p className="text-xs text-center font-medium text-gray-200">
          {label}
        </p>
      </div>
    </div>
  );
};
