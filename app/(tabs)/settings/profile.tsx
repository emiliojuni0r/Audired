import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { useRef } from "react";
import { auth } from "@/firebase";
import { useAuth } from "@/context/auth";

export default function ProfilePage() {
  const { fontScale, setFontScale, baseFontSize } = useFontSize();
  const { speechRate, setSpeechRate } = useSpeechRate();
  const { scaledFontSize } = useFontSize();
  const { logout } = useAuth(); // ambil fungsi logout dari context

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

  const handeLogout = async () => {
    try {
      await auth.signOut();
      await logout();
      speak("Kamu telah logout", "id-ID", speechRate);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      speak("Terjadi kesalahan saat logout", "id-ID", speechRate);
    }
  };

  console.log(auth.currentUser?.photoURL);
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
      <Text className="text-2xl font-extrabold">Profil</Text>
      {/* profile info container */}
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mt-[10%]" />
      <View className="w-[90%] h-[90px] flex flex-row justify-start items-center px-3 gap-x-4">
        {auth?.currentUser?.photoURL ? (
          <Image
            source={{ uri: auth?.currentUser?.photoURL || require("../../../assets/images/icons/user-placeholder.png")}}
            width={60}
            height={60}
          />
        ) : (
          <View className="w-[60px] h-[60px] bg-blue-500 rounded-full"></View>
        )}
        <View className="flex flex-col gap-y-1.5">
          <Text>
            {auth.currentUser?.displayName
              ? auth.currentUser?.displayName
              : "name"}
          </Text>
          <Text>
            {auth.currentUser?.email ? auth.currentUser?.email : "email"}
          </Text>
        </View>
      </View>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <TouchableOpacity onPress={handeLogout} className="w-[50%] h-10 bg-[#D30000] rounded-[20px] flex justify-center items-center mt-[10%]">
        <Text className="text-white font-semibold">Keluarkan akun</Text>
      </TouchableOpacity>
    </View>
  );
}
