
import React, { createContext, useState, useContext } from 'react';
import { deleteMessages } from '~/redux/slices/messageSlice';
import { useAppDispatch, useAppSelector } from '~/redux/store';

interface MessageContextType {
  selectedMessageIds: string[];
  selectedMessageSenderIds: string[];
  toggleMessageSelection: (messageId: string, messageSenderId: string) => void;
  clearSelections: () => void;
  handleDeleteSelectedMessages: (chatIdString: string) => void;
  deleteForEveryone: boolean;
  isSelectionMode: boolean;
  isFullVideoScreen: boolean;  // New state
  // setIsFullVideoScreen: (isFull: boolean) => void;  // New setter
  setIsFullVideoScreen: React.Dispatch<React.SetStateAction<boolean>>; // Add this
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [selectedMessageSenderIds, setSelectedMessageSenderIds] = useState<string[]>([]);
  const [deleteForEveryone, setDeleteForEveryone] = useState<boolean>(true);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isFullVideoScreen, setIsFullVideoScreen] = useState<boolean>(false); // New state

  const senderId = user?._id;

  const toggleMessageSelection = (messageId: string, messageSenderId: string) => {
    setSelectedMessageIds((prevSelectedIds) => {
      const updatedSelection = prevSelectedIds.includes(messageId)
        ? prevSelectedIds.filter((id) => id !== messageId)
        : [...prevSelectedIds, messageId];

      setIsSelectionMode(updatedSelection.length > 0);
      return updatedSelection;
    });

    setSelectedMessageSenderIds((prevSelectedSenderIds) => {
      const updatedSenderSelection = prevSelectedSenderIds.includes(messageSenderId)
        ? prevSelectedSenderIds.filter((id) => id !== messageSenderId)
        : [...prevSelectedSenderIds, messageSenderId];

      const allFromCurrentUser = updatedSenderSelection.every(id => id === senderId);
      setDeleteForEveryone(allFromCurrentUser);

      return updatedSenderSelection;
    });
  };

  const clearSelections = () => {
    setSelectedMessageIds([]);
    setSelectedMessageSenderIds([]);
    setDeleteForEveryone(true);
    setIsSelectionMode(false);
  };

  const handleDeleteSelectedMessages = (chatIdString: string) => {
    if (selectedMessageIds.length > 0) {
      dispatch(deleteMessages({ chatId: chatIdString, messageIds: selectedMessageIds }));
      clearSelections();
    }
  };

  return (
    <MessageContext.Provider
      value={{
        selectedMessageIds,
        selectedMessageSenderIds,
        toggleMessageSelection,
        clearSelections,
        handleDeleteSelectedMessages,
        deleteForEveryone,
        isSelectionMode,
        isFullVideoScreen,           // Provide the new state
        setIsFullVideoScreen,         // Provide the setter
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};
