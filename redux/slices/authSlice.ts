

// src/redux/slices/authSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '~/config/baseurl';
import { saveToken, removeToken, getToken } from '~/utils/authStorage';
import { USER_TOKEN_KEY } from '~/utils/constraints';
import { RegistrationResponse, User, ErrorResponse, LogoutResponse, LoginResponse, LoginDataType, RegistrationDataType } from '~/types/all_types';
import { fetchUserDataAPI } from '~/utils/api'; // Import the API function

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  loading: boolean;
};

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  RegistrationResponse, // Return type
  RegistrationDataType, // Argument type
  { rejectValue: ErrorResponse, } // ThunkAPI
>(
  'auth/registerUser',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await axios.post<RegistrationResponse>(
        `${BASE_URL}/api/v1/user/register`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data.success) {
        await saveToken(USER_TOKEN_KEY, response.data.token);
        return response.data;
      } else {
        // return rejectWithValue(response.data?.errors ? response.data.errors[0].msg : 'Registration failed.');
        return rejectWithValue({ success: false, errors: [{ msg: response?.data?.message ?? 'Registration failed.' }] });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error?.response) {
          const data = error?.response?.data as ErrorResponse;
          return rejectWithValue({ success: false, errors: [{ msg: data?.errors ? data?.errors[0]?.msg : 'Registration failed.' }] });
        } else if (error?.request) {
          // return rejectWithValue('No response from server. Please try again later.');
          return rejectWithValue({ success: false, errors: [{ msg: error?.request?.msg ? error.request[0].msg : 'check your connection and try again' }] });
        } else {
          return rejectWithValue({ success: false, errors: [{ msg: 'server error' }] });
        }
      } else {
        return rejectWithValue({ success: false, errors: [{ msg: 'An unexpected error occurred.' }] });
      }
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk<
  LoginResponse, // Return type
  LoginDataType, // Argument type
  { rejectValue: ErrorResponse } // ThunkAPI
>(
  'auth/loginUser',
  async (LoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/api/v1/user/login`,
        LoginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );
      if (response.data.success) {
        await saveToken(USER_TOKEN_KEY, response.data.token);
        return response?.data;
      } else {
        return rejectWithValue({ success: false, errors: [{ msg: response?.data?.message ?? 'Login failed.' }] });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error?.response) {
          const data = error?.response?.data as ErrorResponse;
          return rejectWithValue({ success: false, errors: [{ msg: data?.errors ? data?.errors[0]?.msg : 'Login failed.' }] });
        } else if (error?.request) {
          // return rejectWithValue('No response from server. Please try again later.');
          return rejectWithValue({ success: false, errors: [{ msg: error?.request?.msg ? error.request[0].msg : 'Check your connection and try again' }] });
        } else {
          return rejectWithValue({ success: false, errors: [{ msg: 'server error' }] });
        }
      } else {
        return rejectWithValue({ success: false, errors: [{ msg: 'An unexpected error occurred.' }] });
      }
    }
  }
);

// Define an async thunk for logout that calls the backend
export const logoutUser = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: ErrorResponse }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<LogoutResponse>(
      `${BASE_URL}/api/v1/user/logout`
    )
    if (response.data.success) {
      await removeToken(USER_TOKEN_KEY);
      return response.data;
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'Logout failed.' }],
      });
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as ErrorResponse;
        return rejectWithValue(data);
      } else if (error.request) {
        return rejectWithValue({
          success: false,
          errors: [{ msg: 'No response from server. Check your connection.' }],
        });
      } else {
        return rejectWithValue({
          success: false,
          errors: [{ msg: 'An unexpected error occurred.' }],
        });
      }
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'An unexpected error occurred.' }],
      });
    }
  }
});



// Async thunk to get user profile
export const getUserProfile = createAsyncThunk<
  User, // Return type
  string, // Argument type (token)
  { rejectValue: ErrorResponse } // ThunkAPI
>(
  'auth/getUserProfile',
  async (token, { rejectWithValue }) => {
    try {
      const userData = await fetchUserDataAPI(token);
      if (userData?.success) {
        return userData;
      } else {
        return rejectWithValue({ success: false, errors: [{ msg: userData?.message ?? 'Fetching user detail failed.' }] });

      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error?.response) {
          const data = error?.response?.data as ErrorResponse;
          return rejectWithValue({ success: false, errors: [{ msg: data?.errors ? data?.errors[0]?.msg : 'Fetching user details failed.' }] });
        } else if (error?.request) {
          // return rejectWithValue('No response from server. Please try again later.');
          return rejectWithValue({ success: false, errors: [{ msg: error?.request?.msg ? error.request[0].msg : 'check your connection and try again' }] });
        } else {
          return rejectWithValue({ success: false, errors: [{ msg: 'server error' }] });
        }
      } else {
        return rejectWithValue({ success: false, errors: [{ msg: 'An unexpected error occurred.' }] });
      }
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserFromToken: (state: AuthState, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logoutSuccess: (state: AuthState) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle registerUser
      .addCase(registerUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state: AuthState, action: PayloadAction<RegistrationResponse>) => {
        state.isAuthenticated = true;
        state.user = {
          _id: action.payload._id,
          email: action.payload.email,
          gender: action.payload.gender,
          avatar: action.payload.avatar,
          location: action.payload.location,
          token: action.payload.token,
          username: action.payload.username,
          success: action.payload.success,
          message: action.payload.message,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state: AuthState, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload?.errors ? action.payload.errors[0].msg : 'Registration failed.';
      })


      // Handle loginUser
      .addCase(loginUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state: AuthState, action: PayloadAction<LoginResponse>) => {
        state.isAuthenticated = true;
        state.user = {
          _id: action.payload._id,
          email: action.payload.email,
          gender: action.payload.gender,
          avatar: action.payload.avatar,
          location: action.payload.location,
          token: action.payload.token,
          username: action.payload.username,
          success: action.payload.success,
          message: action.payload.message,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state: AuthState, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload?.errors ? action.payload.errors[0].msg : 'Login failed.';

      })
      // Handle logoutUser
      .addCase(logoutUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state: AuthState, action: PayloadAction<LogoutResponse>) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload?.errors ? action.payload.errors[0].msg : 'Logout failed.';
      })
      // Handle getUserProfile
      .addCase(getUserProfile.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload?.errors ? action.payload.errors[0].msg : 'Failed to fetch user profile.';
      });
  },
});

// Export the reducer and actions
export const { setUserFromToken, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;


