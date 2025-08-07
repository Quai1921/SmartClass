import { useState } from 'react';
import { getCourses } from '../../actions/courses/get-courses';
import { updateCourse } from '../../actions/courses/update-course';

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  grade?: string;
  subject?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCourseData {
  title: string;
  description: string;
  grade: string;
  subject: string;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
}

export const useCourseManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  
  // Alert state for showing update results
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');

  // Alert management functions
  const restartAlert = () => {
    setShowAlert(false);
  };

  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('message');
    setShowAlert(true);
  };

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
  };

  // Open course edit modal
  const openCourseEditModal = (course: CourseData) => {
    // console.log('🎯 Opening course edit modal for:', course);
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  // Close course edit modal
  const closeCourseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCourse(null);
    setIsUpdating(false);
  };

  // Update course data
  const handleUpdateCourse = async (courseData: UpdateCourseData): Promise<boolean> => {
    if (!editingCourse) return false;

    try {
      setIsUpdating(true);
      // console.log('💾 Updating course:', courseData);

      // Ensure required fields are provided (backend expects @NotBlank title and description)
      const updateData = {
        title: courseData.title.trim() || editingCourse.title,
        description: courseData.description?.trim() || editingCourse.description || '',
        status: courseData.status,
        grade: courseData.grade?.trim() || editingCourse.grade || '', // Use form data grade
        subject: courseData.subject?.trim() || editingCourse.subject || '' // Use form data subject
      };

      // console.log('📤 Sending update data:', updateData);

      const response = await updateCourse(editingCourse.id, updateData);

      if (response.success) {
        // console.log('✅ Course updated successfully');
        showSuccessAlert('¡Curso actualizado exitosamente!');
        
        // Close modal after a brief delay to let user see the success message
        setTimeout(() => {
          closeCourseEditModal();
        }, 1500);
        
        return true;
      } else {
        // console.error('❌ Failed to update course:', response.error);
        showErrorAlert('Error al actualizar el curso: ' + (response.error || 'Error desconocido'));
        return false;
      }
    } catch (error) {
      // console.error('❌ Error updating course:', error);
      showErrorAlert('Error al actualizar el curso');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick publish course (with current data)
  const publishCourse = async (courseId: string): Promise<boolean> => {
    try {
      setIsUpdating(true);
      // console.log('📤 Publishing course:', courseId);

      // Get current course data first
      const coursesResponse = await getCourses();
      if (!coursesResponse.success || !coursesResponse.data) {
        throw new Error('No se pudo obtener la información del curso');
      }

      const course = coursesResponse.data.find((c: any) => c.id === courseId);
      if (!course) {
        throw new Error('Curso no encontrado');
      }

      // Update course status to PUBLISHED with all required fields
      const response = await updateCourse(courseId, {
        title: course.title,
        description: course.description || '',  // Ensure description is not empty
        grade: course.grade,
        subject: course.subject,
        status: 'PUBLISHED'
      });

      if (response.success) {
        // console.log('✅ Course published successfully');
        return true;
      } else {
        // console.error('❌ Failed to publish course:', response.error);
        alert('Error al publicar el curso: ' + (response.error || 'Error desconocido'));
        return false;
      }
    } catch (error) {
      // console.error('❌ Error publishing course:', error);
      alert('Error al publicar el curso');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    // State
    isUpdating,
    isEditModalOpen,
    editingCourse,
    
    // Alert state
    showAlert,
    alertMessage,
    alertType,
    restartAlert,
    
    // Actions
    openCourseEditModal,
    closeCourseEditModal,
    handleUpdateCourse,
    publishCourse
  };
};
