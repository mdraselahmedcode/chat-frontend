// components/chatHeaderInside.tsx

import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { selectCurrentChat } from '~/redux/slices/chatSlice';
import { useAppSelector } from '~/redux/store';
import { getThemeColors } from '~/utils/themeColorsControl';

const ChatHeaderInside: React.FC = () => {
  // Select the current chat from the Redux store
  const currentChat = useAppSelector(selectCurrentChat);
  
  // Select the current user from the Redux store
  const { user } = useAppSelector((state) => state.auth);
  
  // Get theme colors
  const {
    avatarReceiverBackgroundColor,
    textColor,
  } = getThemeColors();

  // Optional: Log current chat details for debugging
  useEffect(() => {
    console.log('Current chat details:', currentChat);
  }, [currentChat]);

  // Determine what to display based on whether it's a group chat
  let headerTitle = 'Chat';
  let headerAvatar = '';
  let isGroupChat = false;

  if (currentChat) {
    isGroupChat = currentChat.isGroupChat;
    if (isGroupChat) {
      // For group chats, use the group name
      headerTitle = currentChat.name;
      // Optionally, set a group avatar if available
      // headerAvatar = currentChat.groupAvatar; // Uncomment and use if groupAvatar exists
    } else {
      // For one-on-one chats, find the chat partner
      const chatPartner = currentChat.participants.find(participant => participant._id !== user?._id);
      if (chatPartner) {
        headerTitle = chatPartner.username;
        headerAvatar = chatPartner.avatar;
      }
    }
  }

  return (
    <View style={styles.container}>
      {headerAvatar ? (
        <Image source={{ uri: headerAvatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.defaultAvatar, { backgroundColor: avatarReceiverBackgroundColor }]}>
          <Text style={styles.avatarText}>{headerTitle.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={[styles.username, { color: textColor }]}>{headerTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatHeaderInside;
