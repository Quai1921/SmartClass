import { pointerWithin, rectIntersection } from '@dnd-kit/core';
import type { CollisionDetection, ClientRect } from '@dnd-kit/core';
import type { Element } from '../types';

/**
 * Collision detection prioritizing nested intersecting containers over pointer hits
 */
export const createBoundaryCollisionDetection = (
  _elements: Element[],
  _getElementRect: (elementId: string) => ClientRect | null,
  _onBoundaryHit?: (parentName: string, constraintType: 'horizontal' | 'vertical' | 'both') => void,
  _dragSource?: 'handle' | 'body' | 'sidebar'
): CollisionDetection => {
  return (args) => {
    const { active } = args;
    const id = active.id.toString();
    
    // Filter helper to prioritize only valid drop zones (container, grid-cell, canvas, drag-drop-widget)
    const prioritizeZones = (list: typeof intersections) => {
      return list.filter(intersection => {
        const t = intersection.data?.current?.type;
        return t === 'container' || t === 'grid-cell' || t === 'canvas' || t === 'drag-drop-widget';
      });
    };

    // New side-bar elements use pointerWithin but prioritize containers over child elements
    if (id.startsWith('new-')) {
      const intersections = pointerWithin(args);
      const zones = prioritizeZones(intersections);
      return zones.length > 0 ? zones : intersections;
    }

    // Use pointerWithin primarily for accurate pointer drop detection regardless of element transform
    const intersections = pointerWithin(args);
    const zones = prioritizeZones(intersections);
    if (zones.length > 0) return zones;

    // Fall back to rectIntersection using overlay rectangles for backup detection
    let rectIntersections = rectIntersection(args);
    // Remove self intersection (dragged element itself)
    const stripPrefixes = (prefixedId: string): string => {
      if (prefixedId.startsWith('child-container-')) {
        return prefixedId.replace('child-container-', '');
      }
      if (prefixedId.startsWith('container-handle-')) {
        return prefixedId.replace('container-handle-', '');
      }
      return prefixedId;
    };

    const strippedId = stripPrefixes(id);

    rectIntersections = rectIntersections.filter(inter => {
      const droppableId = inter.id.toString();
      return droppableId !== id && droppableId !== strippedId;
    });
    const rectPrioritized = prioritizeZones(rectIntersections);
    if (rectPrioritized.length > 0) return rectPrioritized;

    if (rectIntersections.length > 0) return rectIntersections;

    return intersections;
  };
};
