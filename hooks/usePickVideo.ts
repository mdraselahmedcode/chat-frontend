import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

interface VideoPickerResult {
  video: string | null;
  pickVideo: () => Promise<void>;
}

const usePickVideo = (): VideoPickerResult => {
  const [video, setVideo] = useState<string | null>(null);

  const pickVideo = async () => {
    // Ask for permission to access the device's media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    // Launch the image picker for video files
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Only allow video selection
      allowsEditing: true, // Allow the user to trim or adjust the video
      quality: 1, // Highest quality video
    });

    // Check if the user canceled the picking process
    if (!result.canceled) {
      setVideo(result.assets[0].uri); // Set the URI of the selected video
    }
  };

  return {
    video,
    pickVideo,
  };
};

export default usePickVideo;
