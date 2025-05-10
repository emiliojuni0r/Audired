import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import React, { useRef, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = () => {
  const { fontScale, setFontScale, baseFontSize } = useFontSize();
  const { speechRate, setSpeechRate } = useSpeechRate();
  const { scaledFontSize } = useFontSize();

  const isSpeaking = useRef(false); // Ref untuk melacak status TTS

  const speak = (text: string, languageCode = "id-ID", speakSpeed: number) => {
    if (isSpeaking.current) {
      Speech.stop(); // Batalkan TTS yang sedang berjalan
    }
    isSpeaking.current = true;
    Speech.speak(text, {
      language: languageCode,
      rate: speakSpeed,
      onStopped: () => {
        isSpeaking.current = false; // Reset status setelah dihentikan
      },
      onDone: () => {
        isSpeaking.current = false; // Reset status setelah selesai
      },
    });
  };


  const handleButtonAplikasi = () => {
    router.push("/settings/settingAplikasi");
    speak("Pengaturan Aplikasi", "id-ID", speechRate);
  };

  const handleButtonProfile = () => {
    router.push("/settings/profile");
    speak("Profil", "id-ID", speechRate);
  }

  return (
    <View className="flex-1 bg-white p-2 flex-col items-center">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke Home Page", "id-ID", speechRate);
        }}
      >
        <Ionicons name="arrow-back" size={25} />
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="ml-2 text-base text-black font-medium"
        >
          Kembali
        </Text>
      </TouchableOpacity>
      <Text className="text-2xl font-extrabold">Pengaturan</Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mt-[10%]" />
      {/* button ke profile */}
      <TouchableOpacity onPress={handleButtonProfile} className="w-[90%] h-[80px] flex flex-row justify-between items-center px-5">
        <Text className="text-[#150E7C] text-xl font-bold">Profil</Text>
        <Ionicons name="chevron-forward-outline" size={35} color={"#150E7C"} />
      </TouchableOpacity>
      {/* button ke notifikasi */}
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <TouchableOpacity className="w-[90%] h-[80px] flex flex-row justify-between items-center px-5">
        <Text className="text-[#150E7C] text-xl font-bold">Notifikasi</Text>
        <Ionicons name="chevron-forward-outline" size={35} color={"#150E7C"} />
      </TouchableOpacity>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <TouchableOpacity
        onPress={handleButtonAplikasi}
        className="w-[90%] h-[80px] flex flex-row justify-between items-center px-5"
      >
        <Text className="text-[#150E7C] text-xl font-bold">Aplikasi</Text>
        <Ionicons name="chevron-forward-outline" size={35} color={"#150E7C"} />
      </TouchableOpacity>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
    </View>
  );
};

export default SettingsScreen;
