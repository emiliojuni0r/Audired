import { Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function LabelScannerResult() {
  const { scaledFontSize } = useFontSize();
  const [isSaved, setIsSaved] = useState(false);
  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };

  return (
    <View className="flex-1 bg-white items-center p-2">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke beranda");
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
      <Text className="font-semibold text-2xl mt-2.5">
        Hasil scan sudah siap
      </Text>
      {/* hasil obat container */}
      <View className="w-[88%] h-fit border border-[#150E7C] rounded-[10px] mt-3.5 flex items-center p-2">
        {/* start of hasil scan obat content container */}
        <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
        <Text className="text-[#150E7C] my-2">Nama obat: Panadol</Text>
        <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />
        <View className="w-[90%] h-fit justify-start items-start content-start">
          <Text>Jenis obat: Tablet</Text>
          <Text>Kekuatan/Konsentrasi: 500 mg</Text>
          <Text>Indikasi obat: Demam</Text>
          <Text>Dosis: 3 kali sehari sampai sembuh</Text>
          <Text>Dikonsumsi: Sesudah Makan</Text>
          <Text>Tanggal Kadaluarsa: Tidak ditemukan</Text>
          <Text>Petunjuk Penyimpanan: Tidak ditemukan</Text>
          <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] my-2" />
          <Text>Deskripsi:</Text>
          <Text>
            Obat di atas adalah Amoxicillin, antibiotik yang digunakan untuk
            mengobati infeksi bakteri. Gunakan obat ini 3 kali sehari, 1 tablet.
            Waktu penggunaan dan durasi pengobatan harus sesuai petunjuk dokter
          </Text>
        </View>
        {/* end of hasil scan obat content container */}
      </View>

      {/* button */}
      <View className="flex flex-col w-[90%] h-fit justify-center items-center gap-y-3 mt-3">
        <TouchableOpacity className="bg-[#150E7C] w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]">
          <Text className="text-white text-2xl font-extrabold">
            Bacakan Hasil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsSaved(!isSaved);
            speak(isSaved ? "batalkan simpan hasil" : "Simpan hasil");
          }}
          className={`${
            isSaved ? "bg-white border border-[#150E7C]" : "bg-[#150E7C]"
          } w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]`}
        >
          <Text
            className={`${
              isSaved ? "text-[#150E7C]" : "text-white"
            } text-2xl font-extrabold`}
          >
            {isSaved ? "Hasil Sudah tersimpan" : "Simpan Hasil"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.back();
            speak("Kembali ke beranda");
          }}
          className="bg-[#150E7C] w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]"
        >
          <Text className="text-white text-2xl font-extrabold">
            Kembali ke home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
