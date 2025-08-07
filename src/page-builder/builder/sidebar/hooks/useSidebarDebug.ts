import { useRef, useEffect } from 'react';

// Performance tracking for Sidebar
let sidebarRenderCount = 0;
let lastSidebarRenderTime = Date.now();

export const useSidebarDebug = (hasContainers: boolean) => {
  const renderCountRef = useRef(0);

  useEffect(() => {
    // Track Sidebar re-renders
    sidebarRenderCount++;
    renderCountRef.current++;
    
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastSidebarRenderTime;
    lastSidebarRenderTime = currentTime;
    
  });

  return {
    renderCount: renderCountRef.current
  };
};
