/**
 * Token inspection utility to debug JWT issues
 */

export const inspectCurrentToken = () => {
  
  // Check both storage types
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  

  
  const token = localToken || sessionToken;
  
  if (!token) {
    // console.error('❌ No token found in either storage');
    return null;
  }
  
  try {
    // Parse JWT manually
    const parts = token.split('.');
    if (parts.length !== 3) {
      // console.error('❌ Invalid JWT format - expected 3 parts, got:', parts.length);
      return null;
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    const timeUntilExpiry = payload.exp - currentTime;
    
    const tokenInfo = {
      header,
      payload,
      currentTime,
      currentTimeISO: new Date(currentTime * 1000).toISOString(),
      tokenExp: payload.exp,
      tokenExpISO: new Date(payload.exp * 1000).toISOString(),
      isExpired,
      timeUntilExpirySeconds: timeUntilExpiry,
      timeUntilExpiryMinutes: Math.round(timeUntilExpiry / 60),
      timeUntilExpiryHours: Math.round(timeUntilExpiry / 3600)
    };
    
    
    if (isExpired) {
      // console.error('❌ TOKEN IS EXPIRED!');
      // console.error('❌ Expired by:', Math.abs(timeUntilExpiry), 'seconds');
      // console.error('❌ Expired at:', new Date(payload.exp * 1000).toISOString());
    } else {

    }
    
    return tokenInfo;
  } catch (error) {
    // console.error('❌ Error parsing token:', error);
    return null;
  }
};

// Make it available globally for debugging
(window as any).inspectToken = inspectCurrentToken;

export default inspectCurrentToken;
