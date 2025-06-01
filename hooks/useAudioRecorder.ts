
import { useState, useRef, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { MediaFile } from '~/types/messageTypes';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<MediaFile | null>;
  playSound: (uri: string, id: string, onEnd: () => void) => Promise<void>;
  pauseSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
  getDuration: (uri: string) => Promise<number | null>;
}

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const currentSoundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: 2, // Corresponds to MPEG_4
          audioEncoder: 3, // Corresponds to AAC
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: 0, // Corresponds to Max
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'An error occurred while starting the recording.');
    }
  };

  const stopRecording = async (): Promise<MediaFile | null> => {
    try {
      if (!recording) {
        Alert.alert('No Recording', 'There is no active recording to stop.');
        return null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        const mediaFile: MediaFile = {
          uri: uri,
          name: Platform.OS === 'ios' ? 'voice.caf' : 'voice.m4a',
          type: Platform.OS === 'ios' ? 'audio/caf' : 'audio/m4a',
        };

        return mediaFile;
      }

      Alert.alert('Recording Error', 'Failed to retrieve the recording URI.');
      return null;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'An error occurred while stopping the recording.');
      return null;
    }
  };

  const playSound = async (uri: string, id: string, onEnd: () => void): Promise<void> => {
    try {
      if (currentSoundRef.current) {
        await currentSoundRef.current.stopAsync();
        await currentSoundRef.current.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      currentSoundRef.current = newSound;
      await newSound.playAsync();
      isPlayingRef.current = true;

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          onEnd();
          newSound.unloadAsync();
          currentSoundRef.current = null;
          isPlayingRef.current = false;
        }
      });
    } catch (error) {
      console.error('Failed to play sound:', error);
      Alert.alert('Playback Error', 'An error occurred while playing the sound.');
      onEnd();
    }
  };

  const pauseSound = async (): Promise<void> => {
    if (currentSoundRef.current && isPlayingRef.current) {
      await currentSoundRef.current.pauseAsync();
      isPlayingRef.current = false;
      console.log('Sound paused');
    }
  };

  const resumeSound = async (): Promise<void> => {
    if (currentSoundRef.current && !isPlayingRef.current) {
      await currentSoundRef.current.playAsync();
      isPlayingRef.current = true;
      console.log('Sound resumed');
    }
  };

  const getDuration = async (uri: string): Promise<number | null> => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sound: newSound, status } = await Audio.Sound.createAsync({ uri });

      if (status.isLoaded && 'durationMillis' in status) {
        const duration = status.durationMillis ? status.durationMillis / 1000 : null;
        await newSound.unloadAsync();
        return duration;
      } else {
        console.warn('Failed to load sound for duration');
        return null;
      }
    } catch (error) {
      console.error('Error getting sound duration:', error);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (currentSoundRef.current) {
        currentSoundRef.current.unloadAsync();
      }
    };
  }, []);

  return { isRecording, startRecording, stopRecording, playSound, pauseSound, resumeSound, getDuration };
};

export default useAudioRecorder;
