import { create } from "zustand";

import type { AuthStatus } from "../../../infrastructure/interfaces/auth.status";
import { authLogin } from '../../../actions/auth/auth';
import { authLogout, type LogoutResult } from '../../../actions/auth/auth-logout';
import { StorageAdapter } from "../../../config/adapters/storage-adapter";
import { getValidRoleFromToken } from "../../utils/get-valid-role-from-token"; 
import type { Auth } from "../../../domain/entities/auth";
import { smartClassAPI } from "../../../config/smartClassAPI";




export interface AuthState {
    status: AuthStatus;
    token?: string;
    userAuth?: Auth;
    role?: string;
    loginError?: string;
    rememberMe: boolean;
    isInitialized: boolean; // Add flag to track if auth has been initialized

    login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; statusCode?: number }>;
    logout: () => Promise<LogoutResult>;
    checkStatus: () => Promise<void>;
    initializeAuth: () => void; // Add synchronous initialization
    updatePolicyStatus: (policyPending: boolean) => void;
    clearLoginError: () => void;
    setRememberMe: (remember: boolean) => void;
}


export const useAuthStore = create<AuthState>()((set) => {    const clearAuthData = () => {
        // console.error('🧹 clearAuthData: CLEARING ALL AUTH DATA');
        // console.error('🧹 clearAuthData: This will remove tokens and reset auth state');
        // console.trace('🧹 clearAuthData: Call stack trace');
        
        StorageAdapter.removeItem("token");
        StorageAdapter.removeItem("refreshToken");
        set({
            status: "not-authenticated",
            token: undefined,
            userAuth: undefined,
            role: undefined,
            loginError: undefined,
        });
        
        // console.error('🧹 clearAuthData: Auth data cleared, status set to not-authenticated');
    };    return {
        status: "checking",
        token: undefined,
        userAuth: undefined,
        role: undefined,
        loginError: undefined,
        rememberMe: false,
        isInitialized: false,

        // Synchronous initialization from localStorage
        initializeAuth: () => {
            const token = StorageAdapter.getItem("token");
            const refreshToken = StorageAdapter.getItem("refreshToken");

            if (!token) {
                set({
                    status: "not-authenticated",
                    token: undefined,
                    userAuth: undefined,
                    role: undefined,
                    isInitialized: true,
                });
                return;
            }

            const { role, isExpired } = getValidRoleFromToken(token);
            
            if (!role || isExpired) {
                clearAuthData();
                set({ isInitialized: true });
                return;
            }

            // Storage type is now auto-detected by StorageAdapter.getItem
            const isFromLocalStorage = !!localStorage.getItem("token");
            
            // Set immediate auth state with role
            set({
                status: "SUCCESS",
                token,
                role,
                rememberMe: isFromLocalStorage,
                isInitialized: true,
                userAuth: {
                    accessToken: token,
                    refreshToken: refreshToken || "",
                    institutionCreated: role === "ADMIN" || role === "TUTOR", // Admin and Tutor always true, institution will be updated by checkStatus
                    policyPending: role === "TUTOR" ? false : true, // Tutors don't have policy requirements
                    tutorialEnabled: false,
                    status: "SUCCESS",
                },
            });
        },login: async (username, password, rememberMe = false) => {
            // Clear any previous login error
            set({ loginError: undefined });
            
            // Set storage preference before making API call
            StorageAdapter.setUsePersistentStorage(rememberMe);
            set({ rememberMe });
            
            const result = await authLogin(username, password);            if (!result.success) {
                // Store the error message from backend
                StorageAdapter.removeItem("token");
                StorageAdapter.removeItem("refreshToken");
                
                // Don't set loginError for 500 server errors - these are handled by notification system
                const shouldShowTopAlert = result.statusCode !== 500;
                
                set({ 
                    status: "not-authenticated",
                    token: undefined,
                    userAuth: undefined,
                    role: undefined,
                    loginError: shouldShowTopAlert ? result.error : undefined,
                });
                
                return { success: false, statusCode: result.statusCode };
            }

            const { userAuth, token } = result.data;
            
            StorageAdapter.setItem("token", token);
            StorageAdapter.setItem("refreshToken", userAuth.refreshToken || "");

            const { role, isExpired } = getValidRoleFromToken(token);
            if (!role || isExpired) {
                set({ 
                    loginError: "Token inválido o expirado",
                    status: "not-authenticated"
                });
                clearAuthData();
                return { success: false };
            }
            
            set({
                status: "SUCCESS",
                token,
                userAuth,
                role,
                loginError: undefined,
            });

            return { success: true };
        },        checkStatus: async () => {
            const currentState = useAuthStore.getState();
            
            // If already initialized and successful, don't re-check
            if (currentState.isInitialized && currentState.status === 'SUCCESS') {
                return;
            }
            
            const token = StorageAdapter.getItem("token");
            const refreshToken = StorageAdapter.getItem("refreshToken");

            if (!token) {
                clearAuthData();
                set({ isInitialized: true });
                return;
            }

            const { role, isExpired } = getValidRoleFromToken(token);
            
            if (!role || isExpired) {
                clearAuthData();
                set({ isInitialized: true });
                return;
            }

            // For ADMIN users, set success immediately
            if (role === "ADMIN") {
                set({
                    status: "SUCCESS",
                    token,
                    userAuth: {
                        accessToken: token,
                        refreshToken: refreshToken || "",
                        institutionCreated: true,
                        policyPending: false,
                        tutorialEnabled: false,
                        status: "SUCCESS",
                    },
                    role,
                    isInitialized: true,
                });
                return;
            }

            // For TUTOR users, set success immediately (they don't need institution validation)
            if (role === "TUTOR") {
                set({
                    status: "SUCCESS",
                    token,
                    userAuth: {
                        accessToken: token,
                        refreshToken: refreshToken || "",
                        institutionCreated: true, // Tutors don't manage institutions
                        policyPending: false,
                        tutorialEnabled: false,
                        status: "SUCCESS",
                    },
                    role,
                    isInitialized: true,
                });
                return;
            }

            // For INSTITUTION_ADMIN users, validate with server
            try {
                const { data } = await smartClassAPI.get("/users/me");
                const hasInstitutionData = data.institutionName;
                
                set({
                    status: "SUCCESS",
                    token,
                    userAuth: {
                        accessToken: token,
                        refreshToken: refreshToken || "",
                        institutionCreated: !!hasInstitutionData,
                        policyPending: data.policyPending || false, // Use actual value from server
                        tutorialEnabled: data.tutorialEnabled || false, // Use actual value from server
                        status: "SUCCESS",
                    },
                    role,
                    isInitialized: true,
                });
            } catch (error) {
                clearAuthData();
                set({ isInitialized: true });
            }
        },updatePolicyStatus: (policyPending: boolean) => {
            set((state) => ({
                ...state,
                userAuth: state.userAuth ? {
                    ...state.userAuth,
                    policyPending
                } : undefined
            }));
        },        logout: async (): Promise<LogoutResult> => {
            try {
                // Attempt to call logout API
                const result = await authLogout();
                
                // Always clear local auth data regardless of API response
                clearAuthData();
                
                // Return the result from the API call
                return result;
            } catch (error) {
                // console.warn("Logout API call failed, proceeding with local logout:", error);
                
                // Clear local auth data even if API fails
                clearAuthData();
                
                // Return fallback result
                return {
                    success: true,
                    message: "Sesión cerrada localmente (sin conexión al servidor)",
                    fromBackend: false
                };
            }
        },        clearLoginError: () => {
            set({ loginError: undefined });
        },

        setRememberMe: (remember: boolean) => {
            set({ rememberMe: remember });
            StorageAdapter.setUsePersistentStorage(remember);
        },
    };
});
