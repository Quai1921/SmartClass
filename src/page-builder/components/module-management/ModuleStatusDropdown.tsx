import React, { useState } from 'react';
import { ChevronDown, Check, Clock, Eye, AlertCircle } from 'lucide-react';

interface ModuleStatusDropdownProps {
  currentStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  onStatusChange: (newStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const statusConfig = {
  DRAFT: {
    label: 'Borrador',
    color: 'bg-gray-500',
    textColor: 'text-gray-100',
    icon: Clock,
    hoverColor: 'hover:bg-gray-600'
  },
  IN_REVIEW: {
    label: 'En Revisión',
    color: 'bg-orange-500',
    textColor: 'text-orange-100',
    icon: AlertCircle,
    hoverColor: 'hover:bg-orange-600'
  },
  PUBLISHED: {
    label: 'Publicado',
    color: 'bg-green-500',
    textColor: 'text-green-100',
    icon: Eye,
    hoverColor: 'hover:bg-green-600'
  }
};

export const ModuleStatusDropdown: React.FC<ModuleStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent click handlers
          setIsOpen(!isOpen);
        }}
        disabled={disabled || isLoading}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
          disabled || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : `${currentConfig.color} ${currentConfig.textColor} ${currentConfig.hoverColor}`
        }`}
      >
        <CurrentIcon className="w-3 h-3" />
        <span>{currentConfig.label}</span>
        {!disabled && !isLoading && (
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !disabled && !isLoading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const isSelected = status === currentStatus;
              
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent click handlers
                    handleStatusSelect(status as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW');
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-xs hover:bg-gray-700 transition-colors ${
                    isSelected ? 'bg-gray-700' : ''
                  }`}
                >
                  <Icon className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-200">{config.label}</span>
                  {isSelected && (
                    <Check className="w-3 h-3 text-green-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
