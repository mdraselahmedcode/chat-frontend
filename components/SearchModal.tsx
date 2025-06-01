import React, { useState } from 'react';
import { Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; // Import necessary icons
import { RootState, useAppSelector } from '~/redux/store';
import { getThemeColors } from '~/utils/themeColorsControl'; // Import theme color control

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string, type: 'user' | 'group') => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose, onSearch }) => {
  const { mode } = useAppSelector((state: RootState) => state.theme);
  const {
    backgroundColor,
    textColor,
    modalBackgroundColor,
    buttonBackgroundColor,
    buttonDisabledColor,
    buttonTextColor,
    inputBorderColor,
    inputPlaceholderColor,
    cancelButtonColor,
  } = getThemeColors(); // Destructure theme colors

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'group'>('user');

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      onSearch(searchQuery, searchType);
      setSearchQuery('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: '80%', padding: 24, borderRadius: 10, backgroundColor: modalBackgroundColor }}>
          
          {/* Header with Search Icon */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialIcons name="search" size={24} color={textColor} />
            <Text style={{ marginLeft: 8, fontSize: 20, fontWeight: 'bold', color: textColor }}>Search</Text>
          </View>

          {/* Toggle for User/Group */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: searchType === 'user' ? buttonBackgroundColor : buttonDisabledColor,
              }}
              onPress={() => setSearchType('user')}
              accessibilityLabel="Search Users"
              accessibilityRole="button"
            >
              <FontAwesome5 name="user" size={20} color={buttonTextColor} />
              <Text style={{ marginLeft: 8, color: buttonTextColor }}>User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: searchType === 'group' ? buttonBackgroundColor : buttonDisabledColor,
              }}
              onPress={() => setSearchType('group')}
              accessibilityLabel="Search Groups"
              accessibilityRole="button"
            >
              <Ionicons name="people" size={20} color={buttonTextColor} />
              <Text style={{ marginLeft: 8, color: buttonTextColor }}>Group</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderColor: inputBorderColor,
              color: textColor,
              marginBottom: 16,
            }}
            placeholder={`Search by ${searchType === 'user' ? 'email or username' : 'group name'}`}
            placeholderTextColor={inputPlaceholderColor}
            onChangeText={setSearchQuery}
            value={searchQuery}
            accessibilityLabel="Search Input"
          />

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: searchQuery.trim() === '' ? buttonDisabledColor : buttonBackgroundColor,
              }}
              onPress={handleSearch}
              disabled={searchQuery.trim() === ''}
              accessibilityLabel="Execute Search"
              accessibilityRole="button"
            >
              <MaterialIcons name="search" size={20} color={buttonTextColor} />
              <Text style={{ marginLeft: 8, color: buttonTextColor }}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: cancelButtonColor,
              }}
              onPress={onClose}
              accessibilityLabel="Cancel Search"
              accessibilityRole="button"
            >
              <MaterialIcons name="cancel" size={20} color={buttonTextColor} />
              <Text style={{ marginLeft: 8, color: buttonTextColor }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;
