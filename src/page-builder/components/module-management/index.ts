// Module Management Components
export { ConfirmationModal } from './ConfirmationModal';
export { CreateModuleModal } from './CreateModuleModal';
export { EditModuleModal } from './EditModuleModal';
export { ModuleCard } from './ModuleCard';
export { ModuleFilters } from './ModuleFilters';
export { ModuleGrid } from './ModuleGrid';
export { ModuleHeader } from './ModuleHeader';

// Hooks
export { useModuleManagement } from './hooks/useModuleManagement';

// Utils
export { 
  generateModuleGradient,
  formatModuleDuration,
  getModuleTypeDisplayName,
  getModuleTypeColor,
  getModuleStatusInfo,
  truncateModuleDescription,
  sortModules,
  filterModules
} from './utils/moduleUtils';
