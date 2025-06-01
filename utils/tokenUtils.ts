// src/utils/tokenUtils.ts

import {jwtDecode} from 'jwt-decode';
import { getToken } from '~/utils/authStorage';
import { USER_TOKEN_KEY } from '~/utils/constraints';

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const token = await getToken(USER_TOKEN_KEY);

    if (!token) {
      console.log("Token not found in AsyncStorage");
      return true; // Treat as expired if token is not found
    }

    const decodedToken: { exp: number } = jwtDecode(token); // Decode the token to get payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    return decodedToken.exp < currentTime; // Return true if token is expired
  } catch (error) {
    console.error('Error decoding or checking token expiration:', error);
    return true; // Treat as expired in case of any error
  }
};
