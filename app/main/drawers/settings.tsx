// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const settings = () => {
//   return (
//     <View>
//       <Text>settings</Text>
//     </View>
//   )
// }

// export default settings

// const styles = StyleSheet.create({})







// settings.js
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigationBar } from '~/hooks/useNavigationBar';
import { usePathname } from 'expo-router';
import { getThemeColors } from '~/utils/themeColorsControl';
import { StatusBar } from 'expo-status-bar';

const Settings = () => {
  const path = usePathname();

  const {
    systemNavigationBarColor,

  } = getThemeColors();
  const {
    visibility,
    backgroundColor,
    showNavigationBar,
    hideNavigationBar,
    updateBackgroundColor,
  } = useNavigationBar();

  // Update the navigation bar color based on the path
  useEffect(() => {
    if (path === '/main/drawers/settings') {
      updateBackgroundColor('red'); // Set to green for settings page
    } else {
      updateBackgroundColor(systemNavigationBarColor); // Set to default color when navigating away
    }
  }, [path, updateBackgroundColor]);

  const toggleVisibility = () => {
    visibility === 'hidden' ? showNavigationBar() : hideNavigationBar();
  };

  const changeColor = () => {
    updateBackgroundColor(backgroundColor === '#000000' ? '#FF0000' : '#000000'); // Toggle between black and red
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Settings</Text>
      <Text>Current Visibility: {visibility}</Text>
      <Button title="Toggle Navigation Bar" onPress={toggleVisibility} />
      <Button title="Change Background Color" onPress={changeColor} />
    </View>
  );
};

export default Settings;

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
