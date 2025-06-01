
// src/redux/slices/themeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

export const initialState: ThemeState = {
  mode: 'light', // Default theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setLightMode: (state) => {
      state.mode = 'light';
    },
    setDarkMode: (state) => {
      state.mode = 'dark';
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setLightMode, setDarkMode, toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
