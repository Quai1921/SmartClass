import React, { useState, useEffect } from 'react';
import { Eye, Palette, Type, Settings } from 'lucide-react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

export interface TextElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
  initialTab?: 'basic' | 'styling' | 'templates';
}

// Helper function to get default classes for heading levels
function getHeadingClassName(level: number): string {
  switch (level) {
    case 1: return 'text-3xl font-bold mb-4';
    case 2: return 'text-2xl font-semibold mb-3';
    case 3: return 'text-xl font-medium mb-3';
    case 4: return 'text-lg font-medium mb-2';
    case 5: return 'text-base font-medium mb-2';
    case 6: return 'text-sm font-medium mb-2';
    default: return 'text-2xl font-bold mb-4';
  }
}

// Helper function to get appropriate font size for heading level
function getHeadingFontSize(level: number): number {
  switch (level) {
    case 1: return 48; // text-3xl equivalent (3rem = 48px)
    case 2: return 40; // text-2xl equivalent (2.5rem = 40px)
    case 3: return 32; // text-xl equivalent (2rem = 32px)
    case 4: return 24; // text-lg equivalent (1.5rem = 24px)
    case 5: return 20; // text-base equivalent (1.25rem = 20px)
    case 6: return 16; // text-sm equivalent (1rem = 16px)
    default: return 40;
  }
}

// Helper function to scale template font size based on heading level
function scaleTemplateForHeading(templateFontSize: number, headingLevel: number): number {
  // Base template font size (assuming it's designed for H2)
  const baseFontSize = 40; // H2 equivalent
  
  // Get the target font size for the current heading level
  const targetFontSize = getHeadingFontSize(headingLevel);
  
  // Calculate the scale factor
  const scaleFactor = targetFontSize / baseFontSize;
  
  // Apply the scale factor to the template font size
  return Math.round(templateFontSize * scaleFactor);
}

// Text templates for different element types
const TEXT_TEMPLATES = {
  heading: [
    {
      id: 'modern-heading',
      name: 'Título Moderno',
      preview: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: '1.2',
        letterSpacing: '-0.025em',
        marginBottom: '1rem'
      },
      properties: {
        fontSize: 40,
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: 1.2,
        letterSpacing: -1,
        textTransform: 'none'
      }
    },
    {
      id: 'gradient-heading',
      name: 'Título Gradiente',
      preview: {
        fontSize: '3rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: '1.1',
        letterSpacing: '-0.02em'
      },
      properties: {
        fontSize: 48,
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        lineHeight: 1.1,
        letterSpacing: -1
      }
    },
    {
      id: 'elegant-heading',
      name: 'Título Elegante',
      preview: {
        fontSize: '2.25rem',
        fontWeight: '300',
        color: '#374151',
        lineHeight: '1.3',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0.5rem'
      },
      properties: {
        fontSize: 36,
        fontWeight: '300',
        color: '#374151',
        lineHeight: 1.3,
        letterSpacing: 2,
        textTransform: 'uppercase',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '8px'
      }
    },
    {
      id: 'neon-heading',
      name: 'Título Neón',
      preview: {
        fontSize: '2.5rem',
        fontWeight: '600',
        color: '#00ffff',
        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '8px'
      },
      properties: {
        fontSize: 40,
        fontWeight: '600',
        color: '#00ffff',
        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        backgroundColor: '#1a1a2e',
        padding: '20px',
        borderRadius: 8
      }
    },
    {
      id: 'retro-heading',
      name: 'Título Retro',
      preview: {
        fontSize: '2.75rem',
        fontWeight: '900',
        color: '#ff6b6b',
        textShadow: '4px 4px 0px #4ecdc4, 8px 8px 0px #45b7d1',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      properties: {
        fontSize: 44,
        fontWeight: '900',
        color: '#ff6b6b',
        textShadow: '4px 4px 0px #4ecdc4, 8px 8px 0px #45b7d1',
        textTransform: 'uppercase',
        letterSpacing: 4
      }
    },
    {
      id: 'gold-heading',
      name: 'Título Dorado',
      preview: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: '0.02em'
      },
      properties: {
        fontSize: 40,
        fontWeight: '700',
        background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: 1
      }
    },
    {
      id: 'outlined-heading',
      name: 'Título Contorneado',
      preview: {
        fontSize: '3rem',
        fontWeight: '900',
        color: 'transparent',
        textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
        WebkitTextStroke: '2px #333'
      },
      properties: {
        fontSize: 48,
        fontWeight: '900',
        color: 'transparent',
        textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
        WebkitTextStroke: '2px #333'
      }
    },
    {
      id: 'minimal-heading',
      name: 'Título Minimalista',
      preview: {
        fontSize: '2rem',
        fontWeight: '200',
        color: '#6b7280',
        letterSpacing: '0.15em',
        textTransform: 'lowercase',
        borderLeft: '3px solid #3b82f6',
        paddingLeft: '1rem'
      },
      properties: {
        fontSize: 32,
        fontWeight: '200',
        color: '#6b7280',
        letterSpacing: 6,
        textTransform: 'lowercase',
        borderLeft: '3px solid #3b82f6',
        paddingLeft: '16px'
      }
    },
    {
      id: 'rainbow-heading',
      name: 'Título Arcoíris',
      preview: {
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '200% 100%',
        animation: 'rainbow 3s ease-in-out infinite'
      },
      properties: {
        fontSize: 40,
        fontWeight: '800',
        background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        backgroundSize: '200% 100%'
      }
    },
    {
      id: 'embossed-heading',
      name: 'Título Relieve',
      preview: {
        fontSize: '2.25rem',
        fontWeight: '700',
        color: '#e5e7eb',
        textShadow: '1px 1px 0px #fff, -1px -1px 1px #999',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        borderRadius: '8px'
      },
      properties: {
        fontSize: 36,
        fontWeight: '700',
        color: '#e5e7eb',
        textShadow: '1px 1px 0px #fff, -1px -1px 1px #999',
        backgroundColor: '#f3f4f6',
        padding: '20px',
        borderRadius: 8
      }
    }
  ],
  paragraph: [
    {
      id: 'clean-paragraph',
      name: 'Párrafo Limpio',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.75',
        letterSpacing: 'normal'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.75,
        letterSpacing: 0,
        textTransform: 'none'
      }
    },
    {
      id: 'elegant-paragraph',
      name: 'Párrafo Elegante',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '300',
        color: '#4b5563',
        lineHeight: '1.8',
        letterSpacing: '0.025em',
        textAlign: 'justify'
      },
      properties: {
        fontSize: 18,
        fontWeight: '300',
        color: '#4b5563',
        lineHeight: 1.8,
        letterSpacing: 1,
        textAlign: 'justify'
      }
    },
    {
      id: 'highlighted-paragraph',
      name: 'Párrafo Destacado',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#1f2937',
        backgroundColor: '#fef3c7',
        padding: '1rem',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '4px',
        lineHeight: '1.6'
      },
      properties: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        backgroundColor: '#fef3c7',
        padding: '20px',
        borderLeft: '4px solid #f59e0b',
        borderRadius: 4,
        lineHeight: 1.6
      }
    },
    {
      id: 'modern-paragraph',
      name: 'Párrafo Moderno',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: '1.7',
        letterSpacing: '0.01em',
        maxWidth: '65ch'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: 1.7,
        letterSpacing: 0.5,
        maxWidth: '65ch'
      }
    },
    {
      id: 'quote-paragraph',
      name: 'Párrafo Cita',
      preview: {
        fontSize: '1.25rem',
        fontWeight: '400',
        color: '#374151',
        fontStyle: 'italic',
        lineHeight: '1.6',
        borderLeft: '4px solid #d1d5db',
        paddingLeft: '1.5rem',
        backgroundColor: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0 8px 8px 0'
      },
      properties: {
        fontSize: 20,
        fontWeight: '400',
        color: '#374151',
        fontStyle: 'italic',
        lineHeight: 1.6,
        borderLeft: '4px solid #d1d5db',
        paddingLeft: '24px',
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderRadius: '0 8px 8px 0'
      }
    },
    {
      id: 'warning-paragraph',
      name: 'Párrafo Advertencia',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#92400e',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        padding: '1rem',
        borderRadius: '8px',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#92400e',
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        padding: '20px',
        borderRadius: 8,
        lineHeight: 1.5
      }
    },
    {
      id: 'success-paragraph',
      name: 'Párrafo Éxito',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#065f46',
        backgroundColor: '#d1fae5',
        border: '1px solid #10b981',
        padding: '1rem',
        borderRadius: '8px',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#065f46',
        backgroundColor: '#d1fae5',
        border: '1px solid #10b981',
        padding: '20px',
        borderRadius: 8,
        lineHeight: 1.5
      }
    },
    {
      id: 'info-paragraph',
      name: 'Párrafo Información',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1e40af',
        backgroundColor: '#dbeafe',
        border: '1px solid #3b82f6',
        padding: '1rem',
        borderRadius: '8px',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1e40af',
        backgroundColor: '#dbeafe',
        border: '1px solid #3b82f6',
        padding: '20px',
        borderRadius: 8,
        lineHeight: 1.5
      }
    },
    {
      id: 'error-paragraph',
      name: 'Párrafo Error',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#991b1b',
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        padding: '1rem',
        borderRadius: '8px',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#991b1b',
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        padding: '20px',
        borderRadius: 8,
        lineHeight: 1.5
      }
    },
    {
      id: 'large-paragraph',
      name: 'Párrafo Grande',
      preview: {
        fontSize: '1.375rem',
        fontWeight: '400',
        color: '#1f2937',
        lineHeight: '1.7',
        letterSpacing: '0.025em'
      },
      properties: {
        fontSize: 22,
        fontWeight: '400',
        color: '#1f2937',
        lineHeight: 1.7,
        letterSpacing: 1
      }
    },
    {
      id: 'small-paragraph',
      name: 'Párrafo Pequeño',
      preview: {
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: '1.6',
        letterSpacing: '0.025em'
      },
      properties: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: 1.6,
        letterSpacing: 1
      }
    },
    {
      id: 'centered-paragraph',
      name: 'Párrafo Centrado',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.75',
        textAlign: 'center',
        maxWidth: '50ch',
        margin: '0 auto'
      },
      properties: {
        fontSize: 18,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.75,
        textAlign: 'center',
        maxWidth: '50ch'
      }
    },
    {
      id: 'boxed-paragraph',
      name: 'Párrafo Enmarcado',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.6',
        border: '2px solid #e5e7eb',
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.6,
        border: '2px solid #e5e7eb',
        padding: '24px',
        borderRadius: 12,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    },
    {
      id: 'gradient-background-paragraph',
      name: 'Párrafo Gradiente',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#ffffff',
        lineHeight: '1.7',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1.5rem',
        borderRadius: '8px'
      },
      properties: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ffffff',
        lineHeight: 1.7,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: 8
      }
    },
    {
      id: 'dropcap-paragraph',
      name: 'Párrafo Capitular',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.7',
        textIndent: '0',
        position: 'relative'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.7,
        textIndent: 0,
        position: 'relative'
      }
    }
  ],
  quote: [
    {
      id: 'basic-quote',
      name: 'Cita Básica',
      preview: {
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 14,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.5,
        letterSpacing: 0
      }
    },
    {
      id: 'caption-text',
      name: 'Texto de Leyenda',
      preview: {
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      properties: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 2
      }
    },
    {
      id: 'accent-text',
      name: 'Texto Destacado',
      preview: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#3b82f6',
        textDecoration: 'underline',
        textDecorationColor: '#93c5fd'
      },
      properties: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3b82f6',
        textDecoration: 'underline',
        textDecorationColor: '#93c5fd'
      }
    },
    {
      id: 'label-text',
      name: 'Texto Etiqueta',
      preview: {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      properties: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        padding: '4px 8px',
        borderRadius: 4,
        textTransform: 'uppercase',
        letterSpacing: 1
      }
    },
    {
      id: 'badge-text',
      name: 'Texto Insignia',
      preview: {
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#059669',
        backgroundColor: '#d1fae5',
        border: '1px solid #10b981',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px'
      },
      properties: {
        fontSize: 12,
        fontWeight: '500',
        color: '#059669',
        backgroundColor: '#d1fae5',
        border: '1px solid #10b981',
        padding: '4px 12px',
        borderRadius: 9999
      }
    },
    {
      id: 'code-text',
      name: 'Texto Código',
      preview: {
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#dc2626',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px'
      },
      properties: {
        fontSize: 14,
        fontWeight: '400',
        color: '#dc2626',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        padding: '4px 8px',
        borderRadius: 4
      }
    },
    {
      id: 'link-text',
      name: 'Texto Enlace',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#2563eb',
        textDecoration: 'underline',
        textDecorationColor: '#93c5fd',
        cursor: 'pointer'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2563eb',
        textDecoration: 'underline',
        textDecorationColor: '#93c5fd',
        cursor: 'pointer'
      }
    },
    {
      id: 'muted-text',
      name: 'Texto Apagado',
      preview: {
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#9ca3af',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 14,
        fontWeight: '400',
        color: '#9ca3af',
        lineHeight: 1.5
      }
    },
    {
      id: 'strong-text',
      name: 'Texto Fuerte',
      preview: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#111827',
        lineHeight: '1.5'
      },
      properties: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 1.5
      }
    },
    {
      id: 'small-caps-text',
      name: 'Texto Versalitas',
      preview: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontVariant: 'small-caps'
      },
      properties: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontVariant: 'small-caps'
      }
    },
    {
      id: 'gradient-text',
      name: 'Texto Gradiente',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      },
      properties: {
        fontSize: 18,
        fontWeight: '600',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent'
      }
    },
    {
      id: 'shadow-text',
      name: 'Texto con Sombra',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
      }
    },
    {
      id: 'strikethrough-text',
      name: 'Texto Tachado',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#6b7280',
        textDecoration: 'line-through',
        textDecorationColor: '#ef4444'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6b7280',
        textDecoration: 'line-through',
        textDecorationColor: '#ef4444'
      }
    },
    {
      id: 'dotted-underline-text',
      name: 'Texto Subrayado Punteado',
      preview: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#374151',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#9ca3af'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#374151',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#9ca3af'
      }
    },
    {
      id: 'highlighted-text',
      name: 'Texto Resaltado',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#111827',
        backgroundColor: '#fde047',
        padding: '0.125rem 0.25rem',
        borderRadius: '2px'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        backgroundColor: '#fde047',
        padding: '2px 4px',
        borderRadius: 2
      }
    }
  ]
};

/**
 * Text Element Properties Component - Full featured with beautiful styling
 */
export const TextElementProperties: React.FC<TextElementPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  initialTab = 'basic',
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'templates'>(initialTab);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);

  // Update active tab when initialTab changes (e.g., when "Configuración" is clicked)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handlePropertyChange = (property: string, value: any) => {
    // Special handling for heading level changes
    if (property === 'level' && element.type === 'heading') {
      // Update both the level and the className to match the new level
      const newClassName = getHeadingClassName(value);
      onPropertyChange('level', value);
      onPropertyChange('className', newClassName);
    } else {
      onPropertyChange(property, value);
    }
  };

  const updateElement = (elementId: string, updates: Partial<Element>) => {
    onElementUpdate(elementId, updates);
  };

  // Get templates for current element type
  const currentTemplates = TEXT_TEMPLATES[element.type as keyof typeof TEXT_TEMPLATES] || TEXT_TEMPLATES.quote;

  // Helper function to apply template
  const applyTemplate = (template: typeof currentTemplates[0]) => {
    // First, clear all text style-related properties to avoid conflicts
    const clearedProperties = {
      ...element.properties,
      // Clear all text styling properties
      fontSize: undefined,
      fontWeight: undefined,
      fontFamily: undefined,
      fontStyle: undefined,
      color: undefined,
      textAlign: undefined,
      lineHeight: undefined,
      letterSpacing: undefined,
      wordSpacing: undefined,
      textDecoration: undefined,
      textDecorationColor: undefined,
      textDecorationStyle: undefined,
      textDecorationThickness: undefined,
      textTransform: undefined,
      textIndent: undefined,
      textShadow: undefined,
      whiteSpace: undefined,
      wordBreak: undefined,
      textOverflow: undefined,
      // Clear background and border properties
      backgroundColor: undefined,
      background: undefined,
      backgroundImage: undefined,
      backgroundSize: undefined,
      backgroundPosition: undefined,
      backgroundRepeat: undefined,
      border: undefined,
      borderLeft: undefined,
      borderRight: undefined,
      borderTop: undefined,
      borderBottom: undefined,
      borderRadius: undefined,
      borderWidth: undefined,
      borderColor: undefined,
      borderStyle: undefined,
      // Clear spacing properties
      padding: undefined,
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
      margin: undefined,
      marginTop: undefined,
      marginRight: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
      // Clear advanced properties
      boxShadow: undefined,
      maxWidth: undefined,
      minWidth: undefined,
      // NOTE: Removed width/height clearing to prevent interference with resize functionality
      // width: undefined,
      // height: undefined,
      // Clear webkit properties for gradient text
      WebkitBackgroundClip: undefined,
      WebkitTextFillColor: undefined
    };

    // Prepare template properties with scaling for heading elements
    let templateProperties = { ...template.properties } as any;
    
    // For heading elements, scale the font size based on the current heading level
    if (element.type === 'heading' && templateProperties.fontSize) {
      const currentLevel = element.properties.level || 1;
      const scaledFontSize = scaleTemplateForHeading(templateProperties.fontSize as number, currentLevel);
      templateProperties.fontSize = scaledFontSize;
      
      // Also update the className to match the heading level
      templateProperties.className = getHeadingClassName(currentLevel);
    }

    // Then apply the new template properties
    const updatedProperties = {
      ...clearedProperties,
      ...templateProperties
    } as any;
    
    onElementUpdate(element.id, { properties: updatedProperties });
  };

  const renderBasicTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Propiedades del Texto</h4>
       
       {/* Element Name */}
      <div>
         <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Elemento</label>
         <input
           type="text"
           value={element.name || ''}
           onChange={(e) => updateElement(element.id, { name: e.target.value })}
           placeholder="Nombre del elemento"
           className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
         />
       </div>

       {/* Heading Level (only for heading elements) */}
       {element.type === 'heading' && (
         <div>
           <label className="block text-sm font-medium text-gray-300 mb-2">
             <div className="flex flex-col space-y-2">
               <Tooltip text="Selecciona el nivel del encabezado (h1-h6). Los niveles más bajos tienen mayor importancia semántica.">
                 <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">headingLevel</code>
               </Tooltip>
               <span className="text-gray-300">Nivel del Encabezado</span>
             </div>
           </label>
           <select
             value={element.properties.level || 1}
             onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
             className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           >
             <option value={1}>H1 - Título Principal</option>
             <option value={2}>H2 - Título Secundario</option>
             <option value={3}>H3 - Subtítulo</option>
             <option value={4}>H4 - Encabezado</option>
             <option value={5}>H5 - Subencabezado</option>
             <option value={6}>H6 - Encabezado Menor</option>
           </select>
         </div>
       )}

       {/* Text Content */}
      <div>
         <label className="block text-sm font-medium text-gray-300 mb-2">
           {element.type === 'quote' ? 'Contenido de la Cita' : 'Contenido del Texto'}
         </label>
         <textarea
           value={element.type === 'quote' ? (element.properties.content || '') : (element.properties.text || '')}
           onChange={(e) => handlePropertyChange(element.type === 'quote' ? 'content' : 'text', e.target.value)}
           placeholder={element.type === 'quote' ? "Escribe tu cita aquí..." : "Escribe tu texto aquí..."}
           rows={3}
           className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
         />
       </div>

       {/* Typography Grid Layout */}
    </div>
  );

  const renderStylingTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Estilo y Tipografía</h4>
      
       <div className="grid grid-cols-2 gap-6 mb-8">
         {/* Left Column: Size, Weight, Style */}
         <div className="space-y-6">
           <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
             Tipografía
           </h5>

           {/* Font Size */}
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-3">
               <div className="flex flex-col space-y-2">
                 <Tooltip text="Tamaño de la fuente en píxeles.">
                   <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">font-size</code>
                 </Tooltip>
                 <span className="text-sm text-gray-300">Tamaño</span>
               </div>
             </label>
             <div className="flex gap-2 items-center">
               <input
                 type="number"
                 min="8"
                 max="200"
                 value={(() => {
                   const fontSize = element.properties.fontSize;
                   if (typeof fontSize === 'string') {
                     return parseInt(fontSize) || 16;
                   }
                   return fontSize || 16;
                 })()}
                 onChange={(e) => {
                   const value = e.target.value ? parseInt(e.target.value) : undefined;
                   handlePropertyChange('fontSize', value);
                 }}
                 className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                 placeholder="16"
               />
               <span className="px-2 py-2 bg-gray-600 text-gray-300 rounded text-sm whitespace-nowrap flex-shrink-0">px</span>
             </div>
           </div>

           {/* Font Weight & Style */}
           <div className="grid grid-cols-2 gap-2 min-w-0">
             <div className="min-w-0">
               <label className="block text-sm font-medium text-gray-300 mb-3">
                 <div className="flex flex-col space-y-2">
                   <Tooltip text="Grosor de la fuente del texto.">
                     <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">font-weight</code>
                   </Tooltip>
                   <span className="text-sm text-gray-300">Peso</span>
                 </div>
               </label>
               <select
                 value={element.properties.fontWeight || 'inherit'}
                 onChange={(e) => {
                   const value = e.target.value === 'inherit' ? undefined : e.target.value;
                   handlePropertyChange('fontWeight', value);
                 }}
                 className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
               >
                 <option value="inherit">Heredar</option>
                 <option value="300">Light</option>
                 <option value="400">Regular</option>
                 <option value="500">Medium</option>
                 <option value="600">Semi Bold</option>
                 <option value="700">Bold</option>
                 <option value="800">Extra Bold</option>
               </select>
             </div>

             <div className="min-w-0">
               <label className="block text-sm font-medium text-gray-300 mb-3">
                 <div className="flex flex-col space-y-2">
                   <Tooltip text="Estilo de la fuente (normal, cursiva, oblicua).">
                     <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">font-style</code>
                   </Tooltip>
                   <span className="text-sm text-gray-300">Estilo</span>
                 </div>
               </label>
               <select
                 value={element.properties.fontStyle || 'inherit'}
                 onChange={(e) => {
                   const value = e.target.value === 'inherit' ? undefined : e.target.value;
                   handlePropertyChange('fontStyle', value);
                 }}
                 className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
               >
                 <option value="inherit">Heredar</option>
                 <option value="normal">Normal</option>
                 <option value="italic">Cursiva</option>
                 <option value="oblique">Oblicua</option>
               </select>
             </div>
           </div>
         </div>

         {/* Right Column: Color and Alignment */}
         <div className="space-y-6">
           <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
             Color y Alineación
           </h5>

           {/* Text Color */}
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-3">
               Color
             </label>
             <div className="flex gap-3 items-center">
               <input
                 type="color"
                 value={element.properties.color || '#000000'}
                 onChange={(e) => handlePropertyChange('color', e.target.value)}
                 className="w-12 h-10 border border-gray-600 rounded cursor-pointer bg-transparent flex-shrink-0"
                 style={{ padding: '2px' }}
               />
               <input
                 type="text"
                 value={element.properties.color || ''}
                 onChange={(e) => handlePropertyChange('color', e.target.value)}
                 className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                 placeholder="#000000"
               />
             </div>
           </div>

           {/* Text Align */}
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-3">
               <div className="flex flex-col space-y-2">
                 <Tooltip text="Alineación horizontal del texto.">
                   <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">text-align</code>
                 </Tooltip>
                 <span className="text-sm text-gray-300">Alineación</span>
               </div>
             </label>
             <select
               value={element.properties.textAlign || 'inherit'}
               onChange={(e) => {
                 const value = e.target.value === 'inherit' ? undefined : e.target.value;
                 handlePropertyChange('textAlign', value);
               }}
               className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
             >
               <option value="inherit">Heredar</option>
               <option value="left">Izquierda</option>
               <option value="center">Centro</option>
               <option value="right">Derecha</option>
               <option value="justify">Justificado</option>
             </select>
           </div>

           {/* Line Height & Letter Spacing */}
           <div className="grid grid-cols-2 gap-3">
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-3">
                 <div className="flex flex-col space-y-2">
                   <Tooltip text="Altura de línea. Controla el espacio vertical entre líneas de texto.">
                     <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">line-height</code>
                   </Tooltip>
                   <span className="text-sm text-gray-300">Alt. línea</span>
                 </div>
               </label>
               <input
                 type="number"
                 min="0.5"
                 max="5"
                 step="0.1"
                 value={element.properties.lineHeight || ''}
                 onChange={(e) => {
                   const value = e.target.value ? parseFloat(e.target.value) : undefined;
                   handlePropertyChange('lineHeight', value);
                 }}
                 className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                 placeholder="1.5"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-3">
                 <div className="flex flex-col space-y-2">
                   <Tooltip text="Espaciado entre caracteres.">
                     <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">letter-spacing</code>
                   </Tooltip>
                   <span className="text-sm text-gray-300">Espaciado</span>
                 </div>
               </label>
               <div className="flex gap-2 items-center">
                 <input
                   type="number"
                   min="-5"
                   max="10"
                   step="0.1"
                   value={element.properties.letterSpacing || ''}
                   onChange={(e) => {
                     const value = e.target.value ? parseFloat(e.target.value) : undefined;
                     handlePropertyChange('letterSpacing', value);
                   }}
                   className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                   placeholder="0"
                 />
                 <span className="px-2 py-2 bg-gray-600 text-gray-300 rounded text-sm flex-shrink-0">px</span>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Advanced Typography Section (Full Width) */}
       <div className="mt-10 space-y-6">
         <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2">
           Efectos de Texto
         </h5>
         
         <div className="grid grid-cols-2 gap-6">
           {/* Text Decoration */}
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-3">
               <div className="flex flex-col space-y-2">
                 <Tooltip text="Decoración del texto (subrayado, tachado, etc.).">
                   <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">text-decoration</code>
                 </Tooltip>
                 <span className="text-sm text-gray-300">Decoración</span>
               </div>
             </label>
             <select
               value={element.properties.textDecoration || 'inherit'}
               onChange={(e) => {
                 const value = e.target.value === 'inherit' ? undefined : e.target.value;
                 handlePropertyChange('textDecoration', value);
               }}
               className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
             >
               <option value="inherit">Heredar</option>
               <option value="none">Sin decoración</option>
               <option value="underline">Subrayado</option>
               <option value="overline">Línea superior</option>
               <option value="line-through">Tachado</option>
             </select>
           </div>

           {/* Text Transform */}
           <div>
             <label className="block text-sm font-medium text-gray-300 mb-3">
               <div className="flex flex-col space-y-2">
                 <Tooltip text="Transformación del texto (mayúsculas, minúsculas, etc.).">
                   <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">text-transform</code>
                 </Tooltip>
                 <span className="text-sm text-gray-300">Transformar</span>
               </div>
             </label>
             <select
               value={element.properties.textTransform || 'inherit'}
               onChange={(e) => {
                 const value = e.target.value === 'inherit' ? undefined : e.target.value;
                 handlePropertyChange('textTransform', value);
               }}
               className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
             >
               <option value="inherit">Heredar</option>
               <option value="none">Sin transformar</option>
               <option value="uppercase">MAYÚSCULAS</option>
               <option value="lowercase">minúsculas</option>
               <option value="capitalize">Primera En Mayúscula</option>
             </select>
           </div>
         </div>
       </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-300">Plantillas Prediseñadas</h5>
        <button
          onClick={() => setTemplatePreviewOpen(!templatePreviewOpen)}
          className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <Eye size={14} />
          <span>Vista previa</span>
        </button>
      </div>
      
      {/* Info about template adaptation for headings */}
      {element.type === 'heading' && (
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5">
              ℹ️
            </div>
            <div className="text-xs text-blue-200">
              <strong>Plantillas Adaptables:</strong> Las plantillas se ajustarán automáticamente al tamaño del nivel de encabezado seleccionado (H{element.properties.level || 1}).
            </div>
          </div>
        </div>
      )}
      
      {/* Warning about style clearing */}
      <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5">
            ⚠️
          </div>
          <div className="text-xs text-amber-200">
            <strong>Nota:</strong> Al aplicar una plantilla se limpiarán todos los estilos existentes y se aplicarán únicamente los estilos de la plantilla seleccionada.
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {currentTemplates.map((template) => (
          <div key={template.id} className="border border-gray-600 rounded-lg p-3 bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-200">{template.name}</span>
              <button
                onClick={() => applyTemplate(template)}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
            {templatePreviewOpen && (
              <div className="flex justify-center p-3 bg-gray-800 rounded">
                <div
                  style={{
                    ...(template.preview as React.CSSProperties),
                    // Scale font size for heading templates based on current level
                    ...(element.type === 'heading' && template.preview.fontSize ? {
                      fontSize: `${scaleTemplateForHeading(
                        parseFloat(template.preview.fontSize.toString().replace('rem', '').replace('px', '')) * 
                        (template.preview.fontSize.toString().includes('rem') ? 16 : 1), // Convert rem to px
                        element.properties.level || 1
                      )}px`
                    } : {})
                  }}
                  className="pointer-events-none text-center"
                >
                  {element.properties.text || (element.type === 'heading' ? `Título H${element.properties.level || 1} de Ejemplo` : element.type === 'paragraph' ? 'Este es un párrafo de ejemplo que muestra cómo se verá el texto con este estilo aplicado.' : 'Texto de ejemplo')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="property-section">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'basic'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Settings size={16} />
          <span>Básico</span>
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'styling'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Type size={16} />
          <span>Estilo</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Palette size={16} />
          <span>Plantillas</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && renderBasicTab()}
      {activeTab === 'styling' && renderStylingTab()}
      {activeTab === 'templates' && renderTemplatesTab()}
    </div>
   );
 };
