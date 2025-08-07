import { Route, Routes } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { AuthProvider } from "./providers/AuthProvider";
import { MainLayout } from "./layout/MainLayout";
import HomePage from "./pages/home/HomePage";
import InstitucionPage from "./pages/admin/InstitucionPage";
import UserPage from "./pages/admin/UserPage";
import Configuration from "./pages/admin/Configuration";
import { EmailComponent } from "./pages/admin/EmailPage";
import { useAuthStore } from "./store/auth/useAuthStore";
import NotFoundPage from "./pages/NotFoundPage";
import HomePageInstitution from "./pages/institution/HomePageInstitution";
import TeacherPage from "./pages/institution/TeacherPage";
import ReportPage from "./pages/institution/ReportPage";
import StudentPage from "./pages/institution/StudentPage";
import ConfigurationPage from "./pages/institution/ConfigurationPage";
import CalendarPage from "./pages/institution/CalendarPage";
import Policies from "./pages/institution/Policies";
import CreateInstitution from "./pages/institution/CreateInstitution";
import ConfigureInstitution from "./pages/institution/ConfigureInstitution";
import SuccessPage from "./pages/institution/SuccessPage";
import NotificationContainer from "./components/NotificationContainer";
import PageBuilderPage from "../page-builder/pages/PageBuilderPage";
import CourseManagementRoute from "../page-builder/pages/CourseManagementPage";
import ModuleManagementRoute from "../page-builder/pages/ModuleManagementPage";
import { ImageWidgetTest } from "./pages/ImageWidgetTest";
import { TestPage } from "../page-builder/pages/TestPage";
import PaginationDemo from "../page-builder/components/PaginationDemo";
import ModulesTabWithPagination from "../page-builder/builder/sidebar/components/ModulesTabWithPagination";
import PreviewPage from "../page-builder/pages/PreviewPage";
import { useEffect } from "react";
// Tutor imports
import TutorDashboardClean from "./pages/tutor/TutorDashboardClean";
import CreateCourseSimple from "./pages/tutor/CreateCourseSimple";
import TutorStats from "./pages/tutor/TutorStats";
import TutorProfile from "./pages/tutor/TutorProfile";
import RoleRedirect from "./providers/RoleRedirect";



import { useInstitutionStatus } from "./hooks/useInstitutionStatus";



function App() {
  const { initializeAuth } = useAuthStore();
  const { userData } = useInstitutionStatus();
  
  // Initialize authentication status when app starts
  useEffect(() => {
    // Initialize synchronously from localStorage - this will set isInitialized to true
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <NotificationContainer />      <Routes>
        {/* Rutas públicas accesibles sin autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:id" element={<RegisterPage />} />
        
        {/* Role-based redirect for root path */}
        <Route path="/" element={<RoleRedirect />} />
        
        {/* Page Builder - Accesible sin autenticación para testing */}
        <Route path="/page-builder" element={<PageBuilderPage />} />
        
        {/* Preview Page - Accesible sin autenticación para testing */}
        <Route path="/preview" element={<PreviewPage />} />
        
        {/* Image Widget Test - Accesible sin autenticación para testing */}
        <Route path="/image-widget-test" element={<ImageWidgetTest />} />
        
        {/* Enhanced Module Content Test - Accesible sin autenticación para testing */}
        <Route path="/test-enhanced-module-content" element={<TestPage />} />
        
        {/* Pagination System Test - Accesible sin autenticación para testing */}
        <Route path="/test-pagination" element={<PaginationDemo />} />
        
        {/* Modules Pagination Test - Accesible sin autenticación para testing */}
        <Route path="/test-modules-pagination" element={<ModulesTabWithPagination />} />
        
        {/* ModulesTab with Pagination Test - Accesible sin autenticación para testing */}
        <Route path="/test-modules-pagination" element={<ModulesTabWithPagination />} />
      
      {/* Rutas del proceso de onboarding para nuevos usuarios */}
      {/* Paso 1: Aceptación de políticas y términos de servicio */}
      <Route path="/policies" element={<Policies />} />
      {/* Paso 2: Creación de la institución educativa */}
      <Route path="/create-institution" element={<CreateInstitution />} />
      {/* Paso 3: Configuración de la estructura institucional */}
      <Route path="/configure-institution" element={<ConfigureInstitution />} />
      {/* Paso 4: Página de confirmación exitosa del proceso de onboarding */}
      <Route path="/onboarding-success" element={<SuccessPage />} />      {/* Rutas protegidas que requieren autenticación y autorización */}
      <Route element={<AuthProvider />}>
        <Route element={<MainLayout />}>
          {/* Ruta común para todos los usuarios autenticados */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Rutas específicas para usuarios con rol de administrador del sistema */}
          <Route path="/instituciones" element={<InstitucionPage />} />
          <Route path="/usuarios" element={<UserPage />} />
          <Route path="/configuraciones" element={<Configuration />} />
          <Route path="/reportes" element={<ReportPage />} />
          <Route path="/correos" element={<EmailComponent />} />

          {/* Course Management - Protected route for course management */}
          <Route path="/courses" element={<CourseManagementRoute />} />

          {/* Rutas específicas para administradores de institución educativa */}
          <Route path="/institucion-dashboard" element={<HomePageInstitution />} />
          <Route path="/docentes" element={<TeacherPage />} />
          <Route path="/informes" element={<ReportPage />} />
          <Route path="/estudiantes" element={<StudentPage />} />
          <Route path="/calendario" element={
            <CalendarPage 
              // grades={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']}
              // groups={['A', 'B', 'C', 'D']}
              // shifts={['MORNING', 'AFTERNOON', 'NIGHT']}
                grades={(userData?.grades as string[])}
                groups={(userData?.groups as string[])}
                shifts={(userData?.shifts as string[])}
            />
          } />
          <Route path="/configuraciones-institucion" element={<ConfigurationPage />} />

          {/* Rutas específicas para tutores */}
          <Route path="/tutor-dashboard" element={<TutorDashboardClean />} />
          <Route path="/crear-curso" element={<CreateCourseSimple />} />
          
          {/* Module Management - Protected route for managing course modules */}
          <Route path="/modules" element={<ModuleManagementRoute />} />
          
          <Route path="/mi-calendario" element={
            <CalendarPage 
              // grades={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']}
              // groups={['A', 'B', 'C', 'D']}
              // shifts={['MORNING', 'AFTERNOON', 'NIGHT']}
                grades={(userData?.grades as string[])}
                groups={(userData?.groups as string[])}
                shifts={(userData?.shifts as string[])}
            />
          } />
          <Route path="/estadisticas" element={<TutorStats />} />
          <Route path="/mi-perfil" element={<TutorProfile />} />{/* Ruta comodín para manejar páginas no encontradas (404) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
