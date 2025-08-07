import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth/useAuthStore';
import { StorageAdapter } from '../../config/adapters/storage-adapter';

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout: authLogout } = useAuthStore();

    const logout = async () => {
        try {
            // Clear all React Query cache
            queryClient.clear();

            // Clear all authentication data from storage
            StorageAdapter.clearAllAuthData();

            // Call the auth store logout
            const result = await authLogout();

            // Force a page reload to ensure clean state
            window.location.reload();

            return result;
        } catch (error) {
            // Still clear local data even if there's an error
            queryClient.clear();
            StorageAdapter.clearAllAuthData();
            window.location.reload();
            throw error;
        }
    };

    return { logout };
};
