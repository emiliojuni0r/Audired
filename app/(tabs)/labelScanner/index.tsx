import { Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import Camera from "@/components/camera";

export default function LabelScanner() {
  const { scaledFontSize } = useFontSize();
  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };

  const [modeTakePicture, setModeTakePicture] = useState(false);

  const panduanSpeech =
    // "Langkah menggunakan fitur scan, 1. Tekan tombol mulai dibawah panduan,2. Arahkan obat atau label ke kamera 3. Potret dengan menekan tombol pada kamera 4. Tunggu beberapa saat sampai muncul hasil 5. Dengan fitur text-to-speech, dapat membacakan hasil scan 6. Hasil dapat dilihat kembali di riwayat dan bisa juga disimpan ke halaman simpan. Note Jika hasil scan error, coba ulangi kembali proses dari awal dengan tambahan tap bagian tengah agar kamera dapat fokus lalu tekan tombol potret";
    " ini panduan dummy dummy dummy";
  const speechDelay = 3000;

  useEffect(() => {
    // This effect will only run once after the initial render
    const timeoutId = setTimeout(() => {
      speak(panduanSpeech, 'id-ID'); // Setting language to Indonesian (Indonesia) as per your location
    }, speechDelay);

    return () => {
      clearTimeout(timeoutId); // Cleanup the timeout if the component unmounts
      Speech.stop(); // Stop any ongoing speech
    };
  }, []);

  return (
    <View className="flex-1 bg-white items-center p-2">
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

      {modeTakePicture ? (
        <View className="w-full h-full">
          <Camera></Camera> // ini test aja untuk sementara
        </View>
      ) : (
        <>
          <View className="w-[85%] h-fit flex border border-[#150E7C] rounded-[20px] mt-4 p-4">
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="text-[#150E7C] font-extrabold text-2xl mx-auto"
            >
              Panduan fitur baca label
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-semibold"
            >
              Langkah menggunakan fitur scan:
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              1. Tekan tombol mulai dibawah panduan
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              2. Arahkan obat atau label ke kamera{" "}
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              3. Potret dengan menekankan tombol pada kamera
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              4. Tunggu beberapa saat sampai muncul hasil
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              5. Dengan fitur text-to-speech, dapat membacakan hasil scan
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              6. Hasil dapat dilihat kembali di riwayat dan bisa juga disimpan
              ke halaman simpan
            </Text>

            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-semibold mt-4"
            >
              Note:
            </Text>
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-base font-normal"
            >
              Jika hasil scan error, coba ulangi kembali proses dari awal dengan
              tambahan tap bagian tengah agar kamera dapat fokus lalu tekan
              tombol potret
            </Text>
          </View>

          {/* button mulai */}
          <TouchableOpacity
            onPress={() => {
              setModeTakePicture(true);
              speak("Memulai Potret gambar", "id-ID");
            }}
            className="w-[85%] h-[10%] bg-[#150E7C] rounded-[20px] my-auto flex justify-center items-center"
          >
            <Text
              style={{ fontSize: scaledFontSize("text-2xl") }}
              className="text-white text-2xl font-extrabold"
            >
              Mulai
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
