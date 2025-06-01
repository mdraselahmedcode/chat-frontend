// ~/redux/slices/sizeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SizeState {
  sizeMultiplier: number; // Controls the size scaling
}

export const initialState: SizeState = {
  sizeMultiplier: 1, // Default size multiplier
};

const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    setSizeMultiplier(state, action: PayloadAction<number>) {
      const newMultiplier = action.payload;
      // Optional: Enforce limits to prevent excessive scaling
      if (newMultiplier >= 0.8 && newMultiplier <= 2) { // Example limits
        state.sizeMultiplier = newMultiplier;
      }
    },
  },
});

export const { setSizeMultiplier } = sizeSlice.actions;
export default sizeSlice.reducer;
