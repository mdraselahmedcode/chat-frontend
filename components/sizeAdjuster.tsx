
// ~/components/SizeAdjuster.tsx

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setSizeMultiplier } from '../redux/slices/sizeSlice';

const SizeAdjuster = () => {
  const dispatch = useAppDispatch();
  const sizeMultiplier = useAppSelector((state) => state.sizes.sizeMultiplier);

  const increaseSize = () => {
    dispatch(setSizeMultiplier(sizeMultiplier + 0.1));
  };

  const decreaseSize = () => {
    dispatch(setSizeMultiplier(sizeMultiplier - 0.1));
  };

  return (
    <View style={styles.container}>
      <Button title="Increase Size" onPress={increaseSize} disabled={sizeMultiplier >= 2} />
      <Button title="Decrease Size" onPress={decreaseSize} disabled={sizeMultiplier <= 0.5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default SizeAdjuster;
