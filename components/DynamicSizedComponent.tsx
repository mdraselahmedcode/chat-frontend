// ~/components/DynamicSizedComponent.tsx

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/store'; // Adjust path as necessary
import { MaterialIcons } from '@expo/vector-icons';

const DynamicSizedComponent = () => {
  const sizeMultiplier = useAppSelector((state) => state.sizes.sizeMultiplier);

  // Calculate sizes dynamically
  const textSize = 16 * sizeMultiplier; // Base text size
  const iconSize = 24 * sizeMultiplier; // Base icon size

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: textSize }]}>Dynamic Text</Text>
      <MaterialIcons name="search" size={iconSize} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    marginBottom: 10,
  },
});

export default DynamicSizedComponent;


