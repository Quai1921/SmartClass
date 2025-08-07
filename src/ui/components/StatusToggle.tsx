import React, { useState } from 'react';

interface StatusToggleProps {
  status: string;
  onToggle: (newStatus: string) => Promise<void>;
  disabled?: boolean;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({ 
  status, 
  onToggle, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    const previousStatus = currentStatus;
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    setIsLoading(true);
    setCurrentStatus(newStatus); // Optimistic update

    try {
      await onToggle(newStatus);
      // If successful, keep the new status
    } catch {
      // If error, revert to previous status
      setCurrentStatus(previousStatus);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (state: string, loading: boolean) => {
    if (loading) {
      return {
        label: 'Cambiando...',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-500',
        dotColor: 'bg-gray-400',
        cursor: 'cursor-not-allowed'
      };
    }

    switch (state) {
      case 'ACTIVE':
        return {
          label: 'Activo',
          bgColor: 'bg-[#ECFDF3]',
          textColor: 'text-[#037847]',
          dotColor: 'bg-[#14BA6D]',
          cursor: 'cursor-pointer hover:bg-[#D1FAE5]'
        };
      case 'INACTIVE':
        return {
          label: 'Inactivo',
          bgColor: 'bg-[#F2F4F7]',
          textColor: 'text-[#364254]',
          dotColor: 'bg-gray-500',
          cursor: 'cursor-pointer hover:bg-gray-200'
        };
      default:
        return {
          label: 'Pendiente',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500',
          cursor: 'cursor-pointer hover:bg-yellow-200'
        };
    }
  };

  const config = getStatusConfig(currentStatus, isLoading);
  return (
    <span
      onClick={handleToggle}
      className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium transition-all min-w-[80px] ${config.bgColor} ${config.textColor} ${config.cursor}`}
      title={isLoading ? 'Actualizando estado...' : 'Clic para cambiar estado'}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};
