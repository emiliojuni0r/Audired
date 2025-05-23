import { useFontSize } from "@/context/FontSizeContext";
import { Link, useNavigation, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import * as Speech from "expo-speech";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { auth } from "@/firebase";
import { useAuth } from "@/context/auth";
import { useSpeechRate } from "@/context/SpeechRateContext";

// home page
export default function Index() {
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
  const router = useRouter();
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

  const screenText = "Kamu sekarang berada di Beranda.";

  // const handeLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     await logout();
  //     speak("Kamu telah logout", "id-ID", speechRate);
  //     router.replace("/login");
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     speak("Terjadi kesalahan saat logout", "id-ID", speechRate);
  //   }
  // };

  React.useEffect(() => {
    speak(screenText, "id-ID", speechRate); // Speak when the component mounts
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    // button reminder medicine label
    <View className="flex-1 bg-white justify-center items-center">
      <View className="w-[85%] grid grid-rows-2 gap-x-2 gap-y-10 mx-auto">
        <View className="w-full flex flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/reminder");
              speak("Kamu mengakses halaman Pengingat", "id-ID", speechRate);
            }}
            className="w-fit h-fit flex flex-col justify-center items-center"
          >
            <View className="border w-[40vw] h-[40vw] border-[#1359A0] rounded-full text-center">
              <Image
                source={require("../../assets/images/icons/IoCalendar.png")}
                style={{ width: 70, height: 70 }}
                className="m-auto"
              />
            </View>
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="absolute -bottom-8 text-[#150E7C] font-extrabold text-2xl"
            >
              Pengingat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/labelScanner");
              speak("Kamu mengakses halaman Baca label", "id-ID", speechRate);
            }}
            className="w-fit h-fit flex flex-col justify-center items-center"
          >
            <View className="border w-[40vw] h-[40vw] border-[#1359A0] rounded-full text-center">
              <Image
                source={require("../../assets/images/icons/IoPhonePortrait.png")}
                style={{ width: 70, height: 70 }}
                className="m-auto"
              />
            </View>
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="absolute -bottom-8 text-[#150E7C] font-extrabold text-2xl"
            >
              Baca Label
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex flex-row justify-between mt-[2%]">
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/history");
              speak("Kamu mengakses halaman riwayat", "id-ID", speechRate);
            }}
            className="w-fit h-fit flex flex-col justify-center items-center"
          >
            <View className="border w-[40vw] h-[40vw] border-[#1359A0] rounded-full text-center">
              <Image
                source={require("../../assets/images/icons/IoHistory.png")}
                style={{ width: 70, height: 70 }}
                className="m-auto"
              />
            </View>
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="absolute -bottom-8 text-[#150E7C] font-extrabold text-2xl"
            >
              Riwayat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {router.push("/(tabs)/simpan"); speak("Kamu mengakses halaman simpan", "id-ID", speechRate);}}
            className="w-fit h-fit flex flex-col justify-center items-center"
          >
            <View className="border w-[40vw] h-[40vw] border-[#1359A0] rounded-full text-center">
              <Image
                source={require("../../assets/images/icons/IoSave.png")}
                style={{ width: 70, height: 70 }}
                className="m-auto"
              />
            </View>
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="absolute -bottom-8 text-[#150E7C] font-extrabold text-2xl"
            >
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

{
  /* <Link
        href={"/reminder"}
        className="w-[280px] h-[60px] bg-[#FFA600] active:opacity-70 flex rounded-[20px] align-middle"
      >
        <Text style={{ fontSize: scaledFontSize('text-2xl') }}  className="text-2xl font-extrabold text-[#150E7C] text-center">
          Reminder medicine intake
        </Text>
      </Link>

      <TouchableOpacity className="w-[280px] h-[60px] bg-[#FFA600] justify-center items-center rounded-[20px]">
        <Text style={{ fontSize: scaledFontSize('text-2xl') }} className="text-2xl font-extrabold text-[#150E7C]">
          Scan medicine label
        </Text>
      </TouchableOpacity>

      <Link
        href={"/history"}
        className="w-[280px] h-[60px] bg-[#FFA600] active:opacity-70 flex rounded-[20px] align-middle"
      >
        <Text style={{ fontSize: scaledFontSize('text-2xl') }} className="text-2xl font-extrabold text-[#150E7C] text-center">
          All history and saved
        </Text>
      </Link>  */
}
