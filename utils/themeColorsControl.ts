
// ~/utils/themeUtils.ts

import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";

interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  subTextColor: string;
  drwr_prfl_sec_bg: string;
  statusBarStyle: "light-content" | "dark-content";
  statusBarBgColor: string;
  headerTintColor: string;
  headerBackgroundColor: string;
  themeIconColor: string;
  activityIndicatorColor: string;
  chatNameColor: string;
  lastMessageColor: string;
  messageTimeColor: string;
  senderMessageBgColor: string;
  receiverMessageBgColor: string;
  
  errorTextColor: string;
  modalBackgroundColor: string;
  buttonBackgroundColor: string;
  buttonDisabledColor: string;
  buttonTextColor: string;
  logoutButtonColor: string;
  inputBorderColor: string;
  inputPlaceholderColor: string;
  cancelButtonColor: string;
  groupAvatarBackgroundColor: string;
  singleAvatarBackgroundColor: string;
  avatarSenderBackgroundColor: string;
  avatarReceiverBackgroundColor: string;
  messageInputBorderTopColor: string;
  selectedChatBackgroundColor: string;

  // New Colors
  inputBgColor: string; // Background color for input fields
  buttonBgColor: string; // Background color for buttons

  // Additional colors for Drawer
  drawerBackgroundColor: string;
  drawerLabelColor: string;
  drawerActiveBackgroundColor: string;
  drawerInactiveBackgroundColor: string;
  drawerActiveLabelColor: string;
  drawerInactiveLabelColor: string;

  inboxInputFieldsBackgroundColor: string;

  systemNavigationBarColor: string;
}

export const getThemeColors = (): ThemeColors => {
  const { mode } = useSelector((state: RootState) => state.theme);

  return {
    // Status Bar
    statusBarStyle: mode === 'dark' ? 'light-content' : 'dark-content',
    statusBarBgColor: mode === 'dark' ? '#111827' : '#94A3B8',

    // Header Tint Color
    headerTintColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',
    headerBackgroundColor: mode === 'dark' ? '#111827' : '#94A3B8',

    // Background Colors
    backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
    drwr_prfl_sec_bg: mode === 'dark' ? '#111827' : '#94A3B8',

    // Icon colors
    iconColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',
    themeIconColor: mode === 'dark' ? '#FFD700' : '#000000',

    // Text Colors
    textColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',
    subTextColor: mode === 'dark' ? '#D1D5DB' : '#6B7280',
    chatNameColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',
    lastMessageColor: mode === 'dark' ? '#9CA3AF' : '#555555',
    messageTimeColor: mode === 'dark' ? '#cccccc' : '#888888',
    senderMessageBgColor: mode === 'dark' ? '#2A2E32' : '#D4F7C5', // Slightly brighter green for better readability
    receiverMessageBgColor: mode === 'dark' ? '#353A3E' : '#EAEABA', // Softer yellow in light mode

    // Group Avatar Background Color
    groupAvatarBackgroundColor: mode === 'dark' ? '#3B82F6' : '#3B82F6',

    // Single Avatar Background Color
    singleAvatarBackgroundColor: mode === 'dark' ? '#10B981' : '#10B981',

    // Activity Indicator color
    activityIndicatorColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',

    // Error Text Color
    errorTextColor: mode === 'dark' ? '#F87171' : '#EF4444',

    // Modal Colors
    modalBackgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',

    // Button Colors
    buttonBackgroundColor: mode === 'dark' ? '#3B82F6' : '#1D4ED8',
    buttonDisabledColor: mode === 'dark' ? '#4B5563' : '#D1D5DB',
    buttonTextColor: '#FFFFFF', // Always white for contrast

    // Logout Button Color
    logoutButtonColor: mode === 'dark' ? '#ff5a5a' : '#ff4d4d',

    // Input Colors
    inputBorderColor: mode === 'dark' ? '#374151' : '#D1D5DB',
    inputPlaceholderColor: mode === 'dark' ? '#6B7280' : '#A1A1AA',
    messageInputBorderTopColor:  mode === 'dark' ? '#444' : '#ddd',

    // Cancel Button Color
    cancelButtonColor: mode === 'dark' ? '#6B7280' : '#4B5563',

    // Drawer Colors
    drawerBackgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
    drawerLabelColor: mode === 'dark' ? '#F3F4F6' : '#1F2937',
    drawerActiveBackgroundColor: mode === 'dark' ? '#374151' : '#E5E7EB',
    drawerInactiveBackgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
    drawerActiveLabelColor: mode === 'dark' ? '#FFFFFF' : '#1F2937',
    drawerInactiveLabelColor: mode === 'dark' ? '#9CA3AF' : '#6B7280',

    // chat color assignments
    selectedChatBackgroundColor : mode === 'dark' ? '#333' : '#B0C4DE',

    // New Color Assignments
    avatarSenderBackgroundColor: mode === 'dark' ? '#4A4F52' : '#D0E8D5', // Subtle green-gray for sender in light mode, dark gray in dark mode
    avatarReceiverBackgroundColor: mode === 'dark' ? '#484B4E' : '#E8E5D0', // Soft beige-gray for receiver in light mode, dark gray in dark mode
    // avatarBackgroundColor: mode === 'dark' ? '#404040' : '#DADADA', // Neutral gray tones for balanced contrast in both modes
    inputBgColor: mode === 'dark' ? '#2A2A2A' : '#F5F5F5', // Dark and light input backgrounds
    buttonBgColor: mode === 'dark' ? '#0056b3' : '#007BFF', // Dark and light button backgrounds
    
    inboxInputFieldsBackgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',

    // system navigation bar 
    systemNavigationBarColor: mode === 'dark' ? '#1a2332' : '#F1F5F9',



  };
};
