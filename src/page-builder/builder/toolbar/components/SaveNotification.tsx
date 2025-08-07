import React from 'react';

interface SaveNotificationProps {
  show: boolean;
}

/**
 * Save notification component
 */
export const SaveNotification: React.FC<SaveNotificationProps> = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg" style={{ zIndex: 100002 }}>
      ✅ Proyecto guardado
    </div>
  );
};
