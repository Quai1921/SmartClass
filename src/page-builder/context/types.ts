import type { Element, Course, Page } from '../types';

export interface BuilderContextType {
  elements: Element[];
  selectedElementId: string | null;
  selectedElementIds: string[]; // New: multiple selection support
  draggedElement: Element | null;
  clipboard: Element[]; // Copied elements
  course: Course | null;
  currentPage: Page | null; // Currently active page
  sidebarVisible: boolean;
  sidebarWidth: number;
  propertyPanelVisible: boolean;
  // Text element property panel tab state
  textElementTab: 'basic' | 'styling' | 'templates' | null; // null means use default
  setTextElementTab: (tab: 'basic' | 'styling' | 'templates' | null) => void;
  // Real-time resize state for better performance and dynamic property display
  resizeState: {
    elementId: string | null;
    dimensions: { width: number; height: number } | null;
    isResizing: boolean;
  };
  // Page management
  addPage: (title?: string) => string; // Returns new page ID
  removePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => string; // Returns new page ID
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  switchPage: (pageId: string) => void;
  reorderPages: (pageIds: string[]) => void;
  // Preview functionality
  previewMode: boolean;
  currentSlideIndex: number;
  togglePreview: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  // Copy-paste functionality
  copyElements: (elementIds: string[]) => void;
  pasteElements: (parentId?: string, offset?: { x: number; y: number }) => void;
  canCopy: boolean; // Whether something is selected to copy
  canPaste: boolean; // Whether there's something in clipboard to paste
  // ...existing code...
  addElement: (element: Element, parentId?: string) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<Element>) => void;
  updateCourse: (updates: Partial<Course>) => void;
  moveElement: (elementId: string, targetParentId?: string, index?: number) => void;
  reorderElement: (elementId: string, direction: 'up' | 'down') => void;
  selectElement: (elementId: string | null, multiSelect?: boolean) => void; // Updated with multiSelect
  setDraggedElement: (element: Element | null) => void;  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  togglePropertyPanel: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Storage methods
  saveProject: () => void;
  loadProject: (id: string) => void;
  createNewProject: (title?: string, type?: 'Academico' | 'Evaluativo') => void;
  exportProject: () => string;
  importProject: (jsonData: string) => void;
}

export interface BuilderState {
  elements: Element[];
  selectedElementId: string | null;
  selectedElementIds: string[]; // New: multiple selection support
  draggedElement: Element | null;
  clipboard: Element[]; // Copied elements
  history: Element[][];
  historyIndex: number;
  sidebarVisible: boolean;
  sidebarWidth: number;
  propertyPanelVisible: boolean;
  course: Course | null;
  currentPage: Page | null;
  previewMode: boolean;
  currentSlideIndex: number;
  textElementTab: 'basic' | 'styling' | 'templates' | null; // null means use default
  resizeState: {
    elementId: string | null;
    dimensions: { width: number; height: number } | null;
    isResizing: boolean;
  };
}

export type BuilderAction =
  | { type: 'ADD_ELEMENT'; payload: { element: Element; parentId?: string } }
  | { type: 'REMOVE_ELEMENT'; payload: { elementId: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { elementId: string; updates: Partial<Element> } }
  | { type: 'UPDATE_COURSE'; payload: { updates: Partial<Course> } }
  | { type: 'MOVE_ELEMENT'; payload: { elementId: string; targetParentId?: string; index?: number } }
  | { type: 'REORDER_ELEMENT'; payload: { elementId: string; direction: 'up' | 'down' } }
  | { type: 'SELECT_ELEMENT'; payload: { elementId: string | null; multiSelect?: boolean } }
  | { type: 'SET_DRAGGED_ELEMENT'; payload: { element: Element | null } }
  | { type: 'SET_RESIZE_STATE'; payload: { elementId: string | null; dimensions: { width: number; height: number } | null; isResizing: boolean } }
  | { type: 'SET_TEXT_ELEMENT_TAB'; payload: { tab: 'basic' | 'styling' | 'templates' | null } }
  // Copy/Paste actions
  | { type: 'COPY_ELEMENTS'; payload: { elementIds: string[] } }
  | { type: 'PASTE_ELEMENTS'; payload: { parentId?: string; offset?: { x: number; y: number } } }
  // Page actions
  | { type: 'ADD_PAGE'; payload: { page: Page } }
  | { type: 'REMOVE_PAGE'; payload: { pageId: string } }
  | { type: 'UPDATE_PAGE'; payload: { pageId: string; updates: Partial<Page> } }
  | { type: 'SWITCH_PAGE'; payload: { pageId: string } }
  | { type: 'REORDER_PAGES'; payload: { pageIds: string[] } }
  // Preview actions
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_SLIDE_INDEX'; payload: { index: number } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: { width: number } }
  | { type: 'TOGGLE_PROPERTY_PANEL' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_COURSE'; payload: { course: Course } }
  | { type: 'LOAD_PROJECT'; payload: { course: Course; elements: Element[] } }
  | { type: 'RESET_PROJECT' };
