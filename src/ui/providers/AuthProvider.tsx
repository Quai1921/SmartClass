import { useEffect } from "react"
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from "../store/auth/useAuthStore";

export const AuthProvider = () => {
    const { checkStatus, status, role, isInitialized } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isInitialized) {
            checkStatus();
        }
    }, [checkStatus, isInitialized])

    useEffect(() => {
        if (isInitialized && status !== 'checking') {
            if (status !== 'SUCCESS') {
                // Check if token exists but is expired
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const currentTime = Math.floor(Date.now() / 1000);
                        const isExpired = payload.exp < currentTime;
                        
                        if (isExpired) {
                            // Clear expired token before redirect
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('token');
                        }
                    } catch (error) {
                        // Error parsing token, clear it
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                    }
                }
                
                navigate('/login', { replace: true });
            }
        }
    }, [status, navigate, isInitialized, role])

    if (!isInitialized || status === 'checking') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return (
        <Outlet />
    )
}
