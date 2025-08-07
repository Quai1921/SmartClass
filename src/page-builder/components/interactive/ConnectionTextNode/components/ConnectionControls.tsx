import React from 'react';
import { X } from 'lucide-react';

interface ConnectionControlsProps {
  isConnected: boolean;
  isPreviewMode: boolean;
  allowRetry?: boolean;
  onReset: () => void;
}

export const ConnectionControls: React.FC<ConnectionControlsProps> = ({
  isConnected,
  isPreviewMode,
  allowRetry = true,
  onReset
}) => {
  if (!isConnected || isPreviewMode || allowRetry === false) {
    return null;
  }

  return (
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
  );
}; 