
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from '~/utils/themeColorsControl';
import { useMessageContext } from '~/contexts/MessageContext';

interface VoiceMessageProps {
  id: string;
  content: string;
  getDuration: (uri: string) => Promise<number | null>;
  playSound: (uri: string, id: string, onEnd: () => void) => Promise<void>;
  pauseSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
  handleLongPress: () => void; // Pass this prop
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  id,
  content,
  getDuration,
  playSound,
  pauseSound,
  resumeSound,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  handleLongPress,
}) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null); // State to store errors
  const animationValue = useRef(new Animated.Value(0)).current;

  const { textColor } = getThemeColors();
  const previousContentRef = useRef<string | null>(null);
  const {isSelectionMode, } = useMessageContext(); 

  useEffect(() => {
    const fetchDuration = async () => {
      setIsFetching(true);
      setError(null); // Clear any previous errors
      try {
        const soundDuration = await getDuration(content);
        if (soundDuration !== null) {
          setDuration(soundDuration);
          console.log('Fetched Duration: ', soundDuration);
        } else {
          setDuration(null);
          setError('Unable to fetch sound duration');
        }
      } catch (error) {
        console.error('Failed to fetch duration:', error);
        setDuration(null);
        setError('Error fetching sound duration');
      } finally {
        setIsFetching(false);
      }
    };

    if (content && content !== previousContentRef.current) {
      fetchDuration();
      previousContentRef.current = content;
    }
  }, [content, getDuration]);

  useEffect(() => {
    setIsCurrentlyPlaying(currentlyPlayingId === id);
  }, [currentlyPlayingId, id]);

  useEffect(() => {
    if (isCurrentlyPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animationValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const intervalId = setInterval(() => {
        setCurrentPlaybackTime((prevTime) => {
          if (prevTime < (duration || 0)) {
            return prevTime + 1;
          }
          clearInterval(intervalId);
          return prevTime;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      animationValue.stopAnimation();
      animationValue.setValue(0);
      setCurrentPlaybackTime(0);
    }
  }, [isCurrentlyPlaying, duration]);

  const handlePlaySound = async () => {
    if (!content || duration === null) {
      setError('Invalid file or duration');
      return;
    }

    try {
      if (isCurrentlyPlaying) {
        await pauseSound();
        setCurrentlyPlayingId(null);
      } else {
        setCurrentlyPlayingId(id);
        await playSound(content, id, async () => {
          setCurrentlyPlayingId(null);
          setCurrentPlaybackTime(0);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setCurrentlyPlayingId(null);
      setError('Error playing sound');
    }
  };

  const handleResumeSound = async () => {
    try {
      await resumeSound();
      setCurrentlyPlayingId(id);
    } catch (error) {
      console.error('Error resuming sound:', error);
      setError('Error resuming sound');
    }
  };

  const formattedDuration = duration !== null
    ? `${Math.floor(duration / 60)}:${('0' + Math.floor(duration % 60)).slice(-2)}`
    : isFetching ? 'Loading...' : 'Unavailable';

  const formattedCurrentPlaybackTime = `${Math.floor(currentPlaybackTime / 60)}:${('0' + Math.floor(currentPlaybackTime % 60)).slice(-2)}`;

  return (
    <TouchableOpacity
      onLongPress={handleLongPress} // Attach the long press handler here
      onPress={isSelectionMode ? handleLongPress : undefined } 
      style={styles.voiceMessageContainer}
      activeOpacity={1}
    >
      {!isCurrentlyPlaying && (
        <TouchableOpacity 
          activeOpacity={isSelectionMode ? 1 : 0.2}
          style={styles.button}
        >
          <Ionicons
            onLongPress={handleLongPress}
            onPress={isSelectionMode ? handleLongPress : handlePlaySound}
            name="play-circle-outline"
            size={24}
            color="#4B5563"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}

      {isCurrentlyPlaying && (
        <TouchableOpacity onPress={handlePlaySound} style={styles.button}>
          <Ionicons
            name="pause-circle-outline"
            size={24}
            color="red"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}

      <View style={styles.textContainer}>
        <Text style={[styles.messageText, { color: textColor }]}>Voice Message</Text>
        <Text style={styles.timestamp}>
          {isCurrentlyPlaying ? formattedCurrentPlaybackTime : formattedDuration}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: animationValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }}>
        {isCurrentlyPlaying && (
          <View style={styles.animationContainer}>
            <Text style={styles.animationText}>🔊</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    padding: 5,
  },
  button: {
    marginRight: 10,
  },
  icon: {
    marginRight: 0,
  },
  textContainer: {
    justifyContent: 'center',
    paddingVertical: 5,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  animationContainer: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationText: {
    fontSize: 20,
  },
});

export default VoiceMessage;
