import React, { useEffect, useState, useRef } from 'react';
import { useBuilder } from '../hooks/useBuilder';

interface ConnectionLine {
  id: string;
  startNodeId: string;
  endNodeId: string;
  groupId: string;
  color: string;
  width: number;
}

export const ConnectionLineManager: React.FC = () => {
  const { elements } = useBuilder();
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<ConnectionLine[]>([]);
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());

  // Update node positions and connections
  useEffect(() => {
    const updatePositions = () => {
      const newPositions = new Map();
      const newConnections: ConnectionLine[] = [];

      // Find all connection nodes
      const connectionNodes = elements.filter(el => 
        el.type === 'connection-text-node' || el.type === 'connection-image-node'
      );

      // Update positions for all connection nodes
      connectionNodes.forEach(node => {
        const nodeElement = document.querySelector(`[data-element-id="${node.id}"]`);
        if (nodeElement) {
          const rect = nodeElement.getBoundingClientRect();
          const canvasElement = document.querySelector('.canvas-container');
          const canvasRect = canvasElement?.getBoundingClientRect();
          
          if (canvasRect) {
            newPositions.set(node.id, {
              x: rect.left - canvasRect.left + rect.width / 2,
              y: rect.top - canvasRect.top + rect.height / 2,
              width: rect.width,
              height: rect.height
            });
          }
        }
      });

      // Find connected pairs
      connectionNodes.forEach(node => {
        if (node.properties.connectionState === 'connected' && node.properties.connectedNodeId) {
          const connectedNode = elements.find(el => el.id === node.properties.connectedNodeId);
          if (connectedNode && newPositions.has(node.id) && newPositions.has(connectedNode.id)) {
            // Only add the connection once (from text node to image node)
            if (node.type === 'connection-text-node') {
              newConnections.push({
                id: `${node.id}-${connectedNode.id}`,
                startNodeId: node.id,
                endNodeId: connectedNode.id,
                groupId: node.properties.connectionGroupId || '',
                color: node.properties.lineColor || '#3b82f6',
                width: node.properties.lineWidth || 3
              });
            }
          }
        }
      });

      setNodePositions(newPositions);
      setConnections(newConnections);
      
      // Debug logging
      if (newConnections.length > 0) {
      }
    };

    // Initial update
    updatePositions();

    // Update on element changes
    const handleElementUpdate = () => {
      setTimeout(updatePositions, 50); // Small delay to allow DOM updates
    };

    // Update on window resize or scroll
    const handleResize = () => {
      setTimeout(updatePositions, 100);
    };

    // Listen for various events that might change positions
    window.addEventListener('elementResized', handleElementUpdate);
    window.addEventListener('elementUpdated', handleElementUpdate);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    // Set up a ResizeObserver for the canvas
    const canvasElement = document.querySelector('.canvas-container');
    let resizeObserver: ResizeObserver | null = null;
    
    if (canvasElement) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvasElement);
    }

    // Periodic updates for dynamic content
    const interval = setInterval(updatePositions, 1000);

    return () => {
      window.removeEventListener('elementResized', handleElementUpdate);
      window.removeEventListener('elementUpdated', handleElementUpdate);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearInterval(interval);
    };
  }, [elements]);

  if (connections.length === 0) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
        backgroundColor: connections.length > 0 ? 'rgba(255, 255, 0, 0.1)' : 'transparent' // Debug: yellow tint when connections exist
      }}
    >
      {/* Debug info */}
      {connections.length > 0 && (
        <text x="20" y="30" fill="red" fontSize="14" fontWeight="bold">
          🔗 {connections.length} connection(s) active
        </text>
      )}
      
      {connections.map(connection => {
        const startPos = nodePositions.get(connection.startNodeId);
        const endPos = nodePositions.get(connection.endNodeId);

        if (!startPos || !endPos) return null;

        return (
          <g key={connection.id}>
            {/* Debug: Draw a thick red line first */}
            <line
              x1={startPos.x}
              y1={startPos.y}
              x2={endPos.x}
              y2={endPos.y}
              stroke="red"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            
            {/* Main connection line */}
            <line
              x1={startPos.x}
              y1={startPos.y}
              x2={endPos.x}
              y2={endPos.y}
              stroke={connection.color}
              strokeWidth={Math.max(connection.width, 4)} // Ensure minimum width of 4
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }}
            />
            
            {/* Animated flow indicator */}
            <circle
              r="6"
              fill="orange"
              style={{
                opacity: 1
              }}
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={`M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`}
              />
            </circle>

            {/* Connection points - make them bigger */}
            <circle
              cx={startPos.x}
              cy={startPos.y}
              r="8"
              fill={connection.color}
              stroke="white"
              strokeWidth="2"
              style={{
                opacity: 0.9
              }}
            />
            <circle
              cx={endPos.x}
              cy={endPos.y}
              r="8"
              fill={connection.color}
              stroke="white"
              strokeWidth="2"
              style={{
                opacity: 0.9
              }}
            />
            
            {/* Debug: Show connection info */}
            <text 
              x={Math.min(startPos.x, endPos.x)} 
              y={Math.min(startPos.y, endPos.y) - 10} 
              fill="blue" 
              fontSize="12"
              fontWeight="bold"
            >
              Connection: {connection.id.substring(0, 8)}...
            </text>
          </g>
        );
      })}
    </svg>
  );
};
