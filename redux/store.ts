

// src/redux/store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'; 
import authReducer, { initialState as authInitialState } from './slices/authSlice';
import themeReducer, { ThemeState, initialState as themeInitialState } from './slices/themeSlice'; 
import chatReducer, { initialState as chatInitialState } from './slices/chatSlice'; 
import messageReducer, { initialState as messageInitialState } from './slices/messageSlice'; 
import sizeReducer, { SizeState, initialState as sizesInitialState } from './slices/sizeSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme', 'sizes', 'chats', 'messages'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  chats: chatReducer,
  messages: messageReducer,
  sizes: sizeReducer,
});

// Create a root reducer to handle logout
const rootReducerWithReset = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: { type: string }
) => {
  if (action.type === 'auth/logoutSuccess') {
    const { theme = themeInitialState, sizes = sizesInitialState } = state || {}; // Use initialState as fallback
    return {
      sizes, // Preserve sizes state
      theme, // Preserve theme state
      auth: authInitialState, // Reset auth state
      chats: chatInitialState, // Reset chats state
      messages: messageInitialState, // Reset messages state
    };
  }
  return rootReducer(state, action);
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducerWithReset);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create and export custom hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
