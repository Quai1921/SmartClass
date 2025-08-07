import { v4 as uuidv4 } from 'uuid';
import type { Element } from '../types';
import { generateElementName } from './elementNaming';

/**
 * Deep clone an element with a new ID and name
 * This preserves all properties but generates new IDs for the element and its children
 */
export function cloneElement(element: Element, parentId?: string, offset?: { x: number; y: number }): Element {
  const newElement: Element = {
    ...element,
    id: uuidv4(),
    name: generateElementName(element.type),
    parentId: parentId || element.parentId,
    properties: {
      ...element.properties,
      // Apply position offset if provided and element has absolute positioning
      ...(offset && element.properties.position === 'absolute' && {
        left: (element.properties.left || 0) + offset.x,
        top: (element.properties.top || 0) + offset.y,
      })
    },
    children: element.children?.map(child => cloneElement(child, undefined, offset))
  };

  return newElement;
}

/**
 * Clone multiple elements with new IDs
 */
export function cloneElements(elements: Element[], parentId?: string, offset?: { x: number; y: number }): Element[] {
  return elements.map(element => cloneElement(element, parentId, offset));
}

/**
 * Find elements by their IDs
 */
export function findElementsByIds(elements: Element[], elementIds: string[]): Element[] {
  const foundElements: Element[] = [];
  
  function findElement(element: Element) {
    if (elementIds.includes(element.id)) {
      foundElements.push(element);
    }
    
    // Recursively search in children
    if (element.children) {
      element.children.forEach(findElement);
    }
  }
  
  elements.forEach(findElement);
  return foundElements;
}

/**
 * Get all children elements of a given element
 */
export function getAllChildElements(element: Element): Element[] {
  const children: Element[] = [];
  
  if (element.children) {
    element.children.forEach(child => {
      children.push(child);
      children.push(...getAllChildElements(child));
    });
  }
  
  return children;
}

/**
 * Check if elements can be copied (basic validation)
 */
export function canCopyElements(elements: Element[]): boolean {
  return elements.length > 0;
}

/**
 * Check if elements can be pasted in a given context
 */
export function canPasteElements(clipboard: Element[], _targetParentId?: string): boolean {
  return clipboard.length > 0;
}
