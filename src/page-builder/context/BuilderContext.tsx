import { createContext } from 'react';
import type { BuilderContextType } from './types';

/**
 * Main BuilderContext that provides the builder state and operations
 * The actual implementation is in the modular BuilderProvider component
 */
export const BuilderContext = createContext<BuilderContextType | null>(null);

// Re-export the modular provider and related components
export { BuilderProvider } from './components';
export { useBuilder } from '../hooks/useBuilder';
export type { BuilderContextType } from './types';
