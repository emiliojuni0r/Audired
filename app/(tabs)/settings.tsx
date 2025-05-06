import { useFontSize } from '@/context/FontSizeContext';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const SettingsScreen = () => {
  const { fontScale, setFontScale, baseFontSize } = useFontSize();

  const increaseFontSize = () => {
    setFontScale(fontScale + 0.1); // Adjust the scaling factor
  };

  const decreaseFontSize = () => {
    setFontScale(Math.max(0.5, fontScale - 0.1)); // Ensure scale doesn't go too low
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Global Font Size Settings</Text>
      <Text style={{ fontSize: baseFontSize * fontScale, marginBottom: 10 }}>
        Current Font Scale: {(fontScale * 100).toFixed(0)}%
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Increase Font Size" onPress={increaseFontSize} />
        <Button title="Decrease Font Size" onPress={decreaseFontSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default SettingsScreen;