import { View, Text, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { useRef } from "react";

export default function HistoryScreen() {
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
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
  return (
    <View className="flex flex-1 bg-white items-center p-2">
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

      <Text className="text-black text-2xl font-semibold">Lihat riwayat</Text>

      <TouchableOpacity
        onPress={() => {
          router.push("/(tabs)/history/historyReminder");
          speak("Riwayat Pengingat Jadwal obat", "id-ID", speechRate);
        }}
        className="w-[80%] h-[10vh] bg-[#150E7C] rounded-[20px] flex justify-center items-center mt-[11%]"
      >
        <Text className="text-white font-extrabold text-xl">
          Pengingat jadwal obat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.push("/(tabs)/history/historyScan");
          speak("Riwayat Scan label", "id-ID", speechRate);
        }}
        className="w-[80%] h-[10vh] bg-[#150E7C] rounded-[20px] flex justify-center items-center mt-[8%]"
      >
        <Text className="text-white font-extrabold text-xl">Baca label</Text>
      </TouchableOpacity>
    </View>
  );
}
