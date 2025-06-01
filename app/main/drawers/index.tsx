
// ~/screens/Home.tsx

import React, { useLayoutEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  findNodeHandle,
  Dimensions,
} from 'react-native';
import { useAppSelector } from '~/redux/store';
import LogoutButton from '~/components/LogoutButton';
import ChatList from '~/components/ChatList';
import SearchModal from '~/components/SearchModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { getThemeColors } from '~/utils/themeColorsControl';
import OptionsMenu from '~/components/trippledotOptions';
import { useChatContext } from '~/contexts/ChatContext'; // Import the ChatContext

const { width: screenWidth } = Dimensions.get('window');

const Home: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  
  // Access selected chats from context
  const { selectedChats, clearSelectedChats, deleteSelectedChats } = useChatContext();
  const navigation = useNavigation();
  
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const tripleDotRef = useRef<TouchableOpacity | null>(null);

  // Get theme colors
  const {
    statusBarStyle,
    statusBarBgColor,
    textColor,
    backgroundColor,
    subTextColor,
    iconColor,
    headerTintColor,
  } = getThemeColors();

  // Handle Menu Press
  const handleMenuPress = () => {
    if (tripleDotRef.current) {
      const handle = findNodeHandle(tripleDotRef.current);
      if (handle) {
        tripleDotRef.current.measure((fx, fy, width, height, px, py) => {
          if (px !== undefined && py !== undefined) {
            setMenuPosition({ x: px + width, y: py + height });
            setMenuVisible(true);
          } else {
            console.warn('Failed to measure Options button position');
          }
        });
      } else {
        console.warn('Unable to find node handle for Options button');
      }
    }
  };

// Inside the useLayoutEffect for setting header options
useLayoutEffect(() => {
  navigation.setOptions({
      headerLeft: () => (
          selectedChats.length > 0 ? ( // Check if there are selected chats
              <TouchableOpacity
                  onPress={clearSelectedChats}
                  style={styles.headerButton}
                  accessibilityLabel="Back"
                  accessibilityRole="button"
              >
                  <MaterialIcons name="arrow-back" size={24} color={iconColor} />
              </TouchableOpacity>
          ) : (
              <TouchableOpacity
                  onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                  style={styles.headerButton}
                  accessibilityLabel="Open Drawer"
                  accessibilityRole="button"
              >
                  <MaterialIcons name="menu" size={24} color={iconColor} />
              </TouchableOpacity>
          )
      ),
      headerRight: () => (
        <View style={[styles.headerRightContainer, selectedChats.length > 0 ? ({  justifyContent: 'space-between'}) :({ justifyContent: 'flex-end' })]}>

              {selectedChats.length > 0 && ( // Show the count of selected chats
                  <Text style={[styles.selectedCount, { color: iconColor }]}>
                      {selectedChats.length}
                  </Text>
              )}
              {/* Render delete button only if there are selected chats */}
              {selectedChats.length > 0 && ( // Only show delete icon if there are selected chats
                  <TouchableOpacity
                      onPress={deleteSelectedChats}
                      style={styles.headerButton}
                      accessibilityLabel="Delete Selected Chats"
                      accessibilityRole="button"
                  >
                      <MaterialIcons name="delete" size={24} color={'red'} />
                  </TouchableOpacity>
              )}
              {
                selectedChats.length === 0 && (
                <TouchableOpacity
                    onPress={() => setSearchModalVisible(true)}
                    style={styles.headerButton}
                    accessibilityLabel="Search"
                    accessibilityRole="button"
                >
                    <MaterialIcons name="search" size={24} color={iconColor} />
                </TouchableOpacity>
                )}
              <TouchableOpacity
                  ref={tripleDotRef}
                  onPress={handleMenuPress}
                  style={styles.headerButton}
                  accessibilityLabel="Options"
                  accessibilityRole="button"
              >
                  <MaterialIcons name="more-vert" size={24} color={iconColor} />
              </TouchableOpacity>
          </View>
      ),
      headerStyle: {
          backgroundColor: statusBarBgColor,
      },
      headerTintColor: headerTintColor,
  });
}, [navigation, statusBarBgColor, iconColor, selectedChats]); // Add selectedChats to dependencies

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} >
      <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBgColor} />

      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor, fontSize: 20 }]}>Chats</Text>
        <Text style={[styles.subtitle, { color: subTextColor, fontSize: 16 }]}>
          {`Welcome ${user?.username}`}
        </Text>
      </View>

      <View style={styles.chatListContainer}>
        <ChatList />
      </View>

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={(query, type) => console.log('Search Query:', query, 'Type:', type)}
      />

      {/* Options Menu */}
      <OptionsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onOptionSelect={(option: string) => {
          console.log('Selected Option:', option);
          // Implement actions based on the selected option
          setMenuVisible(false); // Close the menu after selection
        }}
        position={menuPosition} // Pass the calculated position to the modal
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 0,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
  },
  chatListContainer: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  
  },
  headerButton: {
    paddingHorizontal: 8,
    
  },
  selectedCount: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 16,
  },
});

export default Home;
