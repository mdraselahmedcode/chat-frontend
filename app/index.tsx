import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Redirect, useSegments } from 'expo-router';
import '../global.css';

const Index = () => {
  const [waiting, setWaiting] = useState<boolean>(true); // Manages loading state
  const segments = useSegments(); // Get route segments
  
  useEffect(() => {
    // Only proceed if segments[0] is undefined (indicating an unmatched route)
    if (segments[0] === undefined) {
      // Trigger loading state with a timeout
      const timer = setTimeout(() => {
        setWaiting(false); // Stops the waiting indicator
      }, 100); // 3 seconds delay
      
      return () => clearTimeout(timer); // Cleanup timeout when component unmounts
    }
  }, [segments]);

  // Show loader while waiting
  if (waiting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={'blue'} />
      </View>
    );
  }

  // Once the waiting is over, redirect to '/auth'
//   return <Redirect href={"/auth"} />;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
