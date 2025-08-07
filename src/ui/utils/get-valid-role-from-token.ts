import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  exp: number;
}

export const getValidRoleFromToken = (token: string): { role: string | null; isExpired: boolean } => {

  
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;
    const timeUntilExpiry = decoded.exp - currentTime;
    
meUntilExpiryMinutes: Math.round(timeUntilExpiry / 60)
    // });
    
    if (isExpired) {
      // console.error('❌ Token is EXPIRED!');
      // TEMPORARY: Allow some tolerance for clock skew (5 minutes)
      const tolerance = 5 * 60; // 5 minutes in seconds
      if (Math.abs(timeUntilExpiry) < tolerance) {
        // console.warn('⚠️ TEMPORARY: Token expired but within tolerance, allowing access');
        // console.warn('⚠️ This is a temporary fix for debugging - remove in production');
        return { role: decoded.role || null, isExpired: false };
      }
    } else {
    }
    
    return { role: decoded.role || null, isExpired };
  } catch (error) {
    // console.error('❌ Token validation failed:', error);
    // console.error('❌ This will cause token to be cleared');
    return { role: null, isExpired: true };
  }
};
