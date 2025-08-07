import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectDropdownProps {
    label: string;
    placeholder?: string;
    options: Option[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    placeholder = "Seleccionar...",
    options,
    selectedValues,
    onSelectionChange,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const availableOptions = useMemo(() => {
        return options.filter(option => !selectedValues.includes(option.value));
    }, [options, selectedValues]);

    const selectedOptions = useMemo(() => {
        return options.filter(option => selectedValues.includes(option.value));
    }, [options, selectedValues]);

    const handleSelect = useCallback((value: string) => {
        if (!selectedValues.includes(value)) {
            onSelectionChange([...selectedValues, value]);
        }
        setIsOpen(false);
    }, [selectedValues, onSelectionChange]);

    const handleRemove = useCallback((value: string) => {
        onSelectionChange(selectedValues.filter(v => v !== value));
    }, [selectedValues, onSelectionChange]);

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            {/* Selected items */}
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedOptions.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                        >
                            <span>{option.label}</span>
                            <button
                                onClick={() => handleRemove(option.value)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                    <span className="text-gray-500">
                        {selectedOptions.length > 0 
                            ? `${selectedOptions.length} seleccionado(s)`
                            : placeholder
                        }
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {availableOptions.length > 0 ? (
                            availableOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                >
                                    {option.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                                Todas las opciones seleccionadas
                            </div>
                        )}
                        
                        {/* Close dropdown button */}
                        <div className="border-t border-gray-200 p-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
