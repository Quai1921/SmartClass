import { useBuilder } from '../hooks/useBuilder';

export const useNavigation = () => {
  const { createNewProject } = useBuilder();

  // Get courseId from URL to determine correct back navigation
  const getCourseIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('courseId');
  };

  const handleBackNavigation = () => {
    const courseId = getCourseIdFromUrl();
    if (courseId) {
      // If we have a courseId, go back to modules for that course
      window.location.href = `/modules?courseId=${courseId}`;
    } else {
      // If no courseId, go back to courses
      window.location.href = '/courses';
    }
  };

  const handleNewProject = (setConfirmModal: (modal: any) => void) => {
    setConfirmModal({
      isOpen: true,
      title: 'Crear Nuevo Proyecto',
      message: '¿Crear un nuevo proyecto? Los cambios no guardados se perderán.',
      variant: 'warning',
      onConfirm: () => {
        createNewProject();
        setConfirmModal((prev: any) => ({ ...prev, isOpen: false }));
      }
    });
  };

  return {
    getCourseIdFromUrl,
    handleBackNavigation,
    handleNewProject
  };
};
