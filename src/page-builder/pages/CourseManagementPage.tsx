import React from 'react';
import { CourseManagementPage } from '../components/CourseManagementPage';
import { ErrorBoundary } from '../components/ErrorBoundary';

const CourseManagementRoute: React.FC = () => {
  
  try {
    return (
      <ErrorBoundary>
        <CourseManagementPage />
      </ErrorBoundary>
    );
  } catch (error) {
    // console.error('❌ CourseManagementRoute: Error rendering:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Course Management</h1>
          <p className="text-gray-300">Check console for details</p>
          <pre className="mt-4 text-red-400 text-sm">{String(error)}</pre>
        </div>
      </div>
    );
  }
};

export default CourseManagementRoute;
