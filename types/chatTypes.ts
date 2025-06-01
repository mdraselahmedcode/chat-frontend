// src/types/chatTypes.ts

import { Message } from "./messageTypes";

export interface ChatParticipant {
    _id: string;
    username: string;
    avatar: string;
    // Add other relevant fields
  }
  
  export interface Chat {
    _id: string;
    name: string;
    isGroupChat: boolean;
    participants: ChatParticipant[];
    latestMessage: Message | null;
    createdAt: string;
    // Add other relevant fields
  }
  