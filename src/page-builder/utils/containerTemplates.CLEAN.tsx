/**
 * Container Templates - Clean Partitioned Version
 * 
 * This file exports from the partitioned template system while maintaining
 * the exact same API and responsive styling as the original.
 * All responsive functionality is preserved.
 */

// Re-export everything from the partitioned templates to maintain compatibility
export type { ContainerTemplate, TemplateStructure } from './templates/types';
export { 
  containerTemplates,
  createElementsFromTemplate,
  useContainerTemplates
} from './templates/index';

// For backwards compatibility, also export the main templates array as default
import { containerTemplates } from './templates/index';
export default containerTemplates;
