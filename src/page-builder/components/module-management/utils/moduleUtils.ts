import type { Module } from '../../../../actions/modules/modules';

/**
 * Generates a random gradient for module cards
 */
export const generateModuleGradient = (moduleId: string): string => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-teal-500 to-green-600',
    'from-orange-500 to-red-600',
  ];

  // Use moduleId to get consistent gradient
  const hash = moduleId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return gradients[Math.abs(hash) % gradients.length];
};

/**
 * Formats module duration in a readable format
 */
export const formatModuleDuration = (estimatedTime?: number): string => {
  if (!estimatedTime) return '30 min';
  
  if (estimatedTime < 60) {
    return `${estimatedTime} min`;
  }
  
  const hours = Math.floor(estimatedTime / 60);
  const minutes = estimatedTime % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}min`;
};

/**
 * Gets the display name for a module type
 */
export const getModuleTypeDisplayName = (type: string): string => {
  switch (type) {
    case 'ACADEMIC':
      return 'Académico';
    case 'EVALUATION':
      return 'Evaluativo';
    default:
      return type;
  }
};

/**
 * Gets the color class for a module type
 */
export const getModuleTypeColor = (type: string): string => {
  switch (type) {
    case 'ACADEMIC':
      return 'bg-blue-900 text-blue-300';
    case 'EVALUATION':
      return 'bg-purple-900 text-purple-300';
    default:
      return 'bg-gray-900 text-gray-300';
  }
};

/**
 * Gets the status display info for a module
 */
export const getModuleStatusInfo = (status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => {
  switch (status) {
    case 'PUBLISHED':
      return { text: 'Publicado', color: 'bg-green-900 text-green-300' };
    case 'IN_REVIEW':
      return { text: 'En Revisión', color: 'bg-blue-900 text-blue-300' };
    case 'DRAFT':
    default:
      return { text: 'Borrador', color: 'bg-yellow-900 text-yellow-300' };
  }
};

/**
 * Truncates module description for display
 */
export const truncateModuleDescription = (module: Module, maxLength: number = 100): string => {
  const text = module.description && module.description.length > 0
    ? module.description
    : module.content || 'Sin descripción';
    
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Sorts modules by order, then by creation date
 */
export const sortModules = (modules: Module[]): Module[] => {
  return [...modules].sort((a, b) => {
    // First sort by order (if available)
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    // If one has order and other doesn't, prioritize the one with order
    if (a.order !== undefined && b.order === undefined) return -1;
    if (a.order === undefined && b.order !== undefined) return 1;
    
    // If neither has order, sort by creation date (newest first)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    // Fallback to title
    return a.title.localeCompare(b.title);
  });
};

/**
 * Filters modules based on search criteria
 */
export const filterModules = (modules: Module[], searchTerm: string): Module[] => {
  if (!searchTerm.trim()) {
    return modules;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  return modules.filter(module => 
    module.title.toLowerCase().includes(searchLower) ||
    (module.description && module.description.toLowerCase().includes(searchLower)) ||
    (module.content && module.content.toLowerCase().includes(searchLower)) ||
    module.type.toLowerCase().includes(searchLower) ||
    getModuleTypeDisplayName(module.type).toLowerCase().includes(searchLower)
  );
};
