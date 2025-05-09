import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import { useState, useCallback } from "react";

// Import Buat Mulai backend 
import axios  from "axios";
import { useEffect } from "react";
import { auth } from "@/firebase";

// Ini Aku Update bang nyesuain Data Object Medication dari BE
export interface hasilSimpan {
    id : string,
    bahanAktif : string,
    namaObat: string,
    jenisObat: string,
    kekuatanKonsentrasi: string,
    indikasiObat: string,
    aturanPakai: string,
    peringatanPerhatian : string,
    tanggalKadaluarsa: string,
    petunjukPenyimpanan: string,
    deskripsiPenggunaanObat: string,
};

export default function PageSimpan() {
  const { scaledFontSize } = useFontSize();
  const [dataObat, setDataObat] = useState<hasilSimpan[]>([]);
  const [loading, setLoading] = useState(true);

  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };

  // Jalanin Fetch Data Selalu setelah Buka Halaman
  useEffect(() => {
    fetchData();
  }, []);
  
  const [isShowDetail, setIsShowDetail] = useState(false);

  const [expandedItemId, setExpandedItemId] = useState<string>(""); // Menyimpan ID item yang sedang detailnya ditampilkan

  // Ambil Data Obat dari Backend
  const fetchData = async () => {
    try {
    setLoading(true);

    const user = auth.currentUser;
    const token = await user?.getIdToken();

    const response = await axios("https://audired-820e0.et.r.appspot.com/api/medication/my",{
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data : {
        userid : user
      }
    })
    // console.log(response.data) 
    setDataObat(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }


  const deleteData = async (medicationId : string) =>{
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const response = await axios.delete(
      `https://audired-820e0.et.r.appspot.com/api/medication/my/${medicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDataObat((prevData) => prevData.filter(item => item.id !== medicationId));
    // console.log("Berhasil menghapus:", response.data);
    speak("Obat berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      speak("Gagal menghapus obat.");
    }
  }

  // tampilan untuk render (skip aja cik panjang banget soalnya)
  const renderItem = ({ item } : {item : hasilSimpan}) => (
    <View className="w-full min-h-[170px] border border-[#150E7C] rounded-[10px] flex items-center px-1 py-2 mb-5">
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <Text className="text-[#150E7C] my-2">Nama obat: {item.namaObat}</Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />

      <View
        className={`${
          expandedItemId === item.id ? "flex" : "hidden"
        } w-[90%] h-fit justify-start items-start content-start my-2`}
      >
        <Text>Jenis obat: {item.jenisObat}</Text>
        <Text>Bahan Aktif: {item.bahanAktif}</Text>
        <Text>Kekuatan/Konsentrasi: {item.kekuatanKonsentrasi}</Text>
        <Text>Indikasi obat: {item.indikasiObat}</Text>
        <Text>Aturan Pakai: {item.aturanPakai}</Text>
        <Text>Tanggal Kadaluarsa: {item.tanggalKadaluarsa}</Text>
        <Text>Petunjuk Penyimpanan: {item.petunjukPenyimpanan}</Text>
        <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] my-2" />
        <Text>Deskripsi:</Text>
        <Text>{item.deskripsiPenggunaanObat}</Text>
        <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] mt-1" />
      </View>

      {/* two button container */}
      <View className="w-full flex items-center gap-y-3 my-auto">
        {/* button hapus */}
        <TouchableOpacity className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]" onPress={() => deleteData(item.id)}>
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
    <View className="flex-1 bg-white flex p-2">
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
      <View className="w-full h-[78vh] px-[3%] flex mt-4">
        {/* start of scan tersimpan container */}
        <FlatList
          data={dataObat} // Ini Data Diambil Dari Fetch Data ( Disimpen di dalam dataObat)
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        {/* end of scan tersimpan container */}
      </View>
    </View>
  );
}
