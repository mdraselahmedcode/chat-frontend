
// src/_layout.tsx

import { Slot, Stack, useSegments } from "expo-router";
import React from "react";
import '../global.css';
import store, { persistor, RootState, useAppSelector } from "~/redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { router } from "expo-router";
import { getToken } from "~/utils/authStorage";
import { USER_TOKEN_KEY } from "~/utils/constraints";
import { isTokenExpired } from "~/utils/tokenUtils"; // Add the token expiration utility function
import { logoutSuccess } from "~/redux/slices/authSlice"; // Import logoutSuccess action
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Drawer from "expo-router/drawer";
import { ChatProvider } from "~/contexts/ChatContext";
import { MessageProvider } from "~/contexts/MessageContext";
import * as NavigationBar from 'expo-navigation-bar';
import { usePathname, useRouter, } from 'expo-router';
import { getThemeColors } from "~/utils/themeColorsControl";

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const { mode } = useAppSelector((state: RootState) => state.theme);
  const pathName = usePathname();
  

  let segments = useSegments();
  console.log('segment', segments[0]);

  const {
    systemNavigationBarColor,

  } = getThemeColors();

  // useEffect(() => {
  //   async function updateNavigationBar() {
  //       await NavigationBar.setPositionAsync('relative')
  //       await NavigationBar.setBackgroundColorAsync(systemNavigationBarColor)
  //       await NavigationBar.setVisibilityAsync('visible')
  //       // await NavigationBar.setBehaviorAsync('overlay-swipe')
  //       await NavigationBar.setButtonStyleAsync(mode === 'dark' ? 'light' : 'dark');
  //       const navigationBorderColor = await NavigationBar.getBorderColorAsync();

        
  //       const isVisible = await NavigationBar.getVisibilityAsync();
  //       const color = await NavigationBar.getBackgroundColorAsync();
  //       const behavior = await NavigationBar.getBehaviorAsync()
  //       console.log(pathName)
  //       console.log(isVisible);
  //       console.log(color);
  //       console.log(behavior)
  //       console.log(navigationBorderColor)
  //       console.log(mode)

  //   }
  //   updateNavigationBar();
  // }, [mode,segments]);


  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getToken(USER_TOKEN_KEY);

      // Check if the token is expired
      if (token && (await isTokenExpired())) {
        console.log("Token expired, logging out...");
        dispatch(logoutSuccess()); // Dispatch logout action if token is expired
        if (segments[0] === 'main') {
          router.replace('/auth/login');
        } else {
          router.replace('/auth/landingpage');
        }
        return;
      }

      // If token exists and user is authenticated
      if (isAuthenticated && user?.token && token) {
        router.replace('/main/drawers/');
        // console.log('User: => ', user);
        // console.log('User Token: => ', user?.token);
        // console.log('AsyncStorage Token: =>', token);
      } else {
        // If not authenticated or no valid token, route to login or landing page
        // console.log('User:', user);
        // console.log('User Token:', token);

        if (segments[0] === 'main') {
          router.replace('/auth/login');
        } else {
          router.replace('/auth/landingpage');
        }
      }
    };

    const timer = setTimeout(() => {
      initializeAuth();
      console.log('delayed');
    }, 0);

    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, user]);

  return <Slot />
};

// Root Layout Component
const RootLayout: React.FC = ({children}:any) => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ChatProvider>
              <MessageProvider>
                <AuthInitializer />
                {children}
              </MessageProvider>
            </ChatProvider>
          </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;






