import React from 'react';

export const ConnectionStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Force zero padding for image containers */
        [data-image-container="true"] {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        [data-image-container="true"] > div {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* TARGET THE CULPRIT: Resizable container override */
        .resizable-container [data-image-container="true"] {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .resizable-container .connection-node {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* AGGRESSIVE: Override resizable container itself when it has image children */
        .resizable-container:has([data-image-container="true"]) {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* NUCLEAR: Force all resizable containers with images to have zero padding */
        .resizable-container.container {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Target by element attribute combination */
        div.resizable-container.container [data-node-type="image"] {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Override any potential box model issues */
        .resizable-container * {
          box-sizing: border-box !important;
        }
        
        /* Negative margin approach to counteract padding */
        .resizable-container [data-image-container="true"] {
          margin: -16px !important;
          padding: 0 !important;
          width: calc(100% + 32px) !important;
          height: calc(100% + 32px) !important;
          position: absolute !important;
          top: -16px !important;
          left: -16px !important;
        }
        
        /* Even more specific - target by data attributes */
        div[data-node-type="image"][data-image-container="true"] {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Target all children */
        [data-image-container="true"] * {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
      `
    }} />
  );
}; 