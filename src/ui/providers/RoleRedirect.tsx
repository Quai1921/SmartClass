// src/providers/RoleRedirect.tsx
import { Navigate } from 'react-router';
import { useAuthStore } from '../store/auth/useAuthStore';

const RoleRedirect = () => {
    const { role, status } = useAuthStore();

    if (status === 'checking') return null;

    if (status !== 'SUCCESS') return <Navigate to="/login" replace />;

    if (role === 'ADMIN') return <Navigate to="/home" replace />;
    if (role === 'INSTITUTION_ADMIN') return <Navigate to="/institucion-dashboard" replace />;
    if (role === 'TUTOR') return <Navigate to="/tutor-dashboard" replace />;

    return <Navigate to="/home" replace />;
};

export default RoleRedirect;
