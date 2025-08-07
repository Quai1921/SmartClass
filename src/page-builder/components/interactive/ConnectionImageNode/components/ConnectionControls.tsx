import React from 'react';
import { X } from 'lucide-react';

interface ConnectionControlsProps {
  isConnected: boolean;
  isPreviewMode: boolean;
  allowRetry?: boolean;
  onReset: () => void;
  element: any;
  elements: any[];
  properties: any;
}

export const ConnectionControls: React.FC<ConnectionControlsProps> = ({
  isConnected,
  isPreviewMode,
  allowRetry,
  onReset,
  element,
  elements,
  properties
}) => {
  return (
    <>
      {/* Connection Status Indicator */}
      {(() => {
        if (!isConnected || properties?.showConectadoMessage !== true) return false;
        // Find paired node
        const pairedNode = elements.find(el =>
          el.id !== element.id &&
          (el.type === 'connection-text-node' || el.type === 'connection-image-node') &&
          (el.properties as any)?.connectionGroupId === properties?.connectionGroupId
        );
        const pairedId = pairedNode?.id;
        const myConnectedId = properties?.connectedNodeId;
        const pairedConnectedId = pairedNode ? ((pairedNode.properties as any)?.connectedNodeId) : null;
        return myConnectedId === pairedId && pairedConnectedId === element.id;
      })() && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow z-10 select-none pointer-events-none">
          conectado
        </div>
      )}

      {/* Reset Button */}
      {isConnected && !isPreviewMode && allowRetry !== false && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#6b7280',
            pointerEvents: 'auto' // Re-enable pointer events for buttons
          }}
        >
          <X size={12} />
        </button>
      )}
    </>
  );
}; 