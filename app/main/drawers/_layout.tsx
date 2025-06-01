import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '~/components/CustomDrawerContent';
import { getThemeColors } from '~/utils/themeColorsControl';
import { useAppSelector } from '~/redux/store'; // Import custom hook
import * as NavigationBar from 'expo-navigation-bar';
import { usePathname, useRouter, useSegments } from 'expo-router';



const screenWidth = Dimensions.get('window').width;

const MainLayout: React.FC = () => {

  const { mode } = useAppSelector((state) => state.theme);
  const segments = useSegments();
  const router = useRouter();
  const pathName = usePathname();

  const {
    drawerBackgroundColor,
    drawerLabelColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
    drawerActiveLabelColor,
    drawerInactiveLabelColor,
    headerBackgroundColor,
    iconColor, // Get icon color from theme colors
    systemNavigationBarColor,

  } = getThemeColors();

  



  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName='index'
        screenOptions={{
          drawerStyle: {
            width: screenWidth * 0.85 , // Drawer width set to 75% of screen width
            backgroundColor: drawerBackgroundColor,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: drawerLabelColor,
          },
          drawerItemStyle: styles.drawerItem, // Apply custom styles
          drawerActiveTintColor: drawerActiveLabelColor,
          drawerInactiveTintColor: drawerInactiveLabelColor,
          drawerActiveBackgroundColor: drawerActiveBackgroundColor,
          drawerInactiveBackgroundColor: drawerInactiveBackgroundColor,
          headerTintColor: iconColor, // Use dynamic icon color in header
          headerStyle: {
            backgroundColor: headerBackgroundColor, // Example: static color; you can make it dynamic too
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Chats',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={iconColor} size={size} style={styles.drawerIcon} /> // Use dynamic icon color
            ),
          }}
        />
          <Drawer.Screen
            name="myProfile"
            options={{
              drawerLabel: 'Profile',
              title: 'User Profile',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={iconColor} size={size} style={styles.drawerIcon} /> // Use dynamic icon color
              ),
            }}
          />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="settings" color={iconColor} size={size} style={styles.drawerIcon} /> // Use dynamic icon color
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

// Styles for adjusting padding and margins between the icon and label
const styles = StyleSheet.create({
  drawerItem: {
    paddingLeft: 0, // Adjust padding left to reduce gap between icon and label
    marginVertical: 0, // Reduce vertical margin if needed
  },
  drawerIcon: {
    marginRight: -10, // Move the icon closer to the label by reducing the right margin
  },
});

export default MainLayout;
