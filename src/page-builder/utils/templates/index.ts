/**
 * Container Templates Index - Partitioned but maintains EXACT same styling
 * 
 * This file preserves the original containerTemplates export while organizing
 * templates into logical categories for better maintainability.
 */

// Export all template types and utilities
export type { ContainerTemplate, TemplateStructure } from './types';
export { createElementsFromTemplate } from './templateUtils';

// Import all template categories  
import { basicLayoutTemplates, useBasicLayoutTemplates } from './basicLayouts';
import { specializedLayoutTemplates, useSpecializedLayoutTemplates } from './specializedLayouts';
import { professionalTemplates, useProfessionalTemplates } from './professionalTemplates';

// Combine all templates to maintain the original interface
export const containerTemplates = [
  ...basicLayoutTemplates,
  ...specializedLayoutTemplates,
  ...professionalTemplates
];

// Export individual template categories
export { basicLayoutTemplates, specializedLayoutTemplates, professionalTemplates };

// Export template hooks
export { useBasicLayoutTemplates, useSpecializedLayoutTemplates, useProfessionalTemplates };

// Main hook that combines all templates (maintains original functionality)
export const useContainerTemplates = () => {
  const getTemplateById = (id: string) => {
    return containerTemplates.find(template => template.id === id);
  };

  const getTemplatesByCategory = () => {
    return [
      {
        name: 'Diseños Básicos',
        templates: basicLayoutTemplates
      },
      {
        name: 'Diseños Especializados', 
        templates: specializedLayoutTemplates
      },
      {
        name: 'Plantillas Profesionales',
        templates: professionalTemplates
      }
    ];
  };

  const getAllTemplates = () => containerTemplates;

  // Quick access methods
  const getBasicTemplates = () => basicLayoutTemplates;
  const getSpecializedTemplates = () => specializedLayoutTemplates;
  const getProfessionalTemplates = () => professionalTemplates;

  return {
    templates: containerTemplates,
    getTemplateById,
    getTemplatesByCategory,
    getAllTemplates,
    getBasicTemplates,
    getSpecializedTemplates,
    getProfessionalTemplates
  };
};
