// src/hooks/useLogout.ts

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser, logoutSuccess } from '~/redux/slices/authSlice';
import { removeToken } from '~/utils/authStorage';
import { USER_TOKEN_KEY } from '~/utils/constraints';
import { AppDispatch } from '~/redux/store';
// import { toast } from 'react-toastify'; // Optional: For user notifications

/**
 * Custom hook to handle user logout.
 * Dispatches logout actions and removes the token from storage.
 */
const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logout = useCallback(async () => {
    try {
      // Dispatch the logoutUser thunk for server-side logout if applicable
      await dispatch(logoutUser()).unwrap();

      // Dispatch logoutSuccess to reset client-side state
      dispatch(logoutSuccess());

      // Remove the token from secure storage
      await removeToken(USER_TOKEN_KEY);

      console.log('Successfully logged out');

      // Optional: Notify the user
      // toast.success('Logged out successfully!');
      console.log('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout failed:', error);

      // Optional: Notify the user about the error
      // toast.error('Logout failed. Please try again.');
      console.error('Logout failed. Please try again.');
    }
  }, [dispatch]);

  return logout;
};

export default useLogout;
