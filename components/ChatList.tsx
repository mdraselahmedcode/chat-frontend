
// ~/components/ChatList.tsx

import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { RootState, useAppDispatch, useAppSelector } from '~/redux/store';
import { fetchUserChats, setCurrentChatId } from '~/redux/slices/chatSlice';
import { Chat } from '~/types/chatTypes';
import { getToken } from '~/utils/authStorage';
import { USER_TOKEN_KEY } from '~/utils/constraints';
import { formatDistanceToNow } from 'date-fns';
import { getThemeColors } from '~/utils/themeColorsControl';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import ChatLongPressOptionsModal from './modals/ChatLongPressOptionsModal';
import { useChatContext } from '~/contexts/ChatContext'; // Import the context

const ChatList: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, chats } = useAppSelector((state: RootState) => state.chats);
  const currentUserId = useAppSelector((state: RootState) => state.auth.user?._id);
  const { selectedChats, toggleSelectChat, clearSelectedChats } = useChatContext(); // Use context

  const [chatModalVisible, setChatModalVisible] = useState<boolean>(false);

  const {
    textColor,
    backgroundColor,
    selectedChatBackgroundColor,
    errorTextColor,
    iconColor,
    groupAvatarBackgroundColor,
    singleAvatarBackgroundColor,
    chatNameColor,
    lastMessageColor,

  } = getThemeColors();

  useEffect(() => {
    async function fetchChatList() {
      const token = await getToken(USER_TOKEN_KEY);
      if (token) {
        dispatch(fetchUserChats(token));
      } else {
        console.error('No token found');
      }
    }
    fetchChatList();
  }, [dispatch]);

  const handleLongPressChat = (item: Chat) => {
    toggleSelectChat(item._id); // Use context method to toggle selection
    // setChatModalVisible(true);
  };

  const handleDeleteChat = () => {
    console.log('selected chats', selectedChats);
    // setChatModalVisible(false);
    clearSelectedChats(); // Clear selections after deletion
  };

  if (loading) return <ActivityIndicator size="large" color={textColor} />;
  if (error) return <Text style={[styles.errorText, { color: errorTextColor }]}>{error}</Text>;

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedChats.includes(item._id);
    let chatName = 'Unnamed Chat';
    let avatarUrl = '';
    let latestMessageTime = '';
    let isGroup = item.isGroupChat;

    if (isGroup) {
      chatName = item.name || 'Unnamed Group';
    } else {
      const otherParticipant = item.participants.find(
        (p) => p._id !== currentUserId
      );
      if (otherParticipant) {
        chatName = otherParticipant.username;
        avatarUrl = otherParticipant.avatar;
      }
    }

    if (item.latestMessage) {
      latestMessageTime = formatDistanceToNow(new Date(item.latestMessage.createdAt), {
        addSuffix: true,
      });
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.chatItem, {
          backgroundColor: isSelected ? selectedChatBackgroundColor : backgroundColor,
        }]}
        onLongPress={() => handleLongPressChat(item)}
        onPress={() => {
          if (selectedChats.length > 0) {
            toggleSelectChat(item._id); // Toggle selection
          } else {
            dispatch(setCurrentChatId(item._id));
            router.push(`/main/chat/${item._id}` as Href<`/main/chat/${string}`>);
          }
        }}
        accessibilityLabel={`Chat with ${chatName}`}
        accessibilityRole="button"
      >
        <View style={styles.avatarContainer}>
          {isGroup ? (
            avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.defaultAvatar, { backgroundColor: groupAvatarBackgroundColor }]} >
                <MaterialIcons name="group" size={24} color={iconColor} />
              </View>
            )
          ) : (
            <>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.defaultAvatar, { backgroundColor: singleAvatarBackgroundColor }]} >
                  <MaterialIcons name="person" size={24} color={iconColor} />
                </View>
              )}
              {isSelected && (
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color="green"
                  style={styles.checkmark}
                />
              )}
            </>
          )}
        </View>

        <View style={[styles.chatInfo,  ]}>
          <Text style={[styles.chatName, { color: chatNameColor } ]}>{chatName}</Text>
          {item.latestMessage ? (
            <View style={[styles.messageInfo, ]}>
              <Text style={[styles.lastMessage, { color: lastMessageColor } ]}>
                {item.latestMessage.content.length > 20
                  ? `${item.latestMessage.content.slice(0, 20)}...`
                  : item.latestMessage.content}
              </Text>
              <Text style={[styles.messageTime, { color: lastMessageColor } ]}>
                {latestMessageTime}
              </Text>
            </View>
          ) : (
            <Text style={[styles.lastMessage, {color: lastMessageColor}]}>No conversations to display yet. Start chatting!</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
      {/* <ChatLongPressOptionsModal
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
        onDelete={handleDeleteChat}
        selectedChats={selectedChats} // Keep this as it is to pass the selected IDs
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  chatList: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  checkmark: {
    position: 'absolute',
    bottom: 0,
    right: -6,
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  messageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4, //
  },
  lastMessage: {
    fontSize: 14,
    // maxWidth: '75%',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});

export default ChatList;
