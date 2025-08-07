import { useAuthStore } from '../store/auth/useAuthStore';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({ allowedRoles, children, redirectTo = '/home' }: RoleGuardProps) => {
  const { role } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      navigate(redirectTo, { replace: true });
    }
  }, [role, allowedRoles, redirectTo, navigate]);

  // Don't render anything while checking role or if role is not allowed
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};
