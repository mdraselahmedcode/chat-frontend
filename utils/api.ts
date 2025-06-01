


// src/utils/api.ts

import axios from 'axios';
import { BASE_URL } from '~/config/baseurl';
import { User } from '~/types/all_types';
import { Chat } from '~/types/chatTypes';
import { GetMessagesResponse, Message, MessageType, MediaFile } from '~/types/messageTypes';
import { ErrorResponse } from '~/types/all_types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './authStorage';
import { USER_TOKEN_KEY } from './constraints';

// Create an Axios instance without the global 'Content-Type' header
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    // 'Content-Type': 'application/json', // Removed to allow Axios to set it based on the request
  },
  withCredentials: true,
  timeout: 10000,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken(USER_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to fetch user data
export const fetchUserDataAPI = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      timeout: 10000,
    });
    return response.data as User;
  } catch (error) {
    throw error;
  }
};

// **Chat API Functions**

// Fetch all chats for the authenticated user
export const fetchUserChatsAPI = async (token: string): Promise<Chat[]> => {
  try {
    const response = await axios.get<{ success: boolean; chats: Chat[] }>(`${BASE_URL}/api/v1/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      timeout: 10000,
    });
    if (response.data.success) {
      return response.data.chats as Chat[];
    } else {
      throw new Error('Failed to fetch chats.');
    }
  } catch (error) {
    throw error;
  }
};

// Create or fetch a one-on-one chat
export const createOneOnOneChatAPI = async (userId: string): Promise<Chat> => {
  try {
    const response = await api.post<{ success: boolean; chat: Chat }>('/api/v1/chats/one-on-one', { userId });
    if (response.data.success) {
      return response.data.chat;
    } else {
      throw new Error('Failed to create or fetch chat.');
    }
  } catch (error) {
    throw error;
  }
};

// Create a group chat
export const createGroupChatAPI = async (name: string, userIds: string[]): Promise<Chat> => {
  try {
    const response = await api.post<{ success: boolean; chat: Chat }>('/api/v1/chats/group', { name, userIds });
    if (response.data.success) {
      return response.data.chat;
    } else {
      throw new Error('Failed to create group chat.');
    }
  } catch (error) {
    throw error;
  }
};




// Function to delete multiple chats
export const deleteChatsAPI = async (chatIds: string[]): Promise<{ success: boolean; deletedChatIds: string[] }> => {
  try {
    // Make a DELETE request to the server, passing chatIds in the request body
    const response = await api.delete<{ success: boolean; deletedChatIds: string[] }>('/api/v1/chats', {
      data: { chatIds }, // Sending the chat IDs in the request body
    });

    if (response.data.success) {
      return response.data; // Return the response if the deletion is successful
    } else {
      throw new Error('Failed to delete chats.'); // Handle the case where deletion fails
    }
  } catch (error) {
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      // Check if the error is an Axios error
      if (error.response) {
        // Return a more specific error message from the response
        throw new Error(error.response.data.message || 'Failed to delete chats due to server error.');
      } else if (error.request) {
        // No response received from server
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Other unexpected errors
        throw new Error('An unexpected error occurred: ' + error.message);
      }
    } else if (error instanceof Error) {
      // Handle non-Axios errors, but still instances of Error
      throw new Error('An unexpected error occurred: ' + error.message);
    } else {
      // Fallback for unknown errors
      throw new Error('An unexpected error occurred.');
    }
  }
};



// Send a message (with optional media and type)
export const sendMessageAPI = async (
  chatId: string,
  content: string,
  type: MessageType,
  media?: MediaFile
): Promise<Message> => {
  try {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('content', content);
    formData.append('type', type);

    if (media) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'audio/m4a',
        'audio/mpeg',
        'audio/wav',
        'video/mp4', // Add video type here
        'video/x-msvideo', // Add more video formats as needed
        'video/quicktime' // Add more video formats as needed
      ];

      if (!allowedTypes.includes(media.type)) {
        throw new Error('Unsupported media type.');
      }

      // Append media correctly for React Native with type casting
      formData.append('media', {
        uri: media.uri,
        name: media.name || 'media',
        type: media.type,
      } as any);
    }

    const apiResponse = await api.post<{ success: boolean; message: Message }>('/api/v1/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Optional: Axios sets this automatically
      },
    });

    if (apiResponse.data.success) {
      return apiResponse.data.message;
    } else {
      throw new Error('Failed to send message.');
    }
  } catch (error: any) {
    // Enhanced error logging
    if (error.response) {
      console.error('Backend Error:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to send message.');
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error('No response from server. Please check your network.');
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
};






// Fetch messages for a specific chat with pagination
export const fetchMessagesAPI = async (chatId: string, page: number = 1, limit: number = 50): Promise<GetMessagesResponse> => {
  try {
    const response = await api.get<GetMessagesResponse>(`/api/v1/messages/${chatId}`, {
      params: { page, limit },
    });
    // Directly return response.data as it now matches GetMessagesResponse
    // console.log('from api response: ', response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};



// Delete message API call for batch deletion
export const deleteMessagesAPI = async (chatId: string, messageIds: string[]): Promise<void> => {
  try {
    const token = await getToken(USER_TOKEN_KEY);
    console.log('api print', chatId, messageIds);
    
    // Use a single endpoint for batch deletion, assuming it's defined in your API
    await api.delete<void>(`/api/v1/messages/delete/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { messageIds }, // Pass the array of message IDs in the request body
    });

    // Log a success message if needed
    console.log(`Messages with IDs ${messageIds.join(', ')} deleted successfully from chat ${chatId}`);
  } catch (error) {
    // Handle errors (optional logging)
    console.error("Error deleting messages:", error);
    throw error;
  }
};



export default api;





