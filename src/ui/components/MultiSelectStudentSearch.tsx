import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ChevronDown, X, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStudentsForSelection, type StudentForSelection } from '../../actions/student/get-students-for-selection';

interface MultiSelectStudentSearchProps {
    label: string;
    placeholder?: string;
    selectedStudents: StudentForSelection[];
    onSelectionChange: (students: StudentForSelection[]) => void;
    className?: string;
}

export const MultiSelectStudentSearch: React.FC<MultiSelectStudentSearchProps> = ({
    label,
    placeholder = "Seleccionar estudiantes...",
    selectedStudents,
    onSelectionChange,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: students = [], isLoading } = useQuery({
        queryKey: ['students-selection'],
        queryFn: () => getStudentsForSelection(undefined, 20),
        enabled: isOpen,
    });

    const filteredStudents = useMemo(() => {
        return students.filter((student: StudentForSelection) => 
            !selectedStudents.some(selected => selected.id === student.id)
        );
    }, [students, selectedStudents]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectStudent = useCallback((student: StudentForSelection) => {
        onSelectionChange([...selectedStudents, student]);
    }, [selectedStudents, onSelectionChange]);

    const handleRemoveStudent = useCallback((studentId: string) => {
        onSelectionChange(selectedStudents.filter(student => student.id !== studentId));
    }, [selectedStudents, onSelectionChange]);    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            {/* Selected students */}
            {selectedStudents.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedStudents.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                        >
                            <User className="w-3 h-3" />
                            <span>{student.fullName}</span>
                            <span className="text-xs opacity-75">({student.studentCode})</span>
                            <button
                                onClick={() => handleRemoveStudent(student.id)}
                                className="text-green-600 hover:text-green-800"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <div 
                className="relative w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                            {placeholder}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <span className="mt-2 block text-sm">Cargando estudiantes...</span>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student: StudentForSelection) => (
                            <div
                                key={student.id}
                                onClick={() => handleSelectStudent(student)}
                                className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">
                                            {student.fullName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {student.studentCode} • {student.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            No se encontraron estudiantes
                        </div>
                    )}
                    
                    {/* Cerrar option */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-center text-gray-500 hover:bg-gray-50 cursor-pointer border-t border-gray-200 bg-gray-50"
                    >
                        Cerrar
                    </div>
                </div>
            )}
        </div>
    );
};
