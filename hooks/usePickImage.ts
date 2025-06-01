// src/hooks/usePickImage.ts

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { MediaFile } from '~/types/messageTypes';

const usePickImage = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async (): Promise<MediaFile | null> => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);

        // Create MediaFile object
        const mediaFile: MediaFile = {
          uri: selectedImage,
          name: 'image.jpg', // Optionally, extract the name from the URI
          type: 'image/jpeg', // Determine the type based on the URI or file extension
        };

        return mediaFile;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Image Picker Error', 'An error occurred while picking the image.');
      return null;
    }
  };

  return { image, pickImage };
};

export default usePickImage;
