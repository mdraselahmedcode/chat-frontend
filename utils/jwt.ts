// src/utils/jwt.ts

import JWT from 'expo-jwt';
import { JWT_SECRET } from '~/config/secrets';
interface JwtPayload {
  exp: number;
  // Add other fields as necessary
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JWT.decode<JwtPayload>(token, JWT_SECRET); // Decoding with expo-jwt
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};
