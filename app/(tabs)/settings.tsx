import { useFontSize } from '@/context/FontSizeContext';
import { useSpeechRate } from '@/context/SpeechRateContext';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Speech from "expo-speech";

const SettingsScreen = () => {
  const { fontScale, setFontScale, baseFontSize } = useFontSize();
  const { speechRate, setSpeechRate } = useSpeechRate();

  const speak = (text: string, languageCode = "id-ID", speakSpeed: number) => {
    Speech.speak(text, { language: languageCode, rate: speakSpeed });
  };

  const increaseFontSize = () => {
    setFontScale(fontScale + 0.1);
  };

  const decreaseFontSize = () => {
    setFontScale(Math.max(0.5, fontScale - 0.1));
  };

  const handleSpeechRateChange = (value: number) => {
    setSpeechRate(value);
  };

  const handleIncreaseSpeechRate = () => {
    const newRate = speechRate + 0.1;
    setSpeechRate(newRate);
    speak(`Kecepatan ucapan ditingkatkan menjadi ${newRate.toFixed(1)}`, "id-ID", newRate);
  };

  const handleDecreaseSpeechRate = () => {
    const newRate = Math.max(0.5, speechRate - 0.1);
    setSpeechRate(newRate);
    speak(`Kecepatan ucapan dikurangi menjadi ${newRate.toFixed(1)}`, "id-ID", newRate);
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

      <Text style={{ fontSize: baseFontSize * fontScale, marginTop: 20, marginBottom: 10 }}>Kecepatan Ucapan</Text>
      <Text style={{ fontSize: baseFontSize * fontScale, marginBottom: 10 }}>
        Kecepatan ucapan: {speechRate.toFixed(1)}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="tambah kecepatan ucapan" onPress={handleIncreaseSpeechRate} />
        <Button title="kurangi kecepatan ucapan" onPress={handleDecreaseSpeechRate} />
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