import React, { useEffect, useState } from 'react';

// 🔍 DEBUG: Performance monitoring component
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    renderCount: 0,
    lastRenderTime: Date.now(),
    avgRenderTime: 0
  });

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let renderTimes: number[] = [];
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;
      
      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Calculate average render time
        const avgRenderTime = renderTimes.length > 0 
          ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
          : 0;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          avgRenderTime: Math.round(avgRenderTime * 100) / 100
        }));
        
        // Reset render times array
        renderTimes = [];
      }
      
      requestAnimationFrame(measurePerformance);
    };
    
    requestAnimationFrame(measurePerformance);
    
    // Track render events
    const originalLog = console.log;
    console.log = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('render #')) {
        const renderTime = performance.now();
        renderTimes.push(renderTime - metrics.lastRenderTime);
        setMetrics(prev => ({
          ...prev,
          renderCount: prev.renderCount + 1,
          lastRenderTime: renderTime
        }));
      }
      originalLog.apply(console, args);
    };
    
    return () => {
      console.log = originalLog;
    };
  }, []);
  
  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
        Press Ctrl+Shift+P for debug
      </div>
    );
  }
  
  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg font-mono text-xs z-[10000] border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-blue-400">🔍 Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {metrics.fps}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Total Renders:</span>
          <span className="text-blue-400">{metrics.renderCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg Render Time:</span>
          <span className={metrics.avgRenderTime < 16 ? 'text-green-400' : 'text-yellow-400'}>
            {metrics.avgRenderTime}ms
          </span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
          <div>Good FPS: ≥55 (Green)</div>
          <div>OK FPS: 30-54 (Yellow)</div>
          <div>Poor FPS: &lt;30 (Red)</div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
          <div>Watch console for detailed logs</div>
        </div>
      </div>
    </div>
  );
};
