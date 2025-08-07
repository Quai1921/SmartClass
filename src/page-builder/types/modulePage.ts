/**
 * Module Page interface for page builder functionality
 * Represents a single page within a module
 */

export interface ModulePage {
  id: string;
  title: string;
  content: string; // JSON string containing page builder elements
  order: number;
  createdAt: string;
  updatedAt: string;
  moduleId?: string; // Optional reference to parent module
} 