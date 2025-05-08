import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface SpeechRateContextProps {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

const defaultSpeechRateContext: SpeechRateContextProps = {
  speechRate: 1.0, // Default speech rate (normal speed)
  setSpeechRate: () => {},
};

const SPEECH_SCALE_KEY = "speechRate"; // key untuk nyimpen data ke AsyncStorage

const SpeechRateContext = createContext(defaultSpeechRateContext);

export const useSpeechRate = () => useContext(SpeechRateContext);

interface SpeechRateProviderProps {
  children: React.ReactNode;
}

export const SpeechRateProvider: React.FC<SpeechRateProviderProps> = ({ children }) => {
  const [speechRate, setSpeechRateState] = useState(defaultSpeechRateContext.speechRate);

      // Saat Load App, Load Font Scale yang udah disimpan dulu
      useEffect(() => {
        const loadSpeechRate = async () => {
          try {
            const storedScale = await AsyncStorage.getItem(SPEECH_SCALE_KEY); // Diambil dari AsyncStorage pakai KEY yg udah ditentuin
            if (storedScale !== null) {
              setSpeechRateState(parseFloat(storedScale));
            }
          } catch (e) {
            console.warn("Failed to load speech rate:", e);
          }
        };
  
        // Load dari Async Storage Font Seting Sebelumnya
        loadSpeechRate();
      }, []);
  

  const setSpeechRate = async (rate: number) => {
    try {
      await AsyncStorage.setItem(SPEECH_SCALE_KEY, rate.toString());
      setSpeechRateState(rate);
    } catch (e) {
      console.error("Failed to save speech rate:", e);
    }
  };

  return (
    <SpeechRateContext.Provider value={{ speechRate, setSpeechRate }}>
      {children}
    </SpeechRateContext.Provider>
  );
};