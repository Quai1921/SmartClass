import type { Element } from '../../../../types';

// Helper function to get default classes for heading levels
export function getHeadingClassName(level: number): string {
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
export function getHeadingFontSize(level: number): number {
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
export function scaleTemplateForHeading(templateFontSize: number, headingLevel: number): number {
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
export const TEXT_TEMPLATES = {
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
        fontFamily: 'Georgia, serif'
      },
      properties: {
        fontSize: 36,
        fontWeight: '300',
        color: '#374151',
        lineHeight: 1.3,
        letterSpacing: 2,
        fontFamily: 'Georgia, serif',
        textTransform: 'none'
      }
    },
    {
      id: 'bold-heading',
      name: 'Título Negrita',
      preview: {
        fontSize: '2rem',
        fontWeight: '900',
        color: '#111827',
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        textTransform: 'uppercase'
      },
      properties: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
        lineHeight: 1.1,
        letterSpacing: -1,
        textTransform: 'uppercase'
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
        lineHeight: '1.6',
        letterSpacing: '0.01em'
      },
      properties: {
        fontSize: 16,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.6,
        letterSpacing: 0.5,
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
        lineHeight: '1.7',
        letterSpacing: '0.02em',
        fontFamily: 'Georgia, serif'
      },
      properties: {
        fontSize: 18,
        fontWeight: '300',
        color: '#4b5563',
        lineHeight: 1.7,
        letterSpacing: 1,
        fontFamily: 'Georgia, serif',
        textTransform: 'none'
      }
    },
    {
      id: 'modern-paragraph',
      name: 'Párrafo Moderno',
      preview: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#1f2937',
        lineHeight: '1.5',
        letterSpacing: '0.01em'
      },
      properties: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
        lineHeight: 1.5,
        letterSpacing: 0.5,
        textTransform: 'none'
      }
    }
  ],
  quote: [
    {
      id: 'classic-quote',
      name: 'Cita Clásica',
      preview: {
        fontSize: '1.25rem',
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: '1.6',
        fontStyle: 'italic',
        borderLeft: '4px solid #d1d5db',
        paddingLeft: '1rem'
      },
      properties: {
        fontSize: 20,
        fontWeight: '400',
        color: '#6b7280',
        lineHeight: 1.6,
        fontStyle: 'italic',
        borderLeft: '4px solid #d1d5db',
        paddingLeft: 16,
        textTransform: 'none'
      }
    },
    {
      id: 'modern-quote',
      name: 'Cita Moderna',
      preview: {
        fontSize: '1.125rem',
        fontWeight: '300',
        color: '#4b5563',
        lineHeight: '1.7',
        fontStyle: 'italic',
        background: '#f3f4f6',
        padding: '1rem',
        borderRadius: '0.5rem'
      },
      properties: {
        fontSize: 18,
        fontWeight: '300',
        color: '#4b5563',
        lineHeight: 1.7,
        fontStyle: 'italic',
        backgroundColor: '#f3f4f6',
        padding: 16,
        borderRadius: 8,
        textTransform: 'none'
      }
    },
    {
      id: 'elegant-quote',
      name: 'Cita Elegante',
      preview: {
        fontSize: '1.25rem',
        fontWeight: '400',
        color: '#374151',
        lineHeight: '1.5',
        fontStyle: 'italic',
        fontFamily: 'Georgia, serif',
        textAlign: 'center'
      },
      properties: {
        fontSize: 20,
        fontWeight: '400',
        color: '#374151',
        lineHeight: 1.5,
        fontStyle: 'italic',
        fontFamily: 'Georgia, serif',
        textAlign: 'center',
        textTransform: 'none'
      }
    }
  ]
} as const; 