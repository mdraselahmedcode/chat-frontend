import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CameraIcon = ({size, width, height, handleProfilePictureUpload }: any) => {
  return (
    <TouchableOpacity
      style={{
        width: width ,
        height: height,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
      onPress={handleProfilePictureUpload}
    >
      <MaterialIcons name="camera-alt" size={size} color="#007bff" />
    </TouchableOpacity>
  );
};

export default CameraIcon;
