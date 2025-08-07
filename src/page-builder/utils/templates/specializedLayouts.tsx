import type { ContainerTemplate } from './types';

/**
 * Specialized Layout Templates - Advanced layouts for specific use cases
 * Includes hero sections, grids, and complex layouts with EXACT same styling
 */
export const specializedLayoutTemplates: ContainerTemplate[] = [
  {
    id: 'sidebar-content',
    name: 'Sidebar + Contenido',
    description: 'Sidebar izquierdo con contenido principal',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="w-1.5 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 20,
      justifyContent: 'flex-start'
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
          padding: 16
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
          padding: 16
        }
      }
    ]
  },
  {
    id: 'content-sidebar',
    name: 'Contenido + Sidebar',
    description: 'Contenido principal con sidebar derecho',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="w-1.5 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 20,
      justifyContent: 'flex-start'
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
          padding: 16
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
          padding: 16
        }
      }
    ]
  },
  {
    id: 'hero-section',
    name: 'Sección Hero',
    description: 'Hero con contenido centrado',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="w-full h-2 bg-gray-400 rounded flex items-center justify-center">
          <div className="w-3 h-0.5 bg-white rounded"></div>
        </div>
        <div className="w-full h-1 bg-gray-300 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 24,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400
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
          padding: 32,
          justifyContent: 'center',
          alignItems: 'center'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'row',
          width: 200,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          minWidth: 200,
          backgroundColor: 'transparent',
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16
        }
      }
    ]
  },
  {
    id: 'split-hero',
    name: 'Hero Dividido',
    description: 'Hero con imagen y contenido lado a lado',
    icon: (
      <div className="flex w-6 h-4">
        <div className="w-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-l"></div>
        <div className="w-3 bg-gray-300 rounded-r flex flex-col justify-center">
          <div className="mx-0.5 my-0.5 h-0.5 bg-gray-500 rounded"></div>
          <div className="mx-0.5 my-0.5 h-0.5 bg-gray-500 rounded"></div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 0,
      minHeight: 500,
      alignItems: 'stretch'
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
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 48,
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff'
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
          backgroundColor: '#f8f9fa',
          padding: 48,
          justifyContent: 'center'
        }
      }
    ]
  },
  {
    id: 'card-grid',
    name: 'Grid de Cards',
    description: 'Grid 2x2 para tarjetas',
    icon: (
      <div className="grid grid-cols-2 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gap: 16,
      gridColumns: 2,
      gridRows: 2,
      justifyContent: 'space-between'
    },
    layoutType: 'grid',
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
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 16,
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
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 16,
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
          height: 200,
          heightUnit: 'px',
          minHeight: 200,
          backgroundColor: 'transparent',
          padding: 16,
          borderRadius: 8
        }
      }
    ]
  },
  {
    id: 'header-main-footer',
    name: 'Header + Main + Footer',
    description: 'Estructura completa de página',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
        <div className="w-full flex-1 bg-gray-400 rounded"></div>
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 0,
      justifyContent: 'flex-start',
      minHeight: 500
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'row',
          width: 100,
          widthUnit: '%',
          height: 80,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16,
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 100,
          widthUnit: '%',
          minHeight: 300,
          backgroundColor: 'transparent',
          padding: 24
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'row',
          width: 100,
          widthUnit: '%',
          height: 60,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16,
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
    ]
  }
];

/**
 * Hook for specialized layout templates
 */
export const useSpecializedLayoutTemplates = () => {
  const getTemplateById = (id: string) => {
    return specializedLayoutTemplates.find(template => template.id === id);
  };

  const getHeroTemplates = () => {
    return specializedLayoutTemplates.filter(template => 
      template.id.includes('hero')
    );
  };

  const getSidebarTemplates = () => {
    return specializedLayoutTemplates.filter(template => 
      template.id.includes('sidebar') || template.id.includes('content')
    );
  };

  const getGridTemplates = () => {
    return specializedLayoutTemplates.filter(template => 
      template.id.includes('grid') || template.layoutType === 'grid'
    );
  };

  const getPageTemplates = () => {
    return specializedLayoutTemplates.filter(template => 
      template.id.includes('header') || template.id.includes('footer')
    );
  };

  return {
    templates: specializedLayoutTemplates,
    getTemplateById,
    getHeroTemplates,
    getSidebarTemplates,
    getGridTemplates,
    getPageTemplates
  };
};
