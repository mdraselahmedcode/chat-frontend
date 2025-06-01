// src/types/messageTypes.ts

export type MessageType = 'text' | 'image' | 'voice' | 'video';

export interface MediaFile {
  uri: string;
  name: string;
  type: string;
}

export interface Sender {
  _id: string;
  username: string;
  avatar: string;
  // Add other relevant fields if necessary
}

export interface Message {
  _id: string;        // Individual message ID
  chatId: string;     // Chat ID
  sender: Sender;
  content: string;    // For text: the message text; For image: the image URI; For voice: the audio URI
  media?: string;     // URL or path to the media file (optional, depending on type)
  readBy: string[];   // Array of User IDs
  createdAt: string;  // ISO date string
  type: MessageType;  // Type of the message
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalMessages: number;
}

export interface GetMessagesResponse {
  success: boolean; // You may need this if you're checking for success in your API call
  messages: Message[];
  pagination: Pagination;
}

export interface SendMessagePayload {
  chatId: string;
  content: string;
  type: MessageType; // 'text' | 'image' | 'voice' | 'video'
  media?: MediaFile; // Optional: MediaFile object for media messages
}

