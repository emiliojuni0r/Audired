import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { View, Text, Touchable, TouchableOpacity } from "react-native";

export default function ReminderScreen() {
  const { scaledFontSize } = useFontSize();
  return (
    <View className="flex-1 bg-white align-top p-2">
      // back button
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={25} /> // ini icon back sobat
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="ml-2 text-base text-black font-medium"
        >
          Kembali
        </Text>
      </TouchableOpacity>

      {/* button untuk nambah jadwal */}
      <TouchableOpacity className="w-[80%] h-[60px] bg-[#150E7C] rounded-[20px] flex items-center mx-auto mt-3">
        <Text style={{ fontSize: scaledFontSize("text-2xl") }} className="my-auto text-2xl text-white font-bold">
          Tambahkan jadwal baru
        </Text>
      </TouchableOpacity>
      
      {/* line ngebatasin apalah itu */}
      <View className="w-[90%] h-[1px] bg-[#150E7C] mx-auto mt-4"></View>

      {/* start of  container list jadwal */}
      <View className="w-[85%] h-full border border-[#150E7C] rounded-t-[10px] mt-6 mx-auto flex flex-col items-center p-2">
        {/* text untuk total jadwal yang berlangsung */}
        <Text style={{ fontSize: scaledFontSize("text-base") }} className="text-base font-semibold text-[#150E7C]">
          Jadwal yang sedang berlangsung: 3
        </Text>

        {/* generate list jadwal minum obat yang ada */}
        
      </View>
      {/* end of  container list jadwal */}

    </View>
  );
}
