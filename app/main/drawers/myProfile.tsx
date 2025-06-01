
// myProfile.js
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigationBar } from '~/hooks/useNavigationBar';
import { usePathname, useRouter, useSegments } from 'expo-router';

const MyProfile = () => {
  const path = usePathname();
  const route = useRouter();
  const segments = useSegments();
  useEffect(()=> {
    console.log('Path: -> ', path)
    console.log('route: -> ', route)
    console.log('segments: -> ', segments)

  },[path,segments,route])
  const {
    visibility,
    backgroundColor,
    showNavigationBar,
    hideNavigationBar,
    updateBackgroundColor,
  } = useNavigationBar();

  const toggleVisibility = () => {
    visibility === 'hidden' ? showNavigationBar() : hideNavigationBar();
  };

  const changeColor = () => {
    updateBackgroundColor(backgroundColor === '#000000' ? '#FF0000' : '#000000'); // Toggle between black and red
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text>Current Visibility: {visibility}</Text>
      <Button title="Toggle Navigation Bar" onPress={toggleVisibility} />
      <Button title="Change Background Color" onPress={changeColor} />
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
