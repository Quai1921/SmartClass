import React from 'react';

export const ConnectionStyles: React.FC = () => {
  return (
    <>
      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
          }
          
          @keyframes successPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
          
          @keyframes errorPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          
          @keyframes fadeInScale {
            0% { 
              opacity: 0; 
              transform: translateX(-50%) scale(0.8); 
            }
            100% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1); 
            }
          }
          
          @keyframes targetPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          
          .connection-image-success {
            animation: successPulse 0.6s ease-out;
            border: 2px solid #22c55e !important;
            background-color: rgba(34, 197, 94, 0.1) !important;
          }
          
          .connection-image-error {
            animation: errorPulse 0.6s ease-out;
            border: 2px solid #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
          }
        `}
      </style>
      
      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes targetPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `
      }} />
    </>
  );
}; 