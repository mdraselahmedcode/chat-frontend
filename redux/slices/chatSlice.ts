

// src/redux/slices/chatSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Chat } from '~/types/chatTypes';
import { ErrorResponse } from '~/types/all_types';
import api, { fetchUserChatsAPI } from '~/utils/api';
import { logoutSuccess } from './authSlice';
import { Message } from '~/types/messageTypes';
import { getToken } from '~/utils/authStorage';
import { USER_TOKEN_KEY } from '~/utils/constraints';
import { RootState } from '../store';

export type ChatState = {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  currentChatId: string | null; // Add currentChatId to track the selected chat
};

export const initialState: ChatState = {
  chats: [] as Chat[],
  loading: false,
  error: null,
  currentChatId: null, // Initialize currentChatId
};

// Async thunk to fetch user chats
export const fetchUserChats = createAsyncThunk<
  Chat[], // return type
  string,  // argument type
  { rejectValue: ErrorResponse }
>('chats/fetchUserChats', 
  async (token, { rejectWithValue }) => {
  try {
    // const response = await api.get<{ success: boolean; chats: Chat[] }>(
    //   `/chats`
    // );
    const response = await fetchUserChatsAPI(token);


    if (response) {
      return response
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'Failed to fetch chats.' }],
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

// Async thunk to create or fetch a one-on-one chat
export const createOneOnOneChat = createAsyncThunk<
  Chat,
  string,
  { rejectValue: ErrorResponse }
>('chats/createOneOnOneChat', async (userId, { rejectWithValue }) => {
  try {
    const response = await api.post<{ success: boolean; chat: Chat }>(
      `/chats/one-on-one`,
      { userId }
    );

    if (response.data.success) {
      return response.data.chat;
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'Failed to create or fetch chat.' }],
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

// Async thunk to create a group chat
export const createGroupChat = createAsyncThunk<
  Chat,
  { name: string; userIds: string[] },
  { rejectValue: ErrorResponse }
>('chats/createGroupChat', async ({ name, userIds }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ success: boolean; chat: Chat }>(
      `/chats/group`,
      { name, userIds }
    );

    if (response.data.success) {
      return response.data.chat;
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'Failed to create group chat.' }],
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


// Async thunk to delete chats
export const deleteChat = createAsyncThunk<
  { success: boolean; deletedChatIds: string[] },
  string[],
  { rejectValue: ErrorResponse }
>('chats/deleteChat', async (chatIds, { rejectWithValue }) => {
  try {
    const response = await api.delete<{ success: boolean; deletedChatIds: string[] }>(
      `/chats`,
      { data: { chatIds } } // Sending the chat IDs in the request body
    );

    if (response.data.success) {
      return response.data;
    } else {
      return rejectWithValue({
        success: false,
        errors: [{ msg: 'Failed to delete chats.' }],
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


const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // Synchronous actions if needed
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
    },
    updateLatestMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) {
        chat.latestMessage = message;
      }
    },
    setCurrentChatId(state, action: PayloadAction<string | null>) { // Action to set currentChatId
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserChats
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors[0].msg
          : 'Failed to fetch chats.';
      })

      // Handle createOneOnOneChat
      .addCase(createOneOnOneChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOneOnOneChat.fulfilled, (state, action) => {
        // Prevent duplicates
        const exists = state.chats.find((chat) => chat._id === action.payload._id);
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(createOneOnOneChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors[0].msg
          : 'Failed to create or fetch chat.';
      })

      // Handle createGroupChat
      .addCase(createGroupChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors[0].msg
          : 'Failed to create group chat.';
      })


      // Handle deleteChat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        // Remove chats with deleted IDs from state
        state.chats = state.chats.filter(
          (chat) => !action.payload.deletedChatIds.includes(chat._id)
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors[0].msg
          : 'Failed to delete chats.';
      })


      // Handle logoutSuccess to reset chats
      .addCase(logoutSuccess, (state) => {
        state.chats = [];
        state.loading = false;
        state.error = null;
      });
  },
});

// Selector to get the current chat based on currentChatId
export const selectCurrentChat = (state: RootState): Chat | undefined => {
  return  state.chats.chats.find(chat => chat._id === state.chats.currentChatId);
};

// Export actions and reducer
export const { addChat, updateLatestMessage, setCurrentChatId } = chatSlice.actions;
export default chatSlice.reducer;
