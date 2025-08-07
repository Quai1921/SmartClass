import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // user ID
  role: string;
  exp: number;
}

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return decoded.sub || null;
  } catch (error) {
    // console.error("🚨 Error decoding token:", error);
    return null;
  }
};
