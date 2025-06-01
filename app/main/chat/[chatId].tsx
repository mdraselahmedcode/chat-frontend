
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { useAppDispatch, useAppSelector } from '~/redux/store';
import { getThemeColors } from '~/utils/themeColorsControl';
import { sendMessage, fetchMessages } from '~/redux/slices/messageSlice';
import { selectCurrentChat } from '~/redux/slices/chatSlice';
import { Message } from '~/types/messageTypes';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import useMediaPicker from '../../../hooks/useMediaPicker';
import useAudioRecorder from '~/hooks/useAudioRecorder';
import VoiceMessage from '~/components/VoiceMessage';
import ImageMessage from '~/components/ImageMessage';
import VideoMessage from '~/components/VideoMessage';
// import TextMessageOptionsModal from '~/components/modals/TextMessageOptionsModal';
import * as Clipboard from 'expo-clipboard';
import { useMessageContext } from '~/contexts/MessageContext';
import { SafeAreaView } from 'react-native-safe-area-context';


import * as NavigationBar from 'expo-navigation-bar';

const ChatScreen = () => {


  const { chatId } = useLocalSearchParams();
  const chatIdString = Array.isArray(chatId) ? chatId[0] : chatId;
  
  const dispatch = useAppDispatch();
  const [messageText, setMessageText] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const { user } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  const currentChat = useAppSelector(selectCurrentChat);
  const messages: Message[] = useAppSelector(
    (state) => state.messages.messages[chatIdString] || []
  );
  const loading = useAppSelector((state) => state.messages.loading);
  const error = useAppSelector((state) => state.messages.error);
  
  const { pickMedia } = useMediaPicker(chatIdString);
  const { isRecording, startRecording, stopRecording, playSound, getDuration, pauseSound, resumeSound } = useAudioRecorder();
  const { isFullVideoScreen, selectedMessageIds, isSelectionMode, toggleMessageSelection, clearSelections, handleDeleteSelectedMessages } = useMessageContext();
  const {
    backgroundColor,
    textColor,
    inputBgColor,
    buttonBgColor,
    buttonTextColor,
    errorTextColor,
    messageTimeColor,
    senderMessageBgColor,
    receiverMessageBgColor,
    avatarSenderBackgroundColor,
    avatarReceiverBackgroundColor,
    inputBorderColor,
    messageInputBorderTopColor,
    systemNavigationBarColor,

  } = getThemeColors();



  useEffect(() => {
    if (chatIdString) {
      const fetchMessagesAsync = async () => {
        try {
          const res = await dispatch(
            fetchMessages({ chatId: chatIdString, page: 1, limit: 50 })
          ).unwrap();
        } catch (err) {
          console.error('Failed to fetch messages:', err);
        }
      };

      fetchMessagesAsync();
    }

    // Clear selections when leaving the screen
    return () => {
      clearSelections();
    };
  }, [dispatch, chatIdString]);



  

  const handleSendAudio = async () => {
    const mediaFile = await stopRecording();
    if (mediaFile) {
      dispatch(
        sendMessage({
          chatId: chatIdString,
          content: mediaFile.uri,
          type: 'voice',
          media: mediaFile,
        })
      );
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      dispatch(
        sendMessage({
          chatId: chatIdString,
          content: messageText,
          type: 'text',
        })
      );
      setMessageText('');
    }
  };

  const handleLongPressMessage = (item: Message) => {
    // console.log('item.sender' ,item.sender)
    toggleMessageSelection(item._id, item.sender._id);
    setModalVisible(true);
    setSelectedMessage(item);
  };

  const handleCopyMessage = () => {
    if (selectedMessage) {
      Clipboard.setStringAsync(selectedMessage.content);
      setModalVisible(false);
      setSelectedMessage(null);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSender = item.sender._id === user?._id;
    const isSelected = selectedMessageIds.includes(item._id);

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPressMessage(item)}
        onPress={isSelectionMode ? () => handleLongPressMessage(item) : undefined}
        activeOpacity={isSelectionMode ? 1 : 0.8}
        style={[
          styles.messageContainer,
          isSender ? styles.sender : styles.receiver,
          isSelected && styles.selectedMessageContainer, // Apply selected style if message is selected
        ]}
      >

        {!isSender &&
          (item.sender.avatar ? (
            <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[styles.defaultAvatar, { backgroundColor: avatarReceiverBackgroundColor }]}
            >
              <Text style={styles.avatarText}>
                {item.sender.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
      
        <View
          style={[
            styles.messageBox,
            item.type === 'text' && isSender ? { backgroundColor: senderMessageBgColor } : { backgroundColor: receiverMessageBgColor },
            isSelected && styles.selectedMessageBox, // Apply selected style if message is selected
          ]}
        >
          {item.type === 'image' ? (
              <ImageMessage
                uri={item.content}
                handleLongPress={() => handleLongPressMessage(item)}
              />
          ) : item.type === 'voice' ? (
            <VoiceMessage
              id={item._id}
              content={item.content}
              playSound={playSound}
              getDuration={getDuration}
              pauseSound={pauseSound}
              resumeSound={resumeSound}
              currentlyPlayingId={currentlyPlayingId}
              setCurrentlyPlayingId={setCurrentlyPlayingId}
              handleLongPress={() => handleLongPressMessage(item)}
            />
          ) : item.type === 'video' ? (
            <VideoMessage 
              uri={item.content} 
              handleLongPress={() => handleLongPressMessage(item)} 
            />
          ) : (
            <Text style={[styles.messageText, { color: textColor }]}>{item.content}</Text>
          )}
          <Text style={[styles.messageTime, { color: messageTimeColor }]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      
        {isSender &&
          (user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[styles.defaultAvatar, { backgroundColor: avatarSenderBackgroundColor }]}
            >
              <Text style={styles.avatarText}>
                {user?.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
      </TouchableOpacity>
    );
    
  };

  const keyExtractor = (item: Message) => item._id;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {loading && (
        <ActivityIndicator size="large" color={textColor} style={styles.loadingIndicator} />
      )}

      {error && (
        <Text style={[styles.errorText, { color: errorTextColor }]}>{error}</Text>
      )}

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.messageList}
        inverted
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.inputContainer, { borderColor: messageInputBorderTopColor, backgroundColor: backgroundColor }]}>
        <TouchableOpacity
          onPress={pickMedia}
          style={styles.attachButton}
        >
          <Entypo name="attachment" size={24} color={buttonBgColor} />
        </TouchableOpacity>

        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={textColor}
          style={[styles.input, { color: textColor, backgroundColor: inputBgColor }]}
        />

        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color={buttonBgColor} />
        </TouchableOpacity>

        {isRecording ? (
          <TouchableOpacity onPress={handleSendAudio} style={styles.sendButton}>
            <MaterialIcons name="stop" size={24} color={buttonBgColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording} style={styles.sendButton}>
            <MaterialIcons name="mic" size={24} color={buttonBgColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* <TextMessageOptionsModal
        visible={false}
        chatIdString
        onRequestClose={()=> setModalVisible(false)}
        handleCopyMessage={handleCopyMessage}
        handleDeleteSelectedMessages={() => handleDeleteSelectedMessages}
      /> */}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 0,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,

  },
  sender: {
    justifyContent: 'flex-end',
  },
  receiver: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBox: {
    maxWidth: '75%',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  senderMessage: {
    // backgroundColor: '#DCF8C5', //
  },
  receiverMessage: {
    // backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  attachButton: {
    padding: 10,
  },
  sendButton: {
    padding: 10,
  },
  voiceButton: {
    padding: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
  },
  messageList: {
    paddingVertical: 10,
  },


  mediaButton: {
    marginHorizontal: 5,
  },
  selectedMessageContainer: {
    backgroundColor: 'red', // or any light shade you prefer
  },
  selectedMessageBox: {
    backgroundColor: '#E0E0E0', // a distinct shade to indicate selection
  },
  

});

export default ChatScreen;












