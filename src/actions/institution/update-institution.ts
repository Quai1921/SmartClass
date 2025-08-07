// import { smartClassAPI } from "../../config/smartClassAPI";

// export interface UpdateInstitutionRequest {
//   name?: string;
//   address?: string;
//   cityId?: number;
//   logo?: File | string;
// }

// interface UpdateInstitutionResponse {
//   success: boolean;
//   message?: string;
//   error?: string;
//   statusCode?: number;
//   data?: any;
// }

// export const updateInstitution = async (
//   institutionData: UpdateInstitutionRequest
// ): Promise<UpdateInstitutionResponse> => {
//   try {
//     // Create FormData for multipart/form-data
//     const formData = new FormData();
    
//     if (institutionData.name) {
//       formData.append('name', institutionData.name);
//     }
    
//     if (institutionData.address) {
//       formData.append('address', institutionData.address);
//     }
    
//     if (institutionData.cityId) {
//       formData.append('cityId', institutionData.cityId.toString());
//     }
    
//     if (institutionData.logo && institutionData.logo instanceof File) {
//       formData.append('logo', institutionData.logo);
//     }

//     const { data } = await smartClassAPI.put('/institutions/update', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     return {
//       success: true,
//       message: data?.message || 'Institución actualizada exitosamente',
//       data: data?.data,
//     };
//   } catch (error: any) {
//     console.error('Error updating institution:', error);
    
//     return {
//       success: false,
//       error: error.response?.data?.message || 'Error al actualizar la institución',
//       statusCode: error.response?.status,
//     };
//   }
// };




import { smartClassAPI } from "../../config/smartClassAPI";

export interface UpdateInstitutionRequest {
  name?: string;
  address?: string;
  cityId?: number;
  logo?: File | string;
}

interface UpdateInstitutionResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  data?: any;
}

interface UpdateInstitutionOptions {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
}

export const updateInstitution = async (
  institutionData: UpdateInstitutionRequest,
  options?: UpdateInstitutionOptions
): Promise<UpdateInstitutionResponse> => {
  try {
    // Crear query parameters para los campos de texto
    const queryParams = new URLSearchParams();
    
    if (institutionData.name) {
      queryParams.append('name', institutionData.name);
    }
    
    if (institutionData.address) {
      queryParams.append('address', institutionData.address);
    }
    
    if (institutionData.cityId) {
      queryParams.append('cityId', institutionData.cityId.toString());
    }

    const hasLogo = institutionData.logo && institutionData.logo instanceof File;
    
    // Si no hay logo, hacer una petición normal con query params
    if (!hasLogo) {
      // Crear FormData vacío para satisfacer el requirement de multipart/form-data
      const emptyFormData = new FormData();
      
      const { data } = await smartClassAPI.patch(`/institutions/update?${queryParams.toString()}`, emptyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        message: data?.message || 'Institución actualizada exitosamente',
        data: data?.data,
      };
    }

    // Si hay logo, usar Server-Sent Events para el progreso
    return new Promise((resolve, reject) => {
      const baseURL = smartClassAPI.defaults.baseURL || '';
      const url = `${baseURL}/institutions/update?${queryParams.toString()}`;
      
      // Crear FormData solo para el logo
      const formData = new FormData();
      formData.append('logo', institutionData.logo as File);
      
      // Obtener el token de autorización
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Usar fetch para enviar FormData con SSE
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) {
          throw new Error('No se pudo obtener el reader del response');
        }

        options?.onStart?.();
        
        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              options?.onComplete?.();
              resolve({
                success: true,
                message: 'Institución actualizada exitosamente'
              });
              return;
            }
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  
                  if (data.type === 'progress' && data.percent) {
                    const progress = parseFloat(data.percent);
                    options?.onProgress?.(progress);
                  }
                  
                  if (data.message) {
                    // Final message received
                    options?.onComplete?.();
                    resolve({
                      success: true,
                      message: data.message
                    });
                    return;
                  }
                } catch (e) {
                  // console.warn('Error parsing SSE data:', e);
                }
              }
            }
            
            readStream();
          }).catch(reject);
        };
        
        readStream();
      })
      .catch(error => {
        // console.error('Error updating institution:', error);
        options?.onComplete?.();
        reject({
          success: false,
          error: error.message || 'Error al actualizar la institución',
        });
      });
    });

  } catch (error: any) {
    // console.error('Error updating institution:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error al actualizar la institución',
      statusCode: error.response?.status,
    };
  }
};