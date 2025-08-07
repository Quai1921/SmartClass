/** @jsxImportSource react */
import type { ContainerTemplate } from './types';

/**
 * Essential Templates - 10 Flexbox + 10 Grid fundamental layouts
 * These are the core templates for modern web layout
 */

// 10 Essential Flexbox Templates
export const essentialFlexboxTemplates: ContainerTemplate[] = [
  {
    id: 'flex-single',
    name: 'Columna Simple',
    description: 'Un contenedor simple',
    icon: <div className="w-6 h-4 bg-gray-400 rounded"></div>,
    structure: [],
    layoutType: 'flexbox'
  },
  {
    id: 'flex-two-columns',
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
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-three-columns',
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
          width: 180,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 180,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 180,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-sidebar-left',
    name: 'Sidebar + Contenido',
    description: 'Sidebar izquierdo con contenido principal',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="w-2 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
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
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-sidebar-right',
    name: 'Contenido + Sidebar',
    description: 'Contenido principal con sidebar derecho',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="w-2 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      alignItems: 'stretch'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
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
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-header-content',
    name: 'Encabezado + Contenido',
    description: 'Estructura vertical con encabezado',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="w-full h-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 16,
      alignItems: 'stretch'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'row',
          width: 600,
          widthUnit: 'px',
          height: 80,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 600,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-content-footer',
    name: 'Contenido + Pie',
    description: 'Contenido principal con pie de página',
    icon: (
      <div className="flex flex-col gap-0.5 w-6 h-4">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="w-full h-1 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 16,
      alignItems: 'stretch'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 600,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'row',
          width: 600,
          widthUnit: 'px',
          height: 80,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-hero-section',
    name: 'Sección Hero',
    description: 'Hero con contenido centrado',
    icon: (
      <div className="flex items-center justify-center w-6 h-4 bg-gray-400 rounded">
        <div className="w-2 h-2 bg-white rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'column',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 500,
          widthUnit: 'px',
          height: 250,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
    ]
  },
  {
    id: 'flex-card-row',
    name: 'Fila de Tarjetas',
    description: 'Tarjetas en fila horizontal',
    icon: (
      <div className="flex gap-0.5 w-6 h-4">
        <div className="w-1.5 h-3 bg-gray-400 rounded"></div>
        <div className="w-1.5 h-3 bg-gray-400 rounded"></div>
        <div className="w-1.5 h-3 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'row',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'flex-split-content',
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
      alignItems: 'stretch'
    },
    layoutType: 'flexbox',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
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
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  }
];

// 10 Essential Grid Templates (simplified to work with current type system)
export const essentialGridTemplates: ContainerTemplate[] = [
  {
    id: 'grid-2x2',
    name: 'Cuadrícula 2x2',
    description: 'Grid 2x2 para equipo',
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
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: 16
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
          height: 150,
          heightUnit: 'px',
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
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'grid-3x3',
    name: 'Cuadrícula 3x3',
    description: 'Grid 3x3 para servicios',
    icon: (
      <div className="grid grid-cols-3 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
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
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: 12
    },
    layoutType: 'grid',
    structure: Array.from({ length: 9 }, (_, i) => ({
      type: 'container' as const,
      order: i + 1,
      properties: {
        layout: 'column',
        width: 120,
        widthUnit: 'px',
        height: 120,
        heightUnit: 'px',
        backgroundColor: 'transparent',
        padding: 8
      }
    }))
  },
  {
    id: 'grid-header-sidebar-content',
    name: 'Header + Sidebar + Contenido',
    description: 'Layout completo con header, sidebar y contenido',
    icon: (
      <div className="grid grid-cols-3 grid-rows-2 gap-0.5 w-6 h-4">
        <div className="col-span-3 bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="col-span-2 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: '200px 1fr',
      gridTemplateRows: '80px 1fr',
      gridTemplateAreas: '"header header" "sidebar content"',
      gap: 16
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'row',
          width: 600,
          widthUnit: 'px',
          height: 80,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridArea: 'header'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridArea: 'sidebar'
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridArea: 'content'
        }
      }
    ]
  },
  {
    id: 'grid-masonry',
    name: 'Grid Masonry',
    description: 'Grid con elementos de diferentes alturas',
    icon: (
      <div className="grid grid-cols-3 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded h-2"></div>
        <div className="bg-gray-400 rounded h-3"></div>
        <div className="bg-gray-400 rounded h-2"></div>
        <div className="bg-gray-400 rounded h-3"></div>
        <div className="bg-gray-400 rounded h-2"></div>
        <div className="bg-gray-400 rounded h-3"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'min-content',
      gap: 16
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 120,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 180,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 140,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 160,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 5,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 100,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 6,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'grid-feature-showcase',
    name: 'Vitrina de Características',
    description: 'Grid para mostrar características destacadas',
    icon: (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-6 h-4">
        <div className="col-span-2 bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '200px 150px',
      gap: 20
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 20,
          gridColumn: '1 / -1'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 190,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 190,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      }
    ]
  },
  {
    id: 'grid-dashboard',
    name: 'Dashboard',
    description: 'Layout tipo dashboard con widgets',
    icon: (
      <div className="grid grid-cols-4 grid-rows-3 gap-0.5 w-6 h-4">
        <div className="col-span-4 bg-gray-400 rounded"></div>
        <div className="col-span-2 bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="col-span-2 bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: '80px repeat(2, 150px)',
      gap: 16
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'row',
          width: 600,
          widthUnit: 'px',
          height: 80,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridColumn: '1 / -1'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 300,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridColumn: 'span 2'
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 4,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 5,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 6,
        properties: {
          layout: 'column',
          width: 140,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12
        }
      },
      {
        type: 'container',
        order: 7,
        properties: {
          layout: 'column',
          width: 300,
          widthUnit: 'px',
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 12,
          gridColumn: 'span 2'
        }
      }
    ]
  },
  {
    id: 'grid-article-layout',
    name: 'Layout de Artículo',
    description: 'Grid para artículos con sidebar',
    icon: (
      <div className="grid grid-cols-4 gap-0.5 w-6 h-4">
        <div className="col-span-3 bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 24
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 400,
          widthUnit: 'px',
          height: 400,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 20
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 200,
          widthUnit: 'px',
          height: 400,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16
        }
      }
    ]
  },
  {
    id: 'grid-pricing-table',
    name: 'Tabla de Precios',
    description: 'Grid para planes de precios',
    icon: (
      <div className="grid grid-cols-3 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">$</div>
        </div>
        <div className="bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">$$</div>
        </div>
        <div className="bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">$$$</div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 180,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 180,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 180,
          widthUnit: 'px',
          height: 300,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16
        }
      }
    ]
  },
  {
    id: 'grid-gallery',
    name: 'Galería de Imágenes',
    description: 'Grid responsive para galería',
    icon: (
      <div className="grid grid-cols-2 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded"></div>
        <div className="grid grid-rows-2 gap-0.5">
          <div className="bg-gray-400 rounded"></div>
          <div className="bg-gray-400 rounded"></div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: 12
    },
    layoutType: 'grid',
    structure: [
      {
        type: 'container',
        order: 1,
        properties: {
          layout: 'column',
          width: 300,
          widthUnit: 'px',
          height: 200,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 8,
          gridRow: 'span 2'
        }
      },
      {
        type: 'container',
        order: 2,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 96,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 8
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 150,
          widthUnit: 'px',
          height: 96,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 8
        }
      }
    ]
  },
  {
    id: 'grid-testimonials',
    name: 'Testimonios',
    description: 'Grid para testimonios de clientes',
    icon: (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-6 h-4">
        <div className="bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">"</div>
        </div>
        <div className="bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">"</div>
        </div>
        <div className="col-span-2 bg-gray-400 rounded flex items-center justify-center">
          <div className="text-xs text-white">"</div>
        </div>
      </div>
    ),
    containerProperties: {
      layout: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: 20
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
          height: 150,
          heightUnit: 'px',
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
          height: 150,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16
        }
      },
      {
        type: 'container',
        order: 3,
        properties: {
          layout: 'column',
          width: 420,
          widthUnit: 'px',
          height: 120,
          heightUnit: 'px',
          backgroundColor: 'transparent',
          padding: 16,
          gridColumn: '1 / -1'
        }
      }
    ]
  }
];

// Combined essential templates
export const essentialTemplates: ContainerTemplate[] = [
  ...essentialFlexboxTemplates,
  ...essentialGridTemplates
];
