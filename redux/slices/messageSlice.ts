
// src/redux/slices/messageSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, GetMessagesResponse, Pagination, SendMessagePayload, MessageType } from '~/types/messageTypes';
import { ErrorResponse } from '~/types/all_types';
import { sendMessageAPI, fetchMessagesAPI, deleteMessagesAPI } from '~/utils/api';
import axios from 'axios';
import { logoutSuccess } from './authSlice';

// Define the initial state
export interface MessageState {
  messages: {
    [chatId: string]: Message[];
  };
  pagination: {
    [chatId: string]: Pagination;
  };
  loading: boolean;
  error: string | null;
}

export const initialState: MessageState = {
  messages: {},
  pagination: {},
  loading: false,
  error: null,
};

// Async thunk to fetch messages for a specific chat
export const fetchMessages = createAsyncThunk<
  { chatId: string; messages: Message[]; pagination: Pagination },
  { chatId: string; page?: number; limit?: number },
  { rejectValue: ErrorResponse }
>(
  'messages/fetchMessages',
  async ({ chatId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const data: GetMessagesResponse = await fetchMessagesAPI(chatId, page, limit);
      return { chatId, messages: data.messages, pagination: data.pagination };
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
  }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk<
  Message,
  SendMessagePayload,
  { rejectValue: ErrorResponse }
>(
  'messages/sendMessage',
  async ({ chatId, content, type, media }, { rejectWithValue }) => {
    try {
      const message: Message = await sendMessageAPI(chatId, content, type, media);
      return message;
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
  }
);

// Async thunk to delete multiple messages
export const deleteMessages = createAsyncThunk<
  { chatId: string; messageIds: string[] }, // Updated return type to include an array of message IDs
  { chatId: string; messageIds: string[] }, // Updated input type to include an array of message IDs
  { rejectValue: ErrorResponse }
>(
  'messages/deleteMessages', // Updated action type
  async ({ chatId, messageIds }, { rejectWithValue }) => {
    try {
      // Assuming you have a deleteMessagesAPI that can handle batch deletions
      await deleteMessagesAPI(chatId, messageIds);
      return { chatId, messageIds }; // Return the chat ID and array of message IDs
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
  }
);


// Define the slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].unshift(action.payload);
    },
    markMessageAsRead: (state, action: PayloadAction<{ chatId: string; messageId: string; userId: string }>) => {
      const { chatId, messageId, userId } = action.payload;
      const message = state.messages[chatId]?.find(msg => msg._id === messageId);
      if (message && !message.readBy.includes(userId)) {
        message.readBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{ chatId: string; messages: Message[]; pagination: Pagination }>) => {
        const { chatId, messages, pagination } = action.payload;
        state.messages[chatId] = messages;
        state.pagination[chatId] = pagination;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors.map(error => error.msg).join(', ')
          : 'Failed to fetch messages.';
      })
      
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        const message = action.payload;
        const { chatId } = message;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].unshift(message);
        state.loading = false;
        state.error = null;
        if (state.pagination[chatId]) {
          state.pagination[chatId].totalMessages += 1;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors.map(error => error.msg).join(', ')
          : 'Failed to send message.';
      })

      .addCase(deleteMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessages.fulfilled, (state, action: PayloadAction<{ chatId: string; messageIds: string[] }>) => {
        const { chatId, messageIds } = action.payload;
        
        // Filter out all messages with IDs in the messageIds array
        state.messages[chatId] = state.messages[chatId].filter(message => !messageIds.includes(message._id));
        state.loading = false;
        state.error = null;
        
        // Update pagination
        if (state.pagination[chatId]) {
          state.pagination[chatId].totalMessages -= messageIds.length;
        }
      })
      .addCase(deleteMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors
          ? action.payload.errors.map(error => error.msg).join(', ')
          : 'Failed to delete messages.';
      })

      .addCase(logoutSuccess, (state) => {
        state.messages = {};
        state.pagination = {};
        state.loading = false;
        state.error = null;
      });
  },
});

// Export actions and reducer
export const { addMessage, markMessageAsRead } = messageSlice.actions;
export default messageSlice.reducer;
