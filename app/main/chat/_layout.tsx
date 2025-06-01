
import React, { useEffect, useState } from 'react';
import { Stack, usePathname, useSegments } from 'expo-router';
import { getThemeColors } from '~/utils/themeColorsControl';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, Modal, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import ChatHeaderInside from '~/components/chatHeaderInside';
import { RootState, useAppSelector } from '~/redux/store';

const ChatLayout: React.FC = () => {
  const { headerBackgroundColor, headerTintColor } = getThemeColors();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { mode } = useAppSelector((state: RootState) => state.theme);

  const {
    systemNavigationBarColor,

  } = getThemeColors();
  




  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleBlockUser = () => {
    // Implement block functionality
    console.log("User blocked");
    handleCloseModal();
  };

  const handleChatDelete = () => {
    // Implement delete functionality
    console.log("User deleted");
    handleCloseModal();
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: headerBackgroundColor,
          },
          headerTintColor: headerTintColor,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color={headerTintColor} />
            </TouchableOpacity>
          ),
          headerTitle: () => <ChatHeaderInside />,
          headerRight: () => (
            <TouchableOpacity onPress={handleOpenModal} style={{ paddingRight: 10 }}>
              <MaterialIcons name="more-vert" size={24} color={headerTintColor} />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="[chatId]" />
      </Stack>

      {/* Modal for options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable onPress={handleBlockUser} style={styles.optionButton}>
              <Text style={styles.optionText}>Block User</Text>
            </Pressable>
            <Pressable onPress={handleChatDelete} style={styles.optionButton}>
              <Text style={styles.optionText}>Delete Chat</Text>
            </Pressable>
            <Pressable onPress={handleCloseModal} style={styles.optionButton}>
              <Text style={styles.optionText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default ChatLayout;
