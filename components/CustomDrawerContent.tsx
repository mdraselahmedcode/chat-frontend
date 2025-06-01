


import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import ThemeButton from '~/components/ThemeButton';
import LogoutButton from '~/components/LogoutButton';
import CrossIcon from '~/components/CrossIcon';
import Avatar from '~/components/AvatarWithNameEMail';
import CameraIcon from '~/components/CameraIcon';
import { getThemeColors } from '~/utils/themeColorsControl';
import AvatarWithNameEMail from '~/components/AvatarWithNameEMail';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);

  // Function to handle profile picture upload
  const NavigateToProfileScreen = async () => {
    // Logic for handling image upload
  };

  const {
    textColor,
    backgroundColor,
    subTextColor,
    iconColor,
    drwr_prfl_sec_bg,
  } = getThemeColors();

  return (
    <View style={{backgroundColor: backgroundColor}} className={`flex-1 mt-[-5] `}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        {/* drawer prfl whole section */}
        <View style={{backgroundColor: drwr_prfl_sec_bg}} className={` gap-2 pb-1 pt-2 `} >
          {/* Header with Close Button and Theme Toggle */}
          <View className={`flex flex-row w-full items-center justify-between px-4 py-2 `}>
            <CrossIcon color={iconColor} size={22} />
            <ThemeButton size={22} /> 
          </View>
          <AvatarWithNameEMail NavigateToProfileScreen = {NavigateToProfileScreen} />
        </View>

        <View className='pt-2'>
          <DrawerItemList {...props} />
        </View>

        <View className="px-4 mt-4">
          <Text style={{color: subTextColor}} className={`text-xl font-semibold mb-2 `}>Recommendations</Text>
          <TouchableOpacity className="py-2">
            <Text className="text-base text-blue-600">Start a New Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text className="text-base text-blue-600">View Recent Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text className="text-base text-blue-600">Settings</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      <View style={{backgroundColor: backgroundColor}} className={`px-4 py-4 `}>
        <LogoutButton />
      </View>
    </View>
  );
};

export default CustomDrawerContent;








