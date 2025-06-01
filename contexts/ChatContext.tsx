import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppDispatch } from '~/redux/store';
import { deleteChat } from '~/redux/slices/chatSlice';

interface ChatContextProps {
  selectedChats: string[];
  toggleSelectChat: (chatId: string) => void;
  clearSelectedChats: () => void;
  deleteSelectedChats: () => void; // Expose delete function
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch(); // Move dispatch here to use it in the provider
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  // Log selectedChats whenever it changes
  useEffect(() => {
    console.log('Selected Chats from ChatContext :', selectedChats);
  }, [selectedChats]);

  const toggleSelectChat = (chatId: string) => {
    setSelectedChats((prevChats) =>
      prevChats.includes(chatId)
        ? prevChats.filter((id) => id !== chatId)
        : [...prevChats, chatId]
    );
  };

  const clearSelectedChats = () => {
    setSelectedChats([]);
  };

  const deleteSelectedChats = () => {
    dispatch(deleteChat(selectedChats)); // Dispatch delete action with selected IDs
    clearSelectedChats(); // Clear selected chats after deletion
  };

  return (
    <ChatContext.Provider value={{ selectedChats, toggleSelectChat, clearSelectedChats, deleteSelectedChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
