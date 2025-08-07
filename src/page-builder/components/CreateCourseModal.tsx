import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { createCourse, debugUserAuth, type CreateCourseRequest } from '../../actions/courses/create-course';
import type { Course } from '../../actions/courses/get-courses';
import type { User } from '../../domain/entities/user';
import '../styles/course-management.css';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: (course: Course) => void;
  onError?: (error: string) => void; // Make optional
  userData?: User | null; // Add userData prop
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseCreated,
  onError,
  userData,
}) => {
  const [formData, setFormData] = useState<CreateCourseRequest>({
    title: '',
    description: '',
    grade: '1',
    subject: '',
    status: 'DRAFT',
    banner: '',
  });
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs to track form field values
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const gradeRef = useRef<HTMLSelectElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Get available grades - hardcoded from 1 to 11
  const getAvailableGrades = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  };

  // Get available subjects from user data
  const getAvailableSubjects = () => {
    if (!userData?.subjects) {
      return ['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Geografía', 'Inglés', 'Educación Física', 'Arte'];
    }
    return userData.subjects;
  };

  // Handle banner file selection
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (!e.target.files) {
      return;
    }
    
    const file = e.target.files[0];
    if (!file) {
      setBannerFile(null);
      setFileError(null);
      return;
    }

    
    // Simple validation
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Archivo muy grande');
      return;
    }

    setFileError(null);
    setBannerFile(file);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Debug user authentication and role
      await debugUserAuth();
      
      // Get current form data (use refs as fallback in case state was reset)
      const currentFormData = getFormDataFromRefs();
      
      const response = await createCourse(currentFormData, bannerFile || undefined);
      if (response.success && response.data) {
        // Convert the response to match the Course interface from get-courses
        const newCourse: Course = {
          id: response.data.id,
          title: response.data.title,
          banner: response.data.banner || currentFormData.banner || '',
          description: response.data.description,
          tutorName: response.data.tutorName,
          grade: response.data.grade,
          group: response.data.group || 'A', // Fallback to 'A' if no group
          subject: currentFormData.subject, // Use the current subject from form
          status: response.data.status, // Use status directly
          createdAt: response.data.createdAt,
        };
        
        // If we got a temporary ID, it means the backend responded but we couldn't parse full data
        if (String(response.data.id).startsWith('created-')) {
          // Use the actual form data for display until the list refreshes
          newCourse.title = currentFormData.title;
          newCourse.description = currentFormData.description;
          newCourse.grade = currentFormData.grade;
          newCourse.subject = currentFormData.subject;
          newCourse.status = currentFormData.status; // Use status directly
        }
        
        // Only close modal on successful course creation
        onCourseCreated(newCourse);
        resetForm();
        onClose(); // Modal should only close on success
      } else {
        // Keep modal open on error, just show error message
        onError?.(response.error || 'Error al crear el curso');
      }
    } catch (err) {
      // Keep modal open on unexpected errors, just show error message
      onError?.('Error inesperado al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      grade: '1',
      subject: '',
      status: 'DRAFT',
      banner: '',
    });
    setBannerFile(null);
    setFileError(null);
    
    // Clear file input
    if (bannerFileRef.current) {
      bannerFileRef.current.value = '';
    }
    
    // Sync refs with reset form data
    setTimeout(() => syncRefsWithFormData(), 0);
  };

  // Function to sync ref values with formData (backup for form persistence)
  const syncRefsWithFormData = () => {
    if (titleRef.current) titleRef.current.value = formData.title || '';
    if (descriptionRef.current) descriptionRef.current.value = formData.description || '';
    if (gradeRef.current) gradeRef.current.value = formData.grade || '';
    if (subjectRef.current) subjectRef.current.value = formData.subject || '';
  };

  // Function to get current values from refs (in case formData gets reset)
  const getFormDataFromRefs = (): CreateCourseRequest => {
    return {
      title: titleRef.current?.value || formData.title,
      description: descriptionRef.current?.value || formData.description,
      grade: gradeRef.current?.value || formData.grade,
      subject: subjectRef.current?.value || formData.subject,
      banner: formData.banner, // Banner is handled via file upload now
      status: 'DRAFT', // Always create courses as drafts
    };
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 modal-backdrop-blur"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Crear Nuevo Curso</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Título del curso *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el título del curso"
                required
                disabled={loading}
                ref={titleRef}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe brevemente el contenido del curso"
                disabled={loading}
                ref={descriptionRef}
              />
            </div>

            {/* Grade and Subject Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-300 mb-2">
                  Grado
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  ref={gradeRef}
                >
                  {getAvailableGrades().map((grade) => (
                    <option key={grade} value={grade}>
                      Grado {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Materia
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  ref={subjectRef}
                >
                  <option value="">Seleccionar materia</option>
                  {getAvailableSubjects().map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Banner File Upload */}
            <div>
              <label htmlFor="bannerFile" className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del curso (opcional)
              </label>
              <input
                type="file"
                id="bannerFile"
                accept="image/*"
                onChange={handleBannerFileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                disabled={loading}
                ref={bannerFileRef}
              />
              {fileError && (
                <p className="mt-1 text-sm text-red-400">{fileError}</p>
              )}
              {bannerFile && (
                <p className="mt-1 text-sm text-green-400">
                  Archivo seleccionado: {bannerFile.name} ({(bannerFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title?.trim() || !formData.subject?.trim() || !!fileError}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
