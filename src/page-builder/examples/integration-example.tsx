/**
 * Ejemplo de integración del Page Builder en una aplicación existente
 */

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router';

// Importaciones del page builder - ajustar ruta según estructura
import { PageBuilderPage, BuilderProvider } from '../index';

// Componente principal de ejemplo
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navegación simple */}
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">SmartClass</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-200">Inicio</Link>
              <Link to="/courses" className="hover:text-blue-200">Cursos</Link>
              <Link to="/page-builder" className="hover:text-blue-200">Constructor</Link>
            </div>
          </div>
        </nav>

        {/* Rutas principales */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route 
            path="/page-builder" 
            element={
              <BuilderProvider>
                <PageBuilderPage />
              </BuilderProvider>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Páginas de ejemplo
function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a SmartClass</h1>
      <p className="text-gray-600 mb-8">
        Crea cursos interactivos con nuestro constructor visual de páginas.
      </p>
      <Link 
        to="/page-builder" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Comenzar a crear
      </Link>
    </div>
  );
}

function CoursesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Mis Cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(id => (
          <div key={id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Curso {id}</h3>
            <p className="text-gray-600 text-sm mb-4">Descripción del curso...</p>
            <div className="flex space-x-2">
              <button className="text-blue-600 text-sm">Ver</button>
              <Link to="/page-builder" className="text-green-600 text-sm">
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bootstrap de la aplicación
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
