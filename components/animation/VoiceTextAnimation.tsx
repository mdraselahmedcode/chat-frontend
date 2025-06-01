import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface VoiceTextAnimationProps {
  isPlaying: boolean;
}

const VoiceTextAnimation: React.FC<VoiceTextAnimationProps> = ({ isPlaying }) => {
  const animation1 = useRef(new Animated.Value(1)).current;
  const animation2 = useRef(new Animated.Value(1)).current;
  const animation3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isPlaying]);

  const startAnimation = () => {
    resetAnimations();
    animate(animation1, 0);
    animate(animation2, 150);
    animate(animation3, 300);
  };

  const animate = (animatedValue: Animated.Value, delay: number) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.5,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isPlaying) {
        animate(animatedValue, 0); // Loop the same bar
      }
    });
  };

  const stopAnimation = () => {
    animation1.stopAnimation();
    animation2.stopAnimation();
    animation3.stopAnimation();
    resetAnimations();
  };

  const resetAnimations = () => {
    animation1.setValue(1);
    animation2.setValue(1);
    animation3.setValue(1);
  };

  return (
    <View style={styles.animationContainer}>
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation1 }] }]} />
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation2 }] }]} />
      <Animated.View style={[styles.bar, { transform: [{ scaleY: animation3 }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  bar: {
    width: 4,
    height: 20,
    backgroundColor: '#4B5563',
    marginHorizontal: 2,
    borderRadius: 2,
  },
});

export default VoiceTextAnimation;
