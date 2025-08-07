import type { ElementType } from '../types';

// Counter to track element counts for naming
let elementCounters: Record<ElementType, number> = {
  container: 0,
  'simple-container': 0,
  heading: 0,
  paragraph: 0,
  text: 0,
  quote: 0,
  image: 0,
  video: 0,
  audio: 0,
  button: 0,
  'text-statement': 0,
  'image-choice': 0,
  'image-comparison': 0,
  'audio-comparison': 0,
  'audio-true-false': 0,
  'area-true-false': 0,
  'speech-recognition': 0,
  'connection-widget': 0,
  'connection-text-node': 0,
  'connection-image-node': 0,
  'drag-drop-widget': 0,
  'standalone-widget': 0,
  'fill-in-blanks': 0,
  'single-choice': 0,
  'math-calculator': 0
};

// Map element types to user-friendly base names
const elementTypeNames: Record<ElementType, string> = {
  container: 'Contenedor',
  'simple-container': 'Contenedor Simple',
  heading: 'Título',
  paragraph: 'Párrafo',
  text: 'Texto',
  quote: 'Cita',
  image: 'Imagen',
  video: 'Video',
  audio: 'Audio',
  button: 'Botón',
  'text-statement': 'Declaración',
  'image-choice': 'Imagen V/F',
  'image-comparison': 'Comparar Imagen',
  'audio-comparison': 'Comparar Audio',
  'audio-true-false': 'Audio V/F',
  'area-true-false': 'Área V/F',
  'speech-recognition': 'Reconocimiento de Voz',
  'connection-widget': 'Nodos de Conexión',
  'connection-text-node': 'Nodo de Texto',
  'connection-image-node': 'Nodo de Imagen',
  'drag-drop-widget': 'Widget Arrastra y Suelta',
  'standalone-widget': 'Elemento Independiente',
  'fill-in-blanks': 'Completar Huecos',
  'single-choice': 'Selección Única',
  'math-calculator': 'Calculadora Matemática'
};

/**
 * Generate a human-readable name for an element
 */
export function generateElementName(type: ElementType): string {
  elementCounters[type]++;
  const baseName = elementTypeNames[type];
  return `${baseName} ${elementCounters[type]}`;
}

/**
 * Reset all element counters (useful for new projects)
 */
export function resetElementCounters(): void {
  Object.keys(elementCounters).forEach(key => {
    elementCounters[key as ElementType] = 0;
  });
}

/**
 * Update element counters based on existing elements
 * This is useful when loading a project to ensure new elements get the right numbers
 */
export function updateElementCounters(elements: Array<{ type: ElementType; name: string }>): void {
  // Reset counters first
  resetElementCounters();
  
  // Count existing elements by type and find the highest number for each
  elements.forEach(element => {
    const baseName = elementTypeNames[element.type];
    const namePattern = new RegExp(`^${baseName} (\\d+)$`);
    const match = element.name.match(namePattern);
    
    if (match) {
      const number = parseInt(match[1], 10);
      if (number > elementCounters[element.type]) {
        elementCounters[element.type] = number;
      }
    }
  });
}

/**
 * Get the current counter value for a specific element type
 */
export function getElementCounter(type: ElementType): number {
  return elementCounters[type];
}

/**
 * Set the counter for a specific element type
 */
export function setElementCounter(type: ElementType, count: number): void {
  elementCounters[type] = count;
}
