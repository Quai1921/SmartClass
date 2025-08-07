import type { ElementProperties } from '../../types';

export interface ContainerTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  structure: TemplateStructure[];
  containerProperties?: Partial<ElementProperties>;
  layoutType: 'flexbox' | 'grid';
}

export interface TemplateStructure {
  type: 'container';
  properties: Partial<ElementProperties>;
  children?: TemplateStructure[];
  order: number;
}

export interface TemplateCategory {
  category: string;
  templates: ContainerTemplate[];
}

export interface TemplateHook {
  templates: ContainerTemplate[];
  getTemplateById: (id: string) => ContainerTemplate | undefined;
  getTemplatesByCategory: () => TemplateCategory;
}
