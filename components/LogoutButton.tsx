import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons
import { useSelector } from 'react-redux';
import useLogout from '~/hooks/useLogout';
import { RootState } from '~/redux/store';
import { getThemeColors } from '~/utils/themeColorsControl';

const LogoutButton: React.FC = () => {
  const logout = useLogout();
  const { mode } = useSelector((state: RootState) => state.theme); // Get current theme mode
  const {
    logoutButtonColor,
    buttonTextColor,
  } = getThemeColors();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        
        { backgroundColor: logoutButtonColor }, 
      ]}
      onPress={logout}
    >
      <MaterialIcons
        name="logout"
        size={28} // Increased size for mobile
        color={buttonTextColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50, // Adjusted width for mobile screens
    height: 50, // Adjusted height for mobile screens
    borderRadius: 25, // Full round button
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Shadow for better look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: 10, // Ensure some spacing if placed beside another button
  },
});

export default LogoutButton;
