// // useMessageActions.ts
// import { useAppDispatch } from '~/redux/store';
// import { useCallback } from 'react';
// import Clipboard from '@react-native-clipboard/clipboard';
// import { deleteMessage, unsendMessage } from '~/redux/slices/messageSlice';
// import { Message } from '~/types/messageTypes';

// const useMessageActions = (setModalVisible: (visible: boolean) => void, setSelectedMessage: (message: Message | null) => void) => {
//   const dispatch = useAppDispatch();

//   const copyMessage = useCallback((content: string) => {
//     Clipboard.setString(content);
//     setModalVisible(false);
//   }, [setModalVisible]);

//   const deleteMessageById = useCallback((messageId: string) => {
//     dispatch(deleteMessage(chatId, messageId) : (chatId: string, messageId: string));
//     setModalVisible(false);
//     setSelectedMessage(null);
//   }, [dispatch, setModalVisible, setSelectedMessage]);

//   const unsendMessageById = useCallback((messageId: string) => {
//     dispatch(unsendMessage(messageId));
//     setModalVisible(false);
//     setSelectedMessage(null);
//   }, [dispatch, setModalVisible, setSelectedMessage]);

//   const forwardMessage = useCallback(() => {
//     // Logic for forwarding the message
//     setModalVisible(false);
//     setSelectedMessage(null);
//   }, [setModalVisible, setSelectedMessage]);

//   return {
//     copyMessage,
//     deleteMessageById,
//     unsendMessageById,
//     forwardMessage,
//   };
// };

// export default useMessageActions;















