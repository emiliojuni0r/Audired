import { View, Text, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";

export default function historyReminder() {
  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };
  const { scaledFontSize } = useFontSize();
  return (
    <View className="flex flex-1 bg-white items-center p-2">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke Home Page");
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

      {/* titlle */}
      <Text className="font-semibold text-2xl mt-2.5 mx-auto text-[#150E7C]">
        Riwayat pengingat jadwal obat
      </Text>

      {/* start of list riwayat pengingat */}
      <View className="w-full h-[78vh] px-[3%] flex mt-4">
        {/* container */}
        <View>

        </View>
      </View>
    </View>
  );
}
