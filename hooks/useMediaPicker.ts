
// src/hooks/useMediaPicker.ts
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '~/redux/store';
import { sendMessage } from '~/redux/slices/messageSlice';
import { MediaFile } from '~/types/messageTypes';

const useMediaPicker = (chatId: string) => {
  const dispatch = useAppDispatch();
  const [media, setMedia] = useState<MediaFile[]>([]);

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and videos
      allowsMultipleSelection: true, // Allow multiple selection
      // allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedMedia = result.assets.map((asset) => {
        let mediaType: 'image' | 'video' | undefined;

        if (asset.type === 'image') {
          mediaType = 'image';
        } else if (asset.type === 'video') {
          mediaType = 'video';
        } else {
          console.warn('Unsupported media type:', asset.type);
          return null;
        }

        if (mediaType) {
          return {
            uri: asset.uri,
            name: mediaType === 'image' ? 'image.jpg' : 'video.mp4',
            type: mediaType === 'image' ? 'image/jpeg' : 'video/mp4',
          };
        }

        return null;
      }).filter(Boolean) as MediaFile[];

      setMedia(selectedMedia);
    }
  };

  useEffect(() => {
    if (media.length > 0) {
      media.forEach((mediaFile) => {
        dispatch(sendMessage({ chatId, content: mediaFile.uri, type: mediaFile.type === 'image/jpeg' ? 'image' : 'video', media: mediaFile }));
      });
      setMedia([]); // Clear the media state after sending
    }
  }, [media, chatId, dispatch]);

  return { pickMedia };
};

export default useMediaPicker;
