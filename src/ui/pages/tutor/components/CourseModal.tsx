import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '../../../../actions/courses/create-course';
import { updateCourse } from '../../../../actions/courses/update-course';
import { useNotificationStore } from '../../../store/notification/useNotificationStore';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    courseData?: any;
}

export const CourseModal = ({ isOpen, onClose, mode, courseData }: CourseModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        grade: '',
        group: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
        banner: null as File | null,
    });

    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: ({ data, file }: { data: any; file?: File }) => createCourse(data, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            addNotification({
                message: 'Curso creado exitosamente',
                type: 'message',
                position: 'top',
                duration: 3000
            });
            onClose();
            resetForm();
        },
        onError: (error: Error) => {
            addNotification({
                message: error.message || 'Error al crear el curso',
                type: 'error',
                position: 'top',
                duration: 3000
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCourse(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            addNotification({
                message: 'Curso actualizado exitosamente',
                type: 'message',
                position: 'top',
                duration: 3000
            });
            onClose();
            resetForm();
        },
        onError: (error: Error) => {
            addNotification({
                message: error.message || 'Error al actualizar el curso',
                type: 'error',
                position: 'top',
                duration: 3000
            });
        }
    });

    useEffect(() => {
        if (mode === 'edit' && courseData) {
            setFormData({
                title: courseData.title || '',
                description: courseData.description || '',
                subject: courseData.subject || '',
                grade: courseData.grade || '',
                group: courseData.group || '',
                status: courseData.status || 'DRAFT',
                banner: null,
            });
        }
    }, [mode, courseData]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            subject: '',
            grade: '',
            group: '',
            status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
            banner: null,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prepare data for API (exclude File object, include banner as string if needed)
        const apiData = {
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            grade: formData.grade,
            status: formData.status,
            banner: undefined, // Handle file upload separately if needed
        };
        
        if (mode === 'create') {
            createMutation.mutate({ 
                data: apiData, 
                file: formData.banner || undefined 
            });
        } else if (mode === 'edit' && courseData) {
            updateMutation.mutate({ id: courseData.id, data: apiData });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, banner: file }));
    };

    if (!isOpen) return null;

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'create' ? 'Crear Nuevo Curso' : 'Editar Curso'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del curso *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Matemáticas Básicas"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe el contenido y objetivos del curso..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Materia *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Matemáticas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grado *
                                </label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grupo
                                </label>
                                <input
                                    type="text"
                                    name="group"
                                    value={formData.group}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: A"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagen del curso
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Formatos soportados: JPG, PNG. Tamaño máximo: 5MB
                            </p>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear Curso' : 'Actualizar Curso'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
