/**
 * Pagination Test Route
 * Step 7: Simple route to test our pagination system
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginationDemo from '../components/PaginationDemo';

const PaginationTestRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/test" element={<PaginationDemo />} />
      <Route path="/" element={
        <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Pagination System</h1>
            <p className="text-gray-400 mb-6">
              A clean, step-by-step pagination system for the page builder
            </p>
            <a 
              href="/pagination/test" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Test Pagination Demo
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default PaginationTestRoutes;
