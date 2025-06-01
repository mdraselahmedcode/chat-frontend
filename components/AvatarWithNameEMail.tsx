import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { RootState, useAppSelector } from '~/redux/store';
import { User } from '~/types/all_types';
import { getThemeColors } from '~/utils/themeColorsControl';

interface AvatarWithNameEMailProps {
  // width: number;
  // height: number;
  // borderRadius: number;
  NavigateToProfileScreen: () => void; // Define as a function that takes no parameters and returns void
}



const AvatarWithNameEMail: React.FC<AvatarWithNameEMailProps> = ({ NavigateToProfileScreen }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const {
    textColor,
    subTextColor,

  } = getThemeColors();

  return (
    // <TouchableOpacity onPress={handleProfilePictureUpload}>
    <TouchableOpacity onPress={NavigateToProfileScreen} className={` flex flex-row  gap-3  py-2 w-full justify-start  items-center pl-5    `}>


      <Image
        source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
        style={{ width: 70, height: 70, borderRadius: 50 }}
      // className={`w-${width} h-${height} rounded-full `}
      />
      <View className="flex-col items-start justify-center">
        <Text style={{ color: textColor }} className={`text-xl font-bold `}>{user?.username || 'User Name'}</Text>
        <Text style={{ color: subTextColor }} className={`text-lg `}>{user?.email || 'user@example.com'}</Text>
      </View>

    </TouchableOpacity>
  );
};

export default AvatarWithNameEMail;
