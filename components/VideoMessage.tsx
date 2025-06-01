
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { useMessageContext } from '~/contexts/MessageContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Dimensions } from 'react-native';


interface VideoMessageProps {
  uri: string;
  handleLongPress: () => void;
}


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const videoAspectRatio = 16 / 9; // Adjust as needed for your video

const VideoMessage: React.FC<VideoMessageProps> = ({ uri, handleLongPress }) => {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { isFullVideoScreen: isFullscreen, setIsFullVideoScreen: setIsFullscreen } = useMessageContext();
  const playingOpacity = 0;
  const notPlayingOpacity = 1;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (currentPosition >= totalDuration) {
      videoRef.current?.seek(0);
      setCurrentPosition(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
    StatusBar.setHidden(!isFullscreen, 'fade'); // Hide or show the status bar
  };

  const handleLoad = (meta: { duration: number }) => {
    setTotalDuration(meta.duration * 1000);
  };

  const handleProgress = (progress: { currentTime: number }) => {
    setCurrentPosition(progress.currentTime * 1000);
  };

  const handleBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setIsBuffering(isBuffering);
  };

  const handleSliderChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.seek(value / 1000);
      setCurrentPosition(value);
      if (value >= totalDuration) {
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentPosition(0);
    videoRef.current?.seek(0);
  };



  const renderVideo = () => (
    <Video
      ref={videoRef}
      source={{ uri }}
      style={isFullscreen ? styles.fullscreenVideo : styles.video}
      resizeMode="contain"
      paused={!isPlaying}
      onLoad={handleLoad}
      onProgress={handleProgress}
      onBuffer={handleBuffer}
      onEnd={handleEnd}
      muted={isMuted}
    />
  );

  const renderControls = () => (
    <>
      {(isBuffering && isPlaying) && (
        <View style={styles.buffering}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <TouchableOpacity 
        style={isFullscreen ? styles.playPauseButtonFullscreen : styles.playPauseButton } 
        onPress={handlePlayPause}
        activeOpacity={0.5}
      >
        <Ionicons
          // name={isPlaying ? 'pause' : 'play'}
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color="white"
          style={{ opacity: isPlaying ? 0 : 1}} // Set opacity based on isPlaying
        />
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <Text style={[styles.durationText, { opacity: isFullscreen ? 1 : (isPlaying ? playingOpacity : notPlayingOpacity) }]}>
          {formatTime(currentPosition / 1000)} / {formatTime(totalDuration / 1000)}
        </Text>

        {isFullscreen && (
          <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={totalDuration}
          value={currentPosition}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#888888"
        />
        )}

        <TouchableOpacity
          style={[styles.fullscreenButton, { opacity: isFullscreen ? 1 : (isPlaying ? playingOpacity : notPlayingOpacity) }]}
          onPress={handleFullscreenToggle}
        >
          <Ionicons 
            name={isFullscreen ? 'contract' : 'expand'} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {!isFullscreen && (
        <TouchableOpacity 
          style={styles.muteButton} 
          onPress={toggleMute}
          activeOpacity={0.7}
        >
        <Ionicons
          name={isMuted ? 'volume-mute' : 'volume-high'}
          size={20}
          color="white"
          style={{ opacity: isPlaying ? playingOpacity : notPlayingOpacity}} // Set opacity based on isPlaying
        />
      </TouchableOpacity>
      )}
    </>
  );

  return (
    <>

      <TouchableOpacity
        onLongPress={handleLongPress}
        style={styles.container}
        activeOpacity={1}
      >
        {!isFullscreen && (
          <View style={styles.videoContainer}>
            {renderVideo()}
            {renderControls()}
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={isFullscreen} animationType="slide" transparent>
        <View style={styles.fullscreenOverlay}>
          {!isFullscreen && (
          <TouchableOpacity
            style={styles.closeFullscreenButton}
            onPress={handleFullscreenToggle}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          )}
          <View style={styles.fullscreenVideoContainer}>
            {renderVideo()}
            {renderControls()}
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  videoContainer: {
    width: '100%',         // Full width for inline video
    aspectRatio: 16 / 9,    // Common aspect ratio for video
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fullscreenOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Ensure background for fullscreen view
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullscreenVideoContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',  // outside video message bg
  },
  fullscreenVideo: {
    width: screenWidth,
    height: screenHeight,
    // backgroundColor: 'black', // fullscreen bg
  },
  buffering: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButtonFullscreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
  fullscreenButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeFullscreenButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  muteButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
});
export default VideoMessage













