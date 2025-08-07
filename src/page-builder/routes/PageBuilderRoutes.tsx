import React from 'react';
import { Routes, Route } from 'react-router';
import { PageBuilderPage } from '../index';

// Ejemplo de integración de rutas para el page builder
export const PageBuilderRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/page-builder" element={<PageBuilderPage />} />
      <Route path="/page-builder/new" element={<PageBuilderPage />} />
      <Route path="/page-builder/:courseId" element={<PageBuilderPage />} />
    </Routes>
  );
};

// También podrías usar en tu App.tsx principal:
/*
import { PageBuilderRoutes } from './routes/PageBuilderRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/courses/*" element={<CoursesRoutes />} />
        <Route path="/builder/*" element={<PageBuilderRoutes />} />
        // ... otras rutas
      </Routes>
    </Router>
  );
}
*/
