/** @jsxImportSource react */
import type { ContainerTemplate } from './types';

/**
 * Basic Layout Templates - Fundamental column and row layouts
 * These are the core responsive templates with EXACT same styling as original
 */
export const basicLayoutTemplates: ContainerTemplate[] = [
  {
    id: 'single',
    name: 'Columna Simple',
    description: 'Un contenedor simple',
    icon: <div className="w-6 h-4 bg-gray-400 rounded"></div>,
    structure: [],
    layoutType: 'flexbox'
  },
  {
    id: 'two-columns',
    name: 'Dos Columnas',
    description: 'Dos columnas iguales',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      justifyContent: 'space-between'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'three-columns',
    name: 'Tres Columnas',
    description: 'Tres columnas iguales',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 12,
      justifyContent: 'space-between'
    },
    layoutType: 'flexbox', // Should be flexbox for row layout, not grid
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 8
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 8
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 8
        }
      }
    ]
  },
  {
    id: 'four-columns',
    name: 'Cuatro Columnas',
    description: 'Cuatro columnas iguales',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 8,
      justifyContent: 'space-between'
    },
    layoutType: 'flexbox', // Should be flexbox for row layout, not grid
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 6
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 6
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 6
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 6
        }
      }
    ]
  },
  {
    id: 'two-thirds-one-third',
    name: '2/3 + 1/3',
    description: 'Columna ancha y estrecha',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="w-4 bg-gray-400 rounded"></div>
        <div className="w-2 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      justifyContent: 'space-between'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 280,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 280,
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 140,
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'one-third-two-thirds',
    name: '1/3 + 2/3',
    description: 'Columna estrecha y ancha',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="w-2 bg-gray-400 rounded"></div>
        <div className="w-4 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      justifyContent: 'space-between'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 140,
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 280,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 280,
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'header-content',
    name: 'Encabezado + Contenido',
    description: 'Estructura vertical con encabezado',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="w-full h-1 bg-gray-400 rounded"></div>
        <div className="w-full flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 16,
      justifyContent: 'flex-start'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'row',
          width: 400,
          widthUnit: 'px',
          height: 80,
          heightUnit: 'px',
          minHeight: 80,
          minWidth: 400,
          backgroundColor: 'transparent',
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 400,
          backgroundColor: 'transparent',
          padding: 16
        }
      }
    ]
  }
];

/**
 * Hook for basic layout templates
 */
export const useBasicLayoutTemplates = () => {
  const getTemplateById = (id: string) => {
    return basicLayoutTemplates.find(template => template.id === id);
  };

  const getColumnTemplates = () => {
    return basicLayoutTemplates.filter(template => 
      template.id.includes('column') || template.id === 'single'
    );
  };

  const getHeaderTemplates = () => {
    return basicLayoutTemplates.filter(template => 
      template.id.includes('header')
    );
  };

  return {
    templates: basicLayoutTemplates,
    getTemplateById,
    getColumnTemplates,
    getHeaderTemplates
  };
};
