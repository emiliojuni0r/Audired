import { Text, TouchableOpacity, View } from "react-native";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";


export default function loginPage() {
    // const googleLogo = require("../assets/images/logo/google-icon.png")

  return (
    <View className="flex-1 flex bg-white justify-center items-center">
      <Text className="text-2xl font-semibold">Masuk</Text>
      <TouchableOpacity className="w-[85%] h-[40px] bg-white border border-[#150E7C] rounded-[8px] mt-8 flex flex-row justify-center items-center">
        {/* <Image source={googleLogo}/> */}
        <Ionicons name="logo-google" size={16} className="mr-2"/>
        <Text className="text-[16ppx] font-normal">Lanjutkan dengan Google</Text>
      </TouchableOpacity>
    </View>
  );
}
