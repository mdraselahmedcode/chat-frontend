// src/config/baseurl.js or baseurl.ts

// import Constants from 'expo-constants';
import { Platform } from 'react-native';

// For mobile (Android/iOS)
// const MOBILE_BASE_URL = 'http://192.168.92.148:8000';

const MOBILE_BASE_URL = 'http://192.168.0.102:8000';
// const MOBILE_BASE_URL = 'http://192.168.0.101:8000';

// For web
const WEB_BASE_URL = 'http://localhost:8000'; // Use localhost or your specific web backend address

// Set the BASE_URL based on the platform
export const BASE_URL = Platform.OS === 'web' ? WEB_BASE_URL : MOBILE_BASE_URL;


// // Access the API_URL
// const apiUrl = Constants.expoConfig?.name ;

