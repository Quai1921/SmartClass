
import { smartClassAPI } from "../../config/smartClassAPI";

export interface LogoutResult {
    success: boolean;
    message: string;
    fromBackend: boolean;
}

export const authLogout = async (): Promise<LogoutResult> => {

    try {
        const response = await smartClassAPI.post("/auth/logout");
        
        // Check for successful logout (204 No Content or 200 OK)
        if (response.status === 204 || response.status === 200) {
            return {
                success: true,
                message: "Sesión cerrada exitosamente",
                fromBackend: true
            };
        } else {
            // console.error("Unexpected logout response status:", response.status);
            return {
                success: false,
                message: "Error inesperado al cerrar sesión en el servidor",
                fromBackend: true
            };
        }

    } catch (error) {
        // console.error("Logout request failed:", error);
        return {
            success: false,
            message: "Error de conexión al cerrar sesión en el servidor",
            fromBackend: false
        };
    }
};
