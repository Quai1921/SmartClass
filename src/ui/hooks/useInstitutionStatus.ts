import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../../actions/user/get-user-data';
import { getCourses } from '../../actions/courses/get-courses';
import { useAuthStore } from '../store/auth/useAuthStore';

export const useInstitutionStatus = () => {
    const { role } = useAuthStore();
    
    const { data: userData, isLoading: isLoadingUserData } = useQuery({
        queryKey: ['userData'],
        queryFn: getUserData,
        enabled: role === 'INSTITUTION_ADMIN', // Only fetch for institution admins
        staleTime: 1000 * 60 * 60, // 1 hour cache
    });

    // Also check courses to determine if institution should be active
    const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
        enabled: role === 'INSTITUTION_ADMIN', // Only fetch for institution admins
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const isLoading = isLoadingUserData || isLoadingCourses;

    // Enhanced logic: check both backend status AND course availability
    const isInstitutionInactive = (() => {
        // If we don't have user data yet, assume active
        if (!userData) return false;

        // Check if institution has any courses assigned
        const hasAssignedCourses = coursesData?.success && coursesData.data && coursesData.data.length > 0;

        // If institution has courses assigned, consider it active regardless of backend status
        if (hasAssignedCourses) {
            return false; // Active
        }

        // Original logic as fallback
        const originalInactive = userData?.status 
            ? userData.status === 'PENDING' || userData.status === 'INACTIVE'
            : !userData?.grades || userData.grades.length === 0 || 
              !userData?.groups || userData.groups.length === 0;

        return originalInactive;
    })();

    return {
        userData,
        isLoading,
        isInstitutionInactive
    };
};
