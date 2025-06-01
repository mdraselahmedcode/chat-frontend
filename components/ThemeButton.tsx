// components/ThemeButton.tsx

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '~/redux/store';
import useTheme from '~/hooks/useTheme';
import { getThemeColors } from '~/utils/themeColorsControl';


interface ThemeButtonProps {
  size: number;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ size }) => {
  const { mode } = useSelector((state: RootState) => state.theme); // Select the current theme
  const toggleTheme = useTheme();
  const {
    themeIconColor,
    
  } = getThemeColors();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`items-center justify-center shadow-lg`}
      activeOpacity={0.7}
    >
      <MaterialIcons
        className="rotate-[-70deg]"
        name={mode === 'dark' ? 'wb-sunny' : 'nightlight-round'}
        size={size}
        color={themeIconColor}
      />
    </TouchableOpacity>
  );
};

export default ThemeButton;
