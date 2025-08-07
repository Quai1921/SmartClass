import React, { useState, useRef, useCallback } from 'react';

interface ResizeTestProps {}

export const ResizeTestComponent: React.FC<ResizeTestProps> = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const elementRef = useRef<HTMLDivElement>(null);
  const resizeDataRef = useRef<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!elementRef.current) return;
    
    addLog(`🎯 Mouse down on ${handle} handle`);
    
    const rect = elementRef.current.getBoundingClientRect();
    
    resizeDataRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      moved: false,
    };
    
    setIsResizing(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeDataRef.current) return;
      
      const deltaX = e.clientX - resizeDataRef.current.startX;
      const deltaY = e.clientY - resizeDataRef.current.startY;
      const threshold = 3;
      
      addLog(`📏 Move: dx=${deltaX.toFixed(1)}, dy=${deltaY.toFixed(1)}, moved=${resizeDataRef.current.moved}`);
      
      if (!resizeDataRef.current.moved && (Math.abs(deltaX) >= threshold || Math.abs(deltaY) >= threshold)) {
        resizeDataRef.current.moved = true;
        addLog(`✅ Threshold exceeded - starting resize`);
      }
      
      if (resizeDataRef.current.moved) {
        let newWidth = resizeDataRef.current.startWidth;
        let newHeight = resizeDataRef.current.startHeight;
        
        if (handle.includes('e')) {
          newWidth = resizeDataRef.current.startWidth + deltaX;
        }
        if (handle.includes('s')) {
          newHeight = resizeDataRef.current.startHeight + deltaY;
        }
        
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(30, newHeight);
        
        setDimensions({ width: newWidth, height: newHeight });
        addLog(`🔧 Applied resize: ${newWidth.toFixed(1)}x${newHeight.toFixed(1)}`);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      addLog(`🏁 Mouse up - moved: ${resizeDataRef.current?.moved || false}`);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      setIsResizing(false);
      resizeDataRef.current = null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>Resize Handle Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={clearLogs}>Clear Logs</button>
      </div>
      
      <div 
        ref={elementRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          backgroundColor: '#f0f0f0',
          border: '2px solid #333',
          position: 'relative',
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        Test Element ({dimensions.width}x{dimensions.height})
        
        {/* Resize handle */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 'se')}
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            backgroundColor: isResizing ? 'red' : 'blue',
            cursor: 'nwse-resize',
            border: '1px solid white',
          }}
        />
      </div>
      
      <div style={{ maxHeight: '200px', overflow: 'auto', fontSize: '12px', backgroundColor: '#222', color: '#0f0', padding: '10px' }}>
        <div><strong>Event Log:</strong></div>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        <div>Current: {dimensions.width}x{dimensions.height}</div>
        <div>Resizing: {isResizing ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}; 