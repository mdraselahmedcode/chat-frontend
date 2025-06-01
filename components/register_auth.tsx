// // src/services/auth.ts

// import axios, { AxiosResponse } from 'axios';
// import { BASE_URL } from '~/config/baseurl';

// // Define the shape of registration data
// export interface RegistrationData {
//   username: string;
//   email: string;
//   password: string;
//   gender: 'male' | 'female' | 'other';
//   location: {
//     type: 'Point';
//     coordinates: [number, number]; // [longitude, latitude]
//   };
// }

// // Define the shape of the registration response
// interface RegistrationResponse {
//   _id: string;
//   email: string;
//   gender: 'male' | 'female' | 'other';
//   avatar: string; // Included avatar field
//   location: {
//     coordinates: [number, number]; // [longitude, latitude]
//     type: 'Point';
//   };
//   message: string;
//   success: boolean;
//   token: string;
//   username: string;
// }


// // Optionally, define a more detailed error structure if your backend sends one
// interface ErrorResponse {
//   message: string;
//   errors?: Array<{
//     msg: string;
//     param: string;
//     location: string;
//   }>;
// }






// export const registerUser = async (registrationData: RegistrationData): Promise<RegistrationResponse> => {
//   try {
//     const response: AxiosResponse<RegistrationResponse> = await axios.post(
//       `${BASE_URL}/api/v1/user/register`,      
//       registrationData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true, // Enable if needed
//         timeout: 10000, // 10 seconds timeout
//       }
//     );
//     return response.data;
//   } catch (error) {
//     // Type guard to check if the error is an AxiosError
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         // Server responded with a status other than 2xx
//         const data = error.response.data as ErrorResponse;
//         // You can customize the error handling here based on your backend's error structure
//         throw new Error(data.message || 'Registration failed.');
//       } else if (error.request) {
//         // Request was made but no response received
//         throw new Error('No response from server. Please try again later.');
//       } else {
//         // Something happened while setting up the request
//         throw new Error(error.message);
//       }
//     } else {
//       // Non-Axios error
//       throw new Error('An unexpected error occurred.');
//     }
//   }
// };








