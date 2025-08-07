/**
 * Debug Save Process Utility
 * 
 * This utility helps track which save function is being called
 * and what content is being saved to the database
 */

export const debugSaveProcess = {
  // Track which save function is called
  trackSaveFunction: (functionName: string, content: any) => {

    
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);

        
        if (parsed.version === 2) {

        } else {

        }
      } catch (error) {

      }
    }
    

  },

  // Track API call
  trackApiCall: (endpoint: string, payload: any) => {

    
    if (payload.content) {
      try {
        const parsed = JSON.parse(payload.content);
        if (parsed.version === 2) {

        } else {

        }
      } catch (error) {

      }
    }
    

  },

  // Track response
  trackResponse: (success: boolean, error?: string) => {



    if (error) {

    }

  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugSaveProcess = debugSaveProcess;

} 