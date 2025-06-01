// src/hooks/useTheme.ts

import { useDispatch } from 'react-redux';
import { toggleTheme } from '~/redux/slices/themeSlice'; // Import the toggleTheme action
import { AppDispatch } from '~/redux/store';

/**
 * Custom hook to handle theme toggling.
 * Dispatches the toggleTheme action to switch between light and dark modes.
 */
const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return toggle;
};

export default useTheme;
