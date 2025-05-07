import React, { createContext, useState, useContext } from 'react';

interface SpeechRateContextProps {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

const defaultSpeechRateContext: SpeechRateContextProps = {
  speechRate: 1.0, // Default speech rate (normal speed)
  setSpeechRate: () => {},
};

const SpeechRateContext = createContext(defaultSpeechRateContext);

export const useSpeechRate = () => useContext(SpeechRateContext);

interface SpeechRateProviderProps {
  children: React.ReactNode;
}

export const SpeechRateProvider: React.FC<SpeechRateProviderProps> = ({ children }) => {
  const [speechRate, setSpeechRate] = useState(defaultSpeechRateContext.speechRate);

  return (
    <SpeechRateContext.Provider value={{ speechRate, setSpeechRate }}>
      {children}
    </SpeechRateContext.Provider>
  );
};