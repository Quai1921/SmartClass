
import { smartClassAPI } from "../../config/smartClassAPI";
import type { Auth } from "../../domain/entities/auth";


import type { AuthResponse } from "../../infrastructure/interfaces/auth.response";


const returnUserToken = (data: AuthResponse) => {

    const userAuth: Auth  = {
        status: data.status,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        institutionCreated: data.institutionCreated,
        policyPending: data.policyPending,
        tutorialEnabled: data.tutorialEnabled
    }

    return {
        userAuth: userAuth,
        token: data.accessToken
    }
}


export type LoginResult = {
    success: true;
    data: {
        userAuth: Auth;
        token: string;
    };
} | {
    success: false;
    error: string;
    statusCode?: number;
}

export const authLogin = async (username: string, password: string): Promise<LoginResult> => {

    try {
        const { data } = await smartClassAPI.post<AuthResponse>("/auth/login",
            {
                username,
                password
            });
        
        return {
            success: true,
            data: returnUserToken(data)
        };    
    } catch (error: any) {
        let errorMessage = "Error de conexión. Intenta nuevamente.";
        const statusCode = error?.response?.status;
        
        // Handle 500 server errors specifically
        if (statusCode === 500) {
            errorMessage = "Error interno del servidor. Por favor, intenta más tarde.";
        } else if (error?.response?.data?.alert) {
            errorMessage = error.response.data.alert;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        return {
            success: false,
            error: errorMessage,
            statusCode
        };
    }
};

export const refreshAuthToken = async (): Promise<LoginResult> => {
    try {
        const refreshToken = StorageAdapter.getItem('refreshToken');
        if (!refreshToken) {
            return {
                success: false,
                error: 'No refresh token available'
            };
        }

        const { data } = await smartClassAPI.post<AuthResponse>('/auth/refresh', {
            refreshToken
        });

        // Update tokens in storage
        StorageAdapter.setItem('token', data.accessToken);
        StorageAdapter.setItem('refreshToken', data.refreshToken);

        return {
            success: true,
            data: returnUserToken(data)
        };
    } catch (error: any) {
        let errorMessage = "Error refreshing token. Please login again.";
        const statusCode = error?.response?.status;

        if (statusCode === 400) {
            errorMessage = "Invalid refresh token.";
        } else if (error?.message) {
            errorMessage = error.message;
        }

        return {
            success: false,
            error: errorMessage,
            statusCode
        };
    }
};
