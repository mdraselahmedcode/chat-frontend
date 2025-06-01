import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { getColorFromClass } from '~/utils/colorMapT_Css';



interface CrossIconProps {
  size: number;
  color: string; // Keep it as a string for the color
}

const CrossIcon: React.FC<CrossIconProps> = ({ color, size }) => {
  const navigation = useNavigation();
  const resolvedColor = getColorFromClass(color);

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
    >
      <MaterialIcons name="close" size={size} color={resolvedColor} />
    </TouchableOpacity>
  );
};

export default CrossIcon;
