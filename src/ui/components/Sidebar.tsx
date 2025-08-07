import { useAuthStore } from '../store/auth/useAuthStore';
import { useLogout } from '../hooks/useLogout';
import { useNotificationStore } from '../store/notification/useNotificationStore';
import { adminlinksNav, institutionsLinksNav, tutorLinksNav } from '../utils/LinksNav';
import { SidebarLink } from './SidebarLink';
import * as Icons from "../pages/admin/components/Icons";
import { PowerOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import ConfirmationModal from './ConfirmationModal';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../../actions/user/get-user-data';
import { useInstitutionStatus } from '../hooks/useInstitutionStatus';


export type IconName = keyof typeof Icons

export const Sidebar = () => {
    const { role, status, isInitialized } = useAuthStore();
    const { logout } = useLogout();
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);    // Debug: Log the current role and status
    useEffect(() => {
    }, [role, status, isInitialized]);

    // Fetch user data for institution admins and tutors to get user info
    const { data: userData, isLoading: isLoadingUserData } = useQuery({
        queryKey: ['userData'],
        queryFn: getUserData,
        enabled: role === 'INSTITUTION_ADMIN' || role === 'TUTOR',
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });    // Get institution status for disabling links
    const { isInstitutionInactive } = useInstitutionStatus();

    // Links that should be disabled when institution is inactive
    const disabledLinks = ['Docentes', 'Estudiantes', 'Calendario', 'Informes'];
    const disabledTooltip = 'Esta función estará disponible una vez que se asignen cursos a la institución';

    // Update favicon based on institution logo
    useEffect(() => {
        if (role === 'INSTITUTION_ADMIN' && userData) {
            const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;            if (favicon) {
                // If institution has a logo, use it as favicon, otherwise use new admin logo
                const iconUrl = userData.urlInstitutionLogo || '/assets/images/logo-admin.svg';
                favicon.href = iconUrl;
            }
        } else if (role === 'ADMIN') {
            // For admin, always use SmartClass logo
            const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;            if (favicon) {
                favicon.href = '/assets/images/logo-admin.svg';
            }
        }
    }, [role, userData]);

    const rolesMap = {
        ADMIN: adminlinksNav,
        INSTITUTION_ADMIN: institutionsLinksNav,
        TUTOR: tutorLinksNav,
    };    const links = rolesMap[role as keyof typeof rolesMap] || [];    // Debug: Log navigation details
    useEffect(() => {
    }, [role, status, isInitialized, links, isInstitutionInactive]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        const result = await logout();
        
        // Show notification based on the logout result
        addNotification({
            message: result.message,
            type: result.success ? 'message' : 'error',
            position: 'right-top',
            duration: 4000
        });
        
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };return (
        <aside className="min-w-[241px] bg-background flex flex-col h-full">
            {/* Logo del sistema */}            <div className="p-4 h-[200px] border-b border-[#BDBDBD] flex items-center justify-center">
                {
                    role === 'INSTITUTION_ADMIN' ? (
                        <div className="flex flex-col items-center">
                            {isLoadingUserData ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[87px] h-[87px] mb-2 rounded-full bg-gray-300 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                                </div>                            ) : (
                                <>                                    <img
                                        src={userData?.urlInstitutionLogo || "/assets/images/logo-smart_class2.svg"}
                                        alt="logo institución"
                                        width={100}
                                        height={100}
                                        className={userData?.urlInstitutionLogo ? 'mb-4 rounded-full object-cover' : 'mb-4'}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/assets/images/logo-smart_class2.svg";
                                            target.className = 'mb-4'; // Remove rounded-full when fallback loads
                                        }}
                                    />
                                    <p className='text-[14px] font-semibold text-white text-center'>
                                        {userData?.institutionName || 'SmartClass'}
                                    </p>
                                </>
                            )}
                        </div>                    ) : role === 'TUTOR' ? (
                        <div className="flex flex-col items-center">
                            {isLoadingUserData ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[87px] h-[87px] mb-2 rounded-full bg-gray-300 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                                </div>
                            ) : (
                                <>
                                    <img
                                        src="/assets/images/logo-smart_class2.svg"
                                        alt="SmartClass logo"
                                        width={100}
                                        height={100}
                                        className="mb-4"
                                    />
                                    <p className='text-[14px] font-semibold text-white text-center'>
                                        {userData?.userFirstName || 'Tutor'}
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (                        <img
                            src="/assets/images/logo-smart_class2.svg"
                            alt="Smart Class logo"
                            width={100}
                            height={100}
                        />
                    )
                }
            </div>            {/* Navegación lateral */}
            <nav className="ml-[25px] mt-[57px] flex flex-col flex-1 pb-6">
                <ul className="space-y-2 text-white w-[192px] flex-1">
                    {links.map((link, index) => {
                        const shouldDisable = role === 'INSTITUTION_ADMIN' && 
                                            isInstitutionInactive && 
                                            disabledLinks.includes(link.name);
                        
                        return (
                            <li key={index} className="h-[40px]">
                                <SidebarLink
                                    href={link.href}
                                    name={link.name}
                                    icon={link.icon as IconName}
                                    disabled={shouldDisable}
                                    disabledTooltip={shouldDisable ? disabledTooltip : undefined}
                                />
                            </li>
                        );
                    })}
                </ul>{/* Logout button */}
                <div className="mt-auto w-[192px]">
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-4 text-white hover:text-red-400 transition-colors duration-200 w-full h-[40px] px-4 rounded-[5px] hover:bg-[#2B3646] font-[600]"
                    >
                        <PowerOff size={20} />
                        <span className="text-sm">Cerrar sesión</span>
                    </button>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Cerrar sesión"
                message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema."
                confirmText="Cerrar sesión"
                cancelText="Cancelar"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />
        </aside>
    );
};
