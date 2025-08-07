import React from 'react';
import { useDndContext } from '@dnd-kit/core';

export const DragDebugInfo: React.FC = () => {
  const { active, over } = useDndContext();
  
  if (!active) return null;
  
  return (
    <div 
      className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm z-[100000]"
      style={{ pointerEvents: 'none' }}
    >
      <div className="font-bold text-green-400 mb-2">🎯 Drag Debug Info</div>
      <div><strong>Active ID:</strong> {active.id}</div>
      <div><strong>Active Type:</strong> {active.data?.current?.type || 'unknown'}</div>
      <div><strong>Drag Source:</strong> {active.data?.current?.dragSource || 'unknown'}</div>
      {over && (
        <>
          <div className="mt-2 font-bold text-blue-400">Drop Target:</div>
          <div><strong>Over ID:</strong> {over.id}</div>
          <div><strong>Over Type:</strong> {over.data?.current?.type || 'unknown'}</div>
          <div><strong>Over Element:</strong> {over.data?.current?.elementId || 'none'}</div>
        </>
      )}
      {!over && (
        <div className="mt-2 text-red-400">❌ No drop target detected</div>
      )}
    </div>
  );
};
