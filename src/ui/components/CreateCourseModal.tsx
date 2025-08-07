import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { createCourse, type CreateCourseRequest } from '../../actions/courses/create-course';
import { getTeachersForSelection, type TeacherForSelection } from '../../actions/teacher/get-teachers-for-selection';
import type { Course } from '../../actions/courses/get-courses';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: Course) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseCreated,
}) => {
  const [formData, setFormData] = useState<CreateCourseRequest & { tutorId: string; group: string; assignment: string; type: string }>({
    title: '',
    description: '',
    tutorId: '',
    grade: '1',
    group: 'A',
    assignment: '',
    type: 'Academico',
    subject: '',
    status: 'DRAFT',
  });
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [teachers, setTeachers] = useState<TeacherForSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacherSearch, setTeacherSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (teacherSearch) {
        loadTeachers(teacherSearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [teacherSearch]);

  const loadTeachers = async (search?: string) => {
    setLoadingTeachers(true);
    try {
      const teachersList = await getTeachersForSelection(search);
      setTeachers(teachersList);
    } catch (err) {
      // console.error('Error loading teachers:', err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match API expectations
      const apiData: CreateCourseRequest = {
        title: formData.title,
        description: formData.description,
        grade: formData.grade,
        subject: formData.assignment, // Use assignment as subject
        status: formData.status,
      };
      
      
      const response = await createCourse(apiData, bannerFile || undefined);
      if (response.success && response.data) {
        // Convert the response to match the Course interface from get-courses
        const newCourse: Course = {
          id: response.data.id,
          title: response.data.title,
          banner: '', // No banner in creation response
          description: response.data.description,
          tutorName: response.data.tutorName,
          grade: response.data.grade,
          group: formData.group, // Use form data for group
          subject: formData.assignment || 'Sin materia', // Use assignment as subject
          status: response.data.status, // Use status directly
          createdAt: response.data.createdAt,
        };
        
        onCourseCreated(newCourse);
        resetForm();
        onClose(); // Only close modal on successful course creation
      } else {
        // Keep modal open on error, just show error message
        setError(response.error || 'Error al crear el curso');
      }
    } catch (err) {
      // Keep modal open on unexpected errors, just show error message
      setError('Error inesperado al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tutorId: '',
      grade: '1',
      group: 'A',
      assignment: '',
      type: 'Academico',
      subject: '',
      status: 'DRAFT',
    });
    setBannerFile(null);
    setTeacherSearch('');
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('El archivo es muy grande. El tamaño máximo es 5MB.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Formato de archivo no válido. Solo se permiten JPG, PNG y GIF.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Clear any previous error
      setError(null);
    }
    
    setBannerFile(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={loading ? undefined : onClose}
        />

        {/* Modal content */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Crear Nuevo Curso
            </h3>
            <button
              onClick={loading ? undefined : onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título del Curso *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Matemáticas Básicas"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el contenido y objetivos del curso..."
              />
            </div>

            {/* Teacher */}
            <div>
              <label htmlFor="tutorId" className="block text-sm font-medium text-gray-700 mb-1">
                Profesor *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar profesor..."
                />
                {loadingTeachers && (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              
              {teachers.length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                  {teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, tutorId: teacher.id }));
                        setTeacherSearch(teacher.fullName);
                        setTeachers([]);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-900">{teacher.fullName}</div>
                      <div className="text-xs text-gray-500">{teacher.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grade and Group */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grado *
                </label>
                <select
                  id="grade"
                  name="grade"
                  required
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}°
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo *
                </label>
                <select
                  id="group"
                  name="group"
                  required
                  value={formData.group}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            {/* Assignment */}
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-1">
                Asignatura *
              </label>
              <input
                type="text"
                id="assignment"
                name="assignment"
                required
                value={formData.assignment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Matemáticas, Español, Ciencias..."
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Curso *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Academico">Académico</option>
                <option value="Evaluativo">Evaluativo</option>
              </select>
            </div>

            {/* Banner Image */}
            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del Curso (Banner)
              </label>
              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
              {bannerFile && (
                <p className="text-sm text-green-600 mt-1">
                  Archivo seleccionado: {bannerFile.name} ({(bannerFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={loading ? undefined : onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.description || !formData.tutorId || !formData.assignment}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
