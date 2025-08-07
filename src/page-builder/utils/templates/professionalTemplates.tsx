import type { ContainerTemplate } from './types';

/**
 * Professional Templates - Business-focused layouts 
 * Includes pricing tables, team grids, service showcases with EXACT same styling
 */
export const professionalTemplates: ContainerTemplate[] = [
  {
    id: 'pricing-table',
    name: 'Tabla de Precios',
    description: 'Tres columnas para precios',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded border-2 border-gray-500"></div>
        <div className="flex-1 bg-blue-400 rounded border-2 border-blue-500"></div>
        <div className="flex-1 bg-gray-400 rounded border-2 border-gray-500"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      justifyContent: 'center',
      alignItems: 'stretch'
    },
    layoutType: 'flexbox', // Should be flexbox for row layout
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
          backgroundColor: '#f8f9fa',
          padding: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
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
          backgroundColor: '#0066cc',
          padding: 20,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#0052a3',
          borderStyle: 'solid',
          color: '#ffffff'
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
          backgroundColor: '#f8f9fa',
          padding: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      }
    ]
  },
  {
    id: 'team-grid',
    name: 'Cuadrícula de Equipo',
    description: 'Grid 2x2 para miembros del equipo',
    icon: (
      <div className="grid grid-cols-2 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 24,
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    layoutType: 'flexbox', // Should be flexbox for row layout with wrapping
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
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center'
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
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center'
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
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center'
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
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center'
        }
      }
    ]
  },
  {
    id: 'services-showcase',
    name: 'Vitrina de Servicios',
    description: 'Servicios en columnas con iconos',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mb-0.5"></div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mb-0.5"></div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mb-0.5"></div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 32,
      justifyContent: 'center',
      padding: 40
    },
    layoutType: 'flexbox', // Should be flexbox for row layout
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 280,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 24,
          alignItems: 'center',
          textAlign: 'center',
          gap: 16
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 280,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 24,
          alignItems: 'center',
          textAlign: 'center',
          gap: 16
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 280,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 24,
          alignItems: 'center',
          textAlign: 'center',
          gap: 16
        }
      }
    ]
  },
  {
    id: 'stats-counter',
    name: 'Contador de Estadísticas',
    description: 'Cuatro estadísticas en fila',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs font-bold text-blue-500">99</div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs font-bold text-green-500">99</div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs font-bold text-purple-500">99</div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs font-bold text-red-500">99</div>
          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 0,
      justifyContent: 'space-around',
      backgroundColor: '#f8f9fa',
      padding: 40,
      borderRadius: 8
    },
    layoutType: 'flexbox', // Should be flexbox for row layout
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 25,
          widthUnit: '%',
          minHeight: 120,
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center',
          gap: 8
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 25,
          widthUnit: '%',
          minHeight: 120,
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center',
          gap: 8
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 25,
          widthUnit: '%',
          minHeight: 120,
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center',
          gap: 8
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 25,
          widthUnit: '%',
          minHeight: 120,
          backgroundColor: 'transparent',
          padding: 16,
          alignItems: 'center',
          textAlign: 'center',
          gap: 8
        }
      }
    ]
  },
  {
    id: 'blog-preview',
    name: 'Vista Previa Blog',
    description: 'Artículos de blog en tarjetas',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 flex flex-col bg-gray-200 rounded p-0.5">
          <div className="h-1 bg-gray-400 rounded mb-0.5"></div>
          <div className="h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col bg-gray-200 rounded p-0.5">
          <div className="h-1 bg-gray-400 rounded mb-0.5"></div>
          <div className="h-0.5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 flex flex-col bg-gray-200 rounded p-0.5">
          <div className="h-1 bg-gray-400 rounded mb-0.5"></div>
          <div className="h-0.5 bg-gray-300 rounded"></div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 24,
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    layoutType: 'flexbox', // Should be flexbox for row layout with wrapping
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 320,
          widthUnit: 'px',
          minHeight: 280,
          backgroundColor: '#ffffff',
          padding: 0,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 320,
          widthUnit: 'px',
          minHeight: 280,
          backgroundColor: '#ffffff',
          padding: 0,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 320,
          widthUnit: 'px',
          minHeight: 280,
          backgroundColor: '#ffffff',
          padding: 0,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      }
    ]
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Acordeón',
    description: 'Preguntas frecuentes en acordeón',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 8,
      maxWidth: 800,
      padding: 40
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 100,
          widthUnit: '%',
          minHeight: 60,
          backgroundColor: '#ffffff',
          padding: 20,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 100,
          widthUnit: '%',
          minHeight: 60,
          backgroundColor: '#ffffff',
          padding: 20,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 100,
          widthUnit: '%',
          minHeight: 60,
          backgroundColor: '#ffffff',
          padding: 20,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 100,
          widthUnit: '%',
          minHeight: 60,
          backgroundColor: '#ffffff',
          padding: 20,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e9ecef',
          borderStyle: 'solid'
        }
      }
    ]
  },
  {
    id: 'gallery-grid',
    name: 'Galería en Cuadrícula',
    description: 'Grid de imágenes 3x2',
    icon: (
      <div className="grid grid-cols-3 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gap: 16,
      gridColumns: 3,
      gridRows: 2,
      justifyContent: 'center'
    },
    layoutType: 'grid', // True grid layout for gallery
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      },
      {
        type: 'container',
        order: 5,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      },
      {
        type: 'container',
        order: 6,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          minHeight: 200,
          backgroundColor: '#f8f9fa',
          padding: 0,
          borderRadius: 8
        }
      }
    ]
  }
];

/**
 * Hook for professional templates
 */
export const useProfessionalTemplates = () => {
  const getTemplateById = (id: string) => {
    return professionalTemplates.find(template => template.id === id);
  };

  const getPricingTemplates = () => {
    return professionalTemplates.filter(template => 
      template.id.includes('pricing')
    );
  };

  const getTeamTemplates = () => {
    return professionalTemplates.filter(template => 
      template.id.includes('team')
    );
  };

  const getServiceTemplates = () => {
    return professionalTemplates.filter(template => 
      template.id.includes('service') || template.id.includes('stats')
    );
  };

  const getContentTemplates = () => {
    return professionalTemplates.filter(template => 
      template.id.includes('blog') || template.id.includes('faq') || template.id.includes('gallery')
    );
  };

  return {
    templates: professionalTemplates,
    getTemplateById,
    getPricingTemplates,
    getTeamTemplates,
    getServiceTemplates,
    getContentTemplates
  };
};
