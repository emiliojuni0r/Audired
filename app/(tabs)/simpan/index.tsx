import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import { useState } from "react";

export interface hasilSimpan {
    id : string,
    namaObat: string,
    jenisObat: string,
    kekuatan: string,
    indikasi: string,
    dosis: string,
    dikonsumsi: string,
    tanggalKadaluarsa: string,
    petunjukPenyimpanan: string,
    deskripsi: string,
};

const dummyHasilSimpan = [
  {
    id: "1",
    namaObat: "Panadol",
    jenisObat: "Tablet",
    kekuatan: "500 mg",
    indikasi: "Demam",
    dosis: "3 kali sehari sampai sembuh",
    dikonsumsi: "Sesudah Makan",
    tanggalKadaluarsa: "Tidak ditemukan",
    petunjukPenyimpanan: "Tidak ditemukan",
    deskripsi:
      "Obat di atas adalah Panadol, digunakan untuk meredakan demam dan nyeri ringan hingga sedang.",
  },
  {
    id: "2",
    namaObat: "Amoxicillin",
    jenisObat: "Kapsul",
    kekuatan: "500 mg",
    indikasi: "Infeksi bakteri",
    dosis: "3 kali sehari, 1 kapsul",
    dikonsumsi: "Sesuai petunjuk dokter",
    tanggalKadaluarsa: "2026-03-15",
    petunjukPenyimpanan: "Simpan di tempat kering dan sejuk",
    deskripsi:
      "Amoxicillin adalah antibiotik penisilin yang digunakan untuk mengobati berbagai jenis infeksi bakteri.",
  },
  // Tambahkan data dummy lainnya di sini jika perlu
];

export default function PageSimpan() {
  const { scaledFontSize } = useFontSize();
  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };
  const [isShowDetail, setIsShowDetail] = useState(false);

  const [expandedItemId, setExpandedItemId] = useState<string>(""); // Menyimpan ID item yang sedang detailnya ditampilkan

  // tampilan untuk render (skip aja cik panjang banget soalnya)
  const renderItem = ({ item } : {item : hasilSimpan}) => (
    <View className="w-full min-h-[170px] border border-[#150E7C] rounded-[10px] flex items-center px-1 py-2 mb-2">
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <Text className="text-[#150E7C] my-2">Nama obat: {item.namaObat}</Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />

      <View
        className={`${
          expandedItemId === item.id ? "flex" : "hidden"
        } w-[90%] h-fit justify-start items-start content-start my-2`}
      >
        <Text>Jenis obat: {item.jenisObat}</Text>
        <Text>Kekuatan/Konsentrasi: {item.kekuatan}</Text>
        <Text>Indikasi obat: {item.indikasi}</Text>
        <Text>Dosis: {item.dosis}</Text>
        <Text>Dikonsumsi: {item.dikonsumsi}</Text>
        <Text>Tanggal Kadaluarsa: {item.tanggalKadaluarsa}</Text>
        <Text>Petunjuk Penyimpanan: {item.petunjukPenyimpanan}</Text>
        <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] my-2" />
        <Text>Deskripsi:</Text>
        <Text>{item.deskripsi}</Text>
        <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] mt-1" />
      </View>

      {/* two button container */}
      <View className="w-full flex items-center gap-y-3 my-auto">
        {/* button hapus */}
        <TouchableOpacity className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]">
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-white font-normal text-base"
          >
            Hapus dari tersimpan
          </Text>
        </TouchableOpacity>
        {/* button lihat detail */}
        <TouchableOpacity
          onPress={() =>
            setExpandedItemId(expandedItemId === item.id ? "" : item.id)
          }
          className="bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]"
        >
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-[#150E7C] font-normal text-base"
          >
            {expandedItemId === item.id ? "Sembunyikan detail" : "Lihat detail"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white flex p-2">
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
      <Text className="font-semibold text-2xl mt-2.5 mx-auto">
        Lihat hasil scan yang tersimpan
      </Text>

      {/* list of hasil scan yang tersinmpan */}
      <View className="w-full h-full px-[3%] mt-4">
        {/* start of scan tersimpan container */}
        <FlatList
          data={dummyHasilSimpan}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        {/* end of scan tersimpan container */}
      </View>
    </ScrollView>
  );
}
