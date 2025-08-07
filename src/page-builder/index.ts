// Main components (using refactored versions)
export { PageBuilder } from './builder/PageBuilderRefactored';
export { Canvas } from './builder/Canvas';
export { Sidebar } from './builder/Sidebar';
export { PropertyPanel } from './builder/PropertyPanel';
export { Toolbar } from './builder/Toolbar';
export { ElementWrapper } from './builder/ElementWrapper';
export { ElementRenderer } from './builder/ElementRenderer';

// Widget components
export { VideoWidget, VideoUploadModal } from './components/VideoWidget';
export { VideoChoiceModal } from './components/VideoChoiceModal';

// Context and hooks
export { BuilderProvider, BuilderContext } from './context/BuilderContext';
export { useBuilder } from './hooks/useBuilder';

// Types
export type * from './types';

// Utilities
export { createElement, createElementFromType, createTemporaryElementFromType, getDefaultProperties, getDefaultPropertiesWithContext } from './utils/elementFactory';
export { validateElement, validateElements } from './utils/validation';


// Pages
export { default as PageBuilderPage } from './pages/PageBuilderPage';
