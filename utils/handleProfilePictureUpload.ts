import * as ImagePicker from 'expo-image-picker';

const handleProfilePictureUpload = async () => {
  // Request permission to access the camera roll
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }

  // Launch the image picker
  const result = await ImagePicker.launchImageLibraryAsync();

  if (!result.canceled) {
    const selectedImage = result.assets[0].uri;
    // Handle the image upload logic here (e.g., upload to your server)
  }
};
