import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import { useState, useCallback, useRef } from "react";

// Import Buat Mulai backend
import axios from "axios";
import { useEffect } from "react";
import { auth } from "@/firebase";



// Ini Aku Update bang nyesuain Data Object Medication dari BE
export interface hasilSimpan {
    id : string,
    bahanAktif : bahanAktifList[],
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

// Untuk Nyimpen Data
export interface bahanAktifList {
  nama: string;
  konsentrasi: string;
}


export default function PageSimpan() {
  const { scaledFontSize } = useFontSize();
  const [dataObat, setDataObat] = useState<hasilSimpan[]>([]);
  const { speechRate } = useSpeechRate();
  const [loading, setLoading] = useState(true);

  const isSpeaking = useRef(false);

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
    
    // rawData: whatever the API gave you
    const rawData: any[] = response.data.data;

    // parsedData: guaranteed to have bahanAktif as an array
    const parsedData: hasilSimpan[] = rawData.map((item) => {
      let ba = item.bahanAktif;

      // If it's a JSON string, parse it
      if (typeof ba === "string") {
        try {
          ba = JSON.parse(ba);
        } catch {
          // not JSON — leave as-is
        }
      }

      // If it’s now a single object, wrap it in an array
      if (ba && !Array.isArray(ba) && typeof ba === "object") {
        ba = [ba];
      }

      // If it’s still not an array, fallback to empty
      if (!Array.isArray(ba)) {
        ba = [];
      }

      return {
        ...item,
        bahanAktif: ba as { nama: string; konsentrasi: string }[],
      };
    });

    setDataObat(parsedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (medicationId: string) => {
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
      setDataObat((prevData) =>
        prevData.filter((item) => item.id !== medicationId)
      );
      // console.log("Berhasil menghapus:", response.data);
      speak("Obat berhasil dihapus.", "id-ID", speechRate);
    } catch (error) {
      console.error("Gagal menghapus:", error);
      speak("Gagal menghapus obat.", "id-ID", speechRate);
    }
  };

  // tampilan untuk render (skip aja cik panjang banget soalnya)
  const renderItem = ({ item }: { item: hasilSimpan }) => (
    <TouchableOpacity
      onPress={() => {
        speak(item.namaObat, "id-ID", speechRate);
      }}
      className="w-full min-h-[170px] border border-[#150E7C] rounded-[10px] flex items-center px-1 py-2 mb-5"
    >
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <Text className="text-[#150E7C] my-2">Nama obat: {item.namaObat}</Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />

      <View
        className={`${
          expandedItemId === item.id ? "flex" : "hidden"
        } w-[90%] h-fit justify-start items-start content-start my-2`}
      >
        <Text>Jenis obat: {item.jenisObat}</Text>
        <Text>
          Bahan Aktif: {
            item.bahanAktif
              .map(b => `${b.nama} (${b.konsentrasi})`)
              .join(', ')
          }
        </Text>
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
        <TouchableOpacity
          className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]"
          onPress={() => {
            deleteData(item.id);
            speak(`menghapus obat ${item.namaObat}`, "id-ID", speechRate);
          }}
        >
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-white font-normal text-base"
          >
            Hapus dari tersimpan
          </Text>
        </TouchableOpacity>
        {/* button lihat detail */}
        <TouchableOpacity
          onPress={() => {
            setExpandedItemId(expandedItemId === item.id ? "" : item.id);
            speak(
              `${
                expandedItemId
                  ? `menyembunyikan detail ${item.namaObat}`
                  : `melihat detail ${item.namaObat}`
              }`,
              "id-ID",
              speechRate
            );
          }}
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
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white flex p-2">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke beranda", "id-ID", speechRate);
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
