import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { updateCourse, type UpdateCourseRequest } from '../../actions/courses/update-course';
import type { Course } from '../../actions/courses/get-courses';
import type { User } from '../../domain/entities/user';
import '../styles/course-management.css';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated: (course: Course) => void;
  onError: (error: string) => void;
  userData?: User | null;
  course: Course;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseUpdated,
  onError,
  userData,
  course,
}) => {
  const [formData, setFormData] = useState<UpdateCourseRequest>({
    title: course.title,
    description: course.description,
    grade: course.grade,
    subject: course.subject || '',
    publish: course.published,
    banner: course.banner || '',
  });
  
  const [loading, setLoading] = useState(false);

  // Refs to track form field values
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const gradeRef = useRef<HTMLSelectElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const publishRef = useRef<HTMLInputElement>(null);

  // Reset form data when course changes
  useEffect(() => {
    setFormData({
      title: course.title,
      description: course.description,
      grade: course.grade,
      subject: course.subject || '',
      publish: course.published,
      banner: course.banner || '',
    });
    
    // Sync refs with new form data after state update
    setTimeout(() => syncRefsWithFormData(), 0);
  }, [course]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      onError('El título del curso es obligatorio');
      return;
    }

    setLoading(true);

    try {
      
      // Get current form data (use refs as fallback in case state was reset)
      const currentFormData = getFormDataFromRefs();
      
      // Create update payload with proper field filtering
      const updatePayload: UpdateCourseRequest = {
        title: currentFormData.title?.trim(),
        description: currentFormData.description?.trim(),
        grade: currentFormData.grade,
        publish: currentFormData.publish === true,
      };

      // Only include subject if it's not empty after trimming
      if (currentFormData.subject && currentFormData.subject.trim() !== '') {
        updatePayload.subject = currentFormData.subject.trim();
      }

      // Only include banner if it's not empty after trimming
      if (currentFormData.banner && currentFormData.banner.trim() !== '') {
        updatePayload.banner = currentFormData.banner.trim();
      }
      
      
      const result = await updateCourse(course.id, updatePayload);
      
      if (result.success && result.data) {
        
        // Convert response to Course format
        const updatedCourse: Course = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          tutorName: result.data.tutorName,
          grade: result.data.grade,
          group: result.data.group,
          subject: result.data.subject || '',
          published: result.data.published,
          createdAt: result.data.createdAt,
          banner: result.data.banner || '',
        };
        
        onCourseUpdated(updatedCourse);
        onClose();
      } else {
        // console.error('❌ Failed to update course:', result.error);
        onError(result.error || 'Error al actualizar el curso');
      }
    } catch (error) {
      // console.error('❌ Error updating course:', error);
      onError('Error inesperado al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Function to sync ref values with formData (backup for form persistence)
  const syncRefsWithFormData = () => {
    if (titleRef.current) titleRef.current.value = formData.title || '';
    if (descriptionRef.current) descriptionRef.current.value = formData.description || '';
    if (gradeRef.current) gradeRef.current.value = formData.grade || '';
    if (subjectRef.current) subjectRef.current.value = formData.subject || '';
    if (bannerRef.current) bannerRef.current.value = formData.banner || '';
    if (publishRef.current) publishRef.current.checked = formData.publish || false;
  };

  // Function to get current values from refs (in case formData gets reset)
  const getFormDataFromRefs = () => {
    return {
      title: titleRef.current?.value || formData.title,
      description: descriptionRef.current?.value || formData.description,
      grade: gradeRef.current?.value || formData.grade,
      subject: subjectRef.current?.value || formData.subject,
      banner: bannerRef.current?.value || formData.banner,
      publish: publishRef.current?.checked || formData.publish,
    };
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 modal-backdrop-blur"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Editar Curso</h2>
          <button
            onClick={handleClose}
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

            {/* Banner URL */}
            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-300 mb-2">
                URL de imagen (opcional)
              </label>
              <input
                type="url"
                id="banner"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={loading}
                ref={bannerRef}
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="publish"
                checked={formData.publish}
                onChange={(e) => setFormData({ ...formData, publish: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
                ref={publishRef}
              />
              <label htmlFor="publish" className="ml-2 text-sm font-medium text-gray-300">
                Publicar curso inmediatamente
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title?.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Actualizando...' : 'Actualizar Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
