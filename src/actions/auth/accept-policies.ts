import { smartClassAPI } from "../../config/smartClassAPI";
import { StorageAdapter } from "../../config/adapters/storage-adapter";

export const acceptPolicies = async (policyIds?: string[]) => {
    try {
        const token = StorageAdapter.getItem("token");
        if (!token) {
            return {
                success: false,
                message: "No se encontró el token de autenticación."
            };
        }

        // Si se proporcionan IDs específicos de políticas, los usa; de lo contrario obtiene todas las políticas
        let policiesToAccept: string[] = [];

        if (policyIds && policyIds.length > 0) {
            // Utiliza los IDs de políticas proporcionados por el usuario
            policiesToAccept = policyIds;
        } else {
            // Obtiene todas las políticas disponibles (comportamiento por defecto para compatibilidad)
            try {
                const { data: policies } = await smartClassAPI.get("/users/policies");

                // Valida la respuesta del servidor para asegurar integridad de datos
                if (!policies) {
                    return {
                        success: false,
                        message: "No se recibió respuesta del servidor al obtener las políticas."
                    };
                }

                if (!Array.isArray(policies)) {
                    // console.error("Invalid policies response format:", policies);
                    return {
                        success: false,
                        message: "Formato de respuesta inválido del servidor."
                    };
                }

                if (policies.length === 0) {
                    return {
                        success: false,
                        message: "No se encontraron políticas disponibles."
                    };
                }                // Extrae y valida los IDs de políticas para asegurar que sean procesables
                const extractedPolicyIds = policies
                    .map(policy => {
                        // Valida la estructura del objeto de política para evitar errores
                        if (!policy || typeof policy !== 'object') {
                            // console.warn("Objeto de política inválido:", policy);
                            return null;
                        }

                        // Valida que el ID de política exista y sea válido
                        if (policy.id === undefined || policy.id === null || policy.id === '') {
                            // console.warn("Política sin ID válido:", policy);
                            return null;
                        }

                        // Asegura que el ID sea de un tipo válido (string o number)
                        if (typeof policy.id !== 'string' && typeof policy.id !== 'number') {
                            // console.warn("ID de política con tipo inválido:", typeof policy.id, policy.id);
                            return null;
                        }

                        return String(policy.id);
                    })
                    .filter(id => id !== null && id !== undefined) as string[];

                if (extractedPolicyIds.length === 0) {
                    return {
                        success: false,
                        message: "No se encontraron políticas con IDs válidos para aceptar."
                    };
                }

                policiesToAccept = extractedPolicyIds;
            } catch (policiesError: any) {
                // console.error("Error al obtener políticas:", policiesError);

                // Proporciona mensajes de error más específicos basados en el tipo de error HTTP
                if (policiesError?.response?.status === 401) {
                    return {
                        success: false,
                        message: "No tienes autorización para acceder a las políticas. Por favor, inicia sesión nuevamente."
                    };
                }

                if (policiesError?.response?.status === 404) {
                    return {
                        success: false,
                        message: "El endpoint de políticas no fue encontrado."
                    };
                }

                if (policiesError?.response?.status >= 500) {
                    return {
                        success: false,
                        message: "Error del servidor al obtener las políticas. Inténtalo más tarde."
                    };
                }
                return {
                    success: false,
                    message: "Error al obtener las políticas disponibles. Verifica tu conexión a internet."
                };
            }
        }

        // Construye la cadena de IDs de políticas de forma eficiente y segura para el endpoint
        const policiesIDToAccept = policiesToAccept.join(',');

        if (!policiesIDToAccept) {
            return {
                success: false,
                message: "Error al procesar los IDs de las políticas."
            };
        }

        const { data } = await smartClassAPI.post(`/auth/policies/accept/${policiesIDToAccept}`);

        return {
            success: true,
            message: data?.message || "Políticas aceptadas exitosamente",
            acceptedPolicies: policiesToAccept.length
        };
    } catch (error: any) {
        // console.error("Error al aceptar políticas:", error);

        // Proporciona mensajes de error más específicos para el try-catch principal
        if (error?.response?.status === 401) {
            return {
                success: false,
                message: "Sesión expirada. Por favor, inicia sesión nuevamente."
            };
        }

        if (error?.response?.status >= 500) {
            return {
                success: false,
                message: "Error del servidor. Inténtalo más tarde."
            };
        }

        return {
            success: false,
            message: "Error inesperado al aceptar las políticas. Inténtalo de nuevo."
        };
    }
};