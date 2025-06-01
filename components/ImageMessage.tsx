
import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Text,
  Animated,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMessageContext } from '~/contexts/MessageContext';
import { RootState, useAppSelector } from '~/redux/store';
import { getThemeColors } from '~/utils/themeColorsControl';

interface ImageMessageProps {
  uri: string;
  handleLongPress: () => void;
}

const ImageMessage: React.FC<ImageMessageProps> = ({ uri, handleLongPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isSelectionMode } = useMessageContext();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const { mode } = useAppSelector((state: RootState) => state.theme);

  const { statusBarBgColor } = getThemeColors();

  const handleImagePress = () => {
    if (!imageError) {
      setModalVisible(true);
      // Animate the slide-in effect
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to the top of the screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height, // Slide back down off-screen
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    return () => {
      // No StatusBar actions here
    };
  }, []);

  return (
    <View>
      <TouchableWithoutFeedback
        onLongPress={handleLongPress}
        onPress={isSelectionMode ? handleLongPress : handleImagePress}
        disabled={imageError}
      >
        {imageError ? (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Image Unavailable</Text>
          </View>
        ) : (
          <Image source={{ uri }} style={styles.messageImage} onError={handleImageError} />
        )}
      </TouchableWithoutFeedback>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                width: screenWidth,
                height: screenHeight,
              }}
            >
              <Image
                source={{ uri }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
                onError={handleImageError}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  messageImage: {
    width: '100%',
    aspectRatio: 25 / 32,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fallbackContainer: {
    width: '100%',
    aspectRatio: 25 / 32,
    borderRadius: 10,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  fallbackText: {
    color: '#808080',
    fontSize: 16,
  },
});

export default ImageMessage;
