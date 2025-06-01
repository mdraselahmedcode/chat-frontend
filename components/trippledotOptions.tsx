// ~/components/OptionsMenu.tsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getThemeColors } from '~/utils/themeColorsControl';

interface OptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
  position: { x: number; y: number }; // Accept position as a prop
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  visible,
  onClose,
  onOptionSelect,
  position,
}) => {
  const { textColor, backgroundColor, iconColor } = getThemeColors();

  const options = [
    { label: 'Profile', icon: 'person' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Logout', icon: 'logout' },
  ];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.menuContainer,
                { backgroundColor, top: position.y, left: position.x - 150 }, // Adjust position relative to triple dot
              ]}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={styles.menuItem}
                  onPress={() => onOptionSelect(option.label)}
                  accessibilityLabel={option.label}
                  accessibilityRole="button"
                >
                  <MaterialIcons name={option.icon as any} size={24} color={iconColor} style={styles.menuIcon} />
                  <Text style={[styles.menuText, { color: textColor }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuContainer: {
    position: 'absolute',
    width: 200,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
  },
});

export default OptionsMenu;










