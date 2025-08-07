import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';

// Types
interface Item {
  id: string;
  label: string;
}

type AreaId = 'palette' | 'area1' | 'area2';

type Locations = {
  [key in AreaId]: string[];
};

// Minimal Draggable Item
function DraggableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '8px 16px',
        margin: '4px',
        background: isDragging ? '#bae6fd' : '#f1f5f9',
        border: '1px solid #94a3b8',
        borderRadius: 6,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}

// Minimal Droppable Area
function DroppableArea({ id, items, children }: { id: AreaId; items: Item[]; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 80,
        minWidth: 180,
        background: isOver ? '#dbeafe' : '#e5e7eb',
        border: '2px dashed #60a5fa',
        borderRadius: 8,
        padding: 12,
        margin: 8,
        transition: 'background 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{children}</div>
      {items.length === 0 && <div style={{ color: '#94a3b8', fontSize: 13 }}>Drop items here</div>}
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id}>{item.label}</DraggableItem>
      ))}
    </div>
  );
}

// Main Demo Component
export default function DragAndDropDemo() {
  // Initial items in the palette
  const initialItems: Item[] = [
    { id: 'item-1', label: 'Item 1' },
    { id: 'item-2', label: 'Item 2' },
    { id: 'item-3', label: 'Item 3' },
  ];
  // State: where each item is (palette, area1, area2)
  const [locations, setLocations] = useState<Locations>({
    palette: initialItems.map((item) => item.id),
    area1: [],
    area2: [],
  });

  // Helper to get item data by id
  const getItem = (id: string): Item | undefined => initialItems.find((item) => item.id === id);

  // Helper to get items for an area
  const getItemsForArea = (area: AreaId): Item[] => locations[area].map((id) => getItem(id)!).filter(Boolean);

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const fromArea = (Object.keys(locations) as AreaId[]).find((area) => locations[area].includes(activeId));
    const toArea = overId as AreaId;
    if (!fromArea || !toArea || fromArea === toArea) return;
    setLocations((prev) => {
      const newLoc = { ...prev };
      newLoc[fromArea] = newLoc[fromArea].filter((id) => id !== activeId);
      newLoc[toArea] = [...newLoc[toArea], activeId];
      return newLoc;
    });
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Minimal Drag and Drop Demo (dnd-kit)</h2>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 32 }}>
          <DroppableArea id="palette" items={getItemsForArea('palette')}>
            Palette
          </DroppableArea>
          <DroppableArea id="area1" items={getItemsForArea('area1')}>
            Area 1
          </DroppableArea>
          <DroppableArea id="area2" items={getItemsForArea('area2')}>
            Area 2
          </DroppableArea>
        </div>
      </DndContext>
    </div>
  );
} 