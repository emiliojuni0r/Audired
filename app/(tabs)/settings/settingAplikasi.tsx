import { Text, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { useRef } from "react";

export default function pageSettingAplikasi() {
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
    speak(
      `Kecepatan ucapan ditingkatkan menjadi ${newRate.toFixed(1)}`,
      "id-ID",
      newRate
    );
  };

  const handleDecreaseSpeechRate = () => {
    const newRate = Math.max(0.5, speechRate - 0.1);
    setSpeechRate(newRate);
    speak(
      `Kecepatan ucapan dikurangi menjadi ${newRate.toFixed(1)}`,
      "id-ID",
      newRate
    );
  };
  return (
    <View className="flex-1 bg-white p-2 flex-col items-center">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.navigate("/(tabs)/settings");
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
      {/* title page */}
      <Text className="text-2xl font-extrabold">Aplikasi</Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mt-[10%]" />
      <TouchableOpacity className="w-[90%] h-[80px] flex flex-col justify-center px-5">
        <Text className="text-[#150E7C] text-xl font-bold">Bahasa</Text>
        <Text>Bahasa Indonesia</Text>
      </TouchableOpacity>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      {/* kecepata container */}
      <View className="w-[90%] h-[100px] flex flex-col justify-center gap-y-3 px-5">
        <Text>
          <span className="font-bold">Kecepatan ucapan:</span>{" "}
          {speechRate.toFixed(1)}
        </Text>
        <View className="w-full flex flex-row gap-x-2">
          <TouchableOpacity
            onPress={handleIncreaseSpeechRate}
            className="w-[50%] h-10 bg-[#150E7C] rounded-[10px] flex justify-center items-center"
          >
            <Text className="text-white">Naikkan kecepatan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecreaseSpeechRate}
            className="w-[50%] h-10 bg-[#150E7C] rounded-[10px] flex justify-center items-center"
          >
            <Text className="text-white">Turunkan kecepatan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      {/* ukuran container */}
      <View className="w-[90%] h-[100px] flex flex-col justify-center gap-y-3 px-5">
        <Text>
          <span className="font-bold">Ukuran teks:</span>{" "}
          {(fontScale * 100).toFixed(0)}%
        </Text>
        <View className="w-full flex flex-row gap-x-2">
          <TouchableOpacity
            onPress={increaseFontSize}
            className="w-[50%] h-10 bg-[#150E7C] rounded-[10px] flex justify-center items-center"
          >
            <Text className="text-white">Naikkan ukuran</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={decreaseFontSize}
            className="w-[50%] h-10 bg-[#150E7C] rounded-[10px] flex justify-center items-center"
          >
            <Text className="text-white">Turunkan ukuran</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
    </View>
  );
}
