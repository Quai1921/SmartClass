import { useState } from 'react';
import type { Course } from '../../../../actions/courses/get-courses';

interface SidebarModule {
  id: string;
  title: string;
  courseId: string;
  type: 'ACADEMIC' | 'EVALUATIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  isDraft: boolean;
  content?: string;
  createdAt?: string;
  estimatedTime?: number;
}

interface CombinedModule {
  id: string;
  title: string;
  courseId: string;
  type: 'ACADEMIC' | 'EVALUATIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  isDraft: boolean;
  content?: string;
  createdAt?: string;
  estimatedTime?: number;
}

type ViewMode = 'courses' | 'modules';

export const useCourseModuleState = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CombinedModule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('courses');

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setViewMode('modules');
  };

  const handleModuleSelect = (module: CombinedModule) => {
    setSelectedModule(module);
  };

  const handleBackToCourses = () => {
    setViewMode('courses');
    setSelectedModule(null);
  };

  const resetSelection = () => {
    setSelectedCourse(null);
    setSelectedModule(null);
    setViewMode('courses');
  };

  return {
    selectedCourse,
    selectedModule,
    viewMode,
    handleCourseSelect,
    handleModuleSelect,
    handleBackToCourses,
    resetSelection,
    setSelectedCourse,
    setSelectedModule,
    setViewMode
  };
};
