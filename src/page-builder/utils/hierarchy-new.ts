import React from 'react';
import { 
  Package, 
  Type, 
  AlignLeft, 
  BookOpen, 
  Image as ImageIcon, 
  Video,
  AudioWaveform, 
  MousePointerClick 
} from 'lucide-react';
import type { Element } from '../types';

export interface HierarchyNode {
  element: Element;
  children: HierarchyNode[];
  depth: number;
  isVisible: boolean;
  isExpanded: boolean;
}

/**
 * Build hierarchical structure from flat elements array
 */
export function buildHierarchy(elements: Element[]): HierarchyNode[] {
  // First, find all root elements (elements without parentId)
  const rootElements = elements.filter(el => !el.parentId);
  
  // Recursively build the tree
  return rootElements.map(element => buildNode(element, elements, 0));
}

/**
 * Build a single node with its children
 */
function buildNode(element: Element, allElements: Element[], depth: number): HierarchyNode {
  // Find direct children of this element
  const children = allElements
    .filter(el => el.parentId === element.id)
    .map(child => buildNode(child, allElements, depth + 1));

  return {
    element,
    children,
    depth,
    isVisible: true,
    isExpanded: element.type === 'container', // Auto-expand all containers by default
  };
}

/**
 * Find a node in the hierarchy by element ID
 */
export function findNodeById(nodes: HierarchyNode[], elementId: string): HierarchyNode | null {
  for (const node of nodes) {
    if (node.element.id === elementId) {
      return node;
    }
    
    const found = findNodeById(node.children, elementId);
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Toggle expanded state of a node
 */
export function toggleNodeExpanded(nodes: HierarchyNode[], elementId: string): HierarchyNode[] {
  return nodes.map(node => {
    if (node.element.id === elementId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    
    return {
      ...node,
      children: toggleNodeExpanded(node.children, elementId)
    };
  });
}

/**
 * Get all visible nodes (flattened for rendering)
 */
export function getVisibleNodes(nodes: HierarchyNode[]): HierarchyNode[] {
  const result: HierarchyNode[] = [];
  
  function traverse(nodeList: HierarchyNode[]) {
    for (const node of nodeList) {
      if (node.isVisible) {
        result.push(node);
        
        // Only traverse children if node is expanded
        if (node.isExpanded && node.children.length > 0) {
          traverse(node.children);
        }
      }
    }
  }
  
  traverse(nodes);
  return result;
}

/**
 * Update visibility of nodes based on search filter
 */
export function filterNodes(nodes: HierarchyNode[], searchTerm: string): HierarchyNode[] {
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) {
    // No filter - show all nodes
    return nodes.map(node => ({
      ...node,
      isVisible: true,
      children: filterNodes(node.children, searchTerm)
    }));
  }
  
  function nodeMatches(node: HierarchyNode): boolean {
    const elementName = node.element.name.toLowerCase();
    const elementType = node.element.type.toLowerCase();
    return elementName.includes(term) || elementType.includes(term);
  }
  
  function hasMatchingChild(node: HierarchyNode): boolean {
    return node.children.some(child => 
      nodeMatches(child) || hasMatchingChild(child)
    );
  }
  
  return nodes.map(node => {
    const matches = nodeMatches(node);
    const hasMatchingChildren = hasMatchingChild(node);
    const shouldShow = matches || hasMatchingChildren;
    
    return {
      ...node,
      isVisible: shouldShow,
      isExpanded: shouldShow && hasMatchingChildren, // Auto-expand if has matching children
      children: filterNodes(node.children, searchTerm)
    };
  });
}

/**
 * Get the icon component for an element type (same as sidebar)
 */
export function getElementIcon(type: string): React.ReactNode {
  const iconProps = { size: 16, strokeWidth: 2.5, className: "text-current" };
  
  switch (type) {
    case 'container':
      return React.createElement(Package, iconProps);
    case 'heading':
      return React.createElement(Type, iconProps);
    case 'paragraph':
      return React.createElement(AlignLeft, iconProps);
    case 'quote':
      return React.createElement(BookOpen, iconProps);
    case 'image':
      return React.createElement(ImageIcon, iconProps);
    case 'video':
      return React.createElement(Video, iconProps);
    case 'audio':
      return React.createElement(AudioWaveform, iconProps);
    case 'button':
      return React.createElement(MousePointerClick, iconProps);
    default:
      return React.createElement(Package, { ...iconProps, className: "text-gray-400" });
  }
}
