import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { View, Text, Touchable, TouchableOpacity, Image } from "react-native";
import * as Speech from "expo-speech";
import { useRef, useState } from "react";
import { useSpeechRate } from "@/context/SpeechRateContext";

export default function ReminderScreen() {
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
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

  const [lihatDetail, SetLihatDetail] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // ini kumpulan variable untuk gambar sesuai dengan tipe obat

  const imgTablet = require("../../../assets/images/icons/Tablet.png");

  const imgOles = require("../../../assets/images/icons/Oles.png");

  const imgCair = require("../../../assets/images/icons/Cair.png");

  const imgKapsul = require("../../../assets/images/icons/Kapsul.png");

  const imgPerban = require("../../../assets/images/icons/Perban.png");

  const imgSuntik = require("../../../assets/images/icons/Suntik.png");

  const imgTetes = require("../../../assets/images/icons/Tetes.png");

  const imgInhaler = require("../../../assets/images/icons/Inhaler.png");

  return (
    <View className="flex-1 bg-white align-top p-2">
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center"
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

      {/* button untuk nambah jadwal */}
      <TouchableOpacity className="w-[80%] h-[60px] bg-[#150E7C] rounded-[20px] flex items-center mx-auto mt-3">
        <Text
          style={{ fontSize: scaledFontSize("text-2xl") }}
          className="my-auto text-2xl text-white font-bold"
        >
          Tambahkan jadwal baru
        </Text>
      </TouchableOpacity>

      {/* line ngebatasin apalah itu */}
      <View className="w-[90%] h-[1px] bg-[#150E7C] mx-auto mt-4"></View>

      {/* start of  container list jadwal */}
      <View className="w-[95%] h-full border border-[#150E7C] rounded-t-[10px] mt-6 mx-auto flex flex-col items-center p-2">
        {/* text untuk total jadwal yang berlangsung */}
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="text-base font-semibold text-[#150E7C] mb-3"
        >
          Jadwal yang sedang berlangsung: 3
        </Text>

        {/* start of generate list jadwal minum obat yang ada */}
        {/* container */}

        <View className="w-[95%] min-h-[15vh] border border-[#150E7C] rounded-[10px] items-center p-2">
          <View className="w-[95%] h-fit flex flex-row items-center ">
            <Image source={imgTablet} width={100} height={100} />

            {/* tampilan ketika belum di klik 'lihat detail' */}

            <Text
              className={`${
                lihatDetail ? "hidden" : "flex"
              } text-base font-normal text-[#150E7C] ml-3`}
            >
              Paracetamol, 5 jam 21 menit
            </Text>

            {/* ini nanti muncul setelah 'lihat detail' */}

            <View className={`${lihatDetail ? "flex" : "hidden"} ml-3`}>
              <Text>Paracetamol, tablet</Text>

              <Text>Dosis: 1 tablet</Text>

              <Text>Jarak waktu: 8 jam (3x sehari)</Text>
            </View>
          </View>

          <View
            className={`${
              lihatDetail ? "flex" : "hidden"
            } w-full items-center my-3`}
          >
            <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />

            <Text className="text-[#150E7C] my-2">
              Jadwal mendatang : 5 jam 21 menit
            </Text>

            <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />

            {/* ini untuk kapan terakhir dinonaktifkan */}

            <Text className="text-base my-1">
              Telah berlangsung selama: 3 hari
            </Text>

            {/* ini button untuk aktifkan kembali jadwal */}

            <TouchableOpacity
              onPress={() => {
                setIsActive(!isActive);
              }}
              className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
            >
              <Text
                style={{ fontSize: scaledFontSize("text-base") }}
                className={`
                  text-[#150E7C]
                } font-normal text-base`}
              >
                Matikan jadwal sementara
              </Text>
            </TouchableOpacity>

            {/* ini untuk delete */}

            <TouchableOpacity
              onPress={() => {}}
              className={`

"bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
            >
              <Text
                style={{ fontSize: scaledFontSize("text-base") }}
                className={"text-[#150E7C] font-normal text-base"}
              >
                Matikan jadwal selamanya
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              SetLihatDetail(!lihatDetail);
            }}
            className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-auto"
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-white font-normal text-base"
            >
              {lihatDetail ? "sembunyikan detail" : "Lihat Detail"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* end of  container list jadwal */}
    </View>
  );
}
