
// Gender Enum
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

// Registration Data Type
export interface RegistrationDataType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender; // Use the Gender enum instead of string literals
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Registration Error Interface
export interface RegistrationError {
  msg: string; // The error message
}

// Registration Response Interface
export interface RegistrationResponse {
  _id: string;
  email: string; 
  gender: Gender; // Use the Gender enum here
  avatar: string; 
  location: {
    type: 'Point'; 
    coordinates: [number, number]; 
  };
  message: string; // This might not be necessary if your API uses `success` to indicate registration status
  success: boolean; 
  token: string; 
  username: string; 
}

// Login Response Interface
export interface LoginResponse {
  _id: string;
  email: string;
  gender: Gender; // Use the Gender enum here
  avatar: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  message: string; // This might not be necessary if your API uses `success` to indicate login status
  success: boolean;
  token: string;
  username: string;
}


// Login Data Type Interface
export interface LoginDataType {
  emailOrUsername: string;
  password: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}


// Logout Response Interface
export interface LogoutResponse {
  message: string; // Could be optional if not always present
  success: boolean;
}

// Error Response Interface
export interface ErrorResponse {
  success: boolean;
  errors?: Array<{ msg: string | any}>; // List of errors
}

// // Error Response Interface for Registration Errors
// export interface RegistrationErrorResponse {
//   success: boolean;
//   errors: Array<{ msg: string }>; // List of error messages
// }

// User Interface
export interface User {
  _id: string;
  avatar: string;
  email: string;
  gender: Gender; // Use the Gender enum here
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  success: boolean; 
  message: string;
  token: string;
  username: string;
}
