import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList, // Import FlatList
} from "react-native";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";

// Interface untuk item riwayat scan
interface RiwayatScanItem {
  id: string;
  namaObat: string;
  jenisObat?: string;
  kekuatan?: string;
  indikasi?: string;
  dosis?: string;
  dikonsumsi?: string;
  tanggalKadaluarsa?: string;
  petunjukPenyimpanan?: string;
  deskripsi?: string;
  isSaved: boolean;
}

// Data dummy untuk riwayat scan label
const dummyRiwayatScan: RiwayatScanItem[] = [
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
      "Panadol digunakan untuk meredakan demam dan nyeri ringan hingga sedang.",
    isSaved: false,
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
      "Amoxicillin adalah antibiotik penisilin untuk mengobati berbagai infeksi bakteri.",
    isSaved: true,
  },
  {
    id: "3",
    namaObat: "obat cihuy test",
    jenisObat: "Kapsul",
    kekuatan: "500 mg",
    indikasi: "Infeksi bakteri",
    dosis: "3 kali sehari, 1 kapsul",
    dikonsumsi: "Sesuai petunjuk dokter",
    tanggalKadaluarsa: "2026-03-15",
    petunjukPenyimpanan: "Simpan di tempat kering dan sejuk",
    deskripsi:
      "Amoxicillin adalah antibiotik penisilin untuk mengobati berbagai infeksi bakteri.",
    isSaved: true,
  },
  // Tambahkan data dummy lainnya di sini
];

export default function historyScanPage() {
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
  const router = useRouter();

  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [savedItemIds, setSavedItemIds] = useState<{ [key: string]: boolean }>(
    {}
  );

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
  
  const renderItem = ({ item }: { item: RiwayatScanItem }) => {
    const isDetailVisible = expandedItemId === item.id;
    const isCurrentlySaved =
      savedItemIds[item.id] !== undefined
        ? savedItemIds[item.id]
        : item.isSaved;

    const handleContainerPress = () => {
      speak(`Nama obat: ${item.namaObat}`, "id-ID", speechRate);
    };

    const handleLihatDetailPress = () => {
      setExpandedItemId(isDetailVisible ? null : item.id);
      if (!isDetailVisible) {
        let detailText = `Nama obat: ${item.namaObat}, `;
        if (item.jenisObat) detailText += `Jenis obat: ${item.jenisObat}, `;
        if (item.kekuatan) detailText += `Kekuatan: ${item.kekuatan}, `;
        if (item.indikasi) detailText += `Indikasi: ${item.indikasi}, `;
        if (item.dosis) detailText += `Dosis: ${item.dosis}, `;
        if (item.dikonsumsi) detailText += `Dikonsumsi: ${item.dikonsumsi}, `;
        if (item.tanggalKadaluarsa)
          detailText += `Tanggal Kadaluarsa: ${item.tanggalKadaluarsa}, `;
        if (item.petunjukPenyimpanan)
          detailText += `Petunjuk Penyimpanan: ${item.petunjukPenyimpanan}, `;
        if (item.deskripsi) detailText += `Deskripsi: ${item.deskripsi}`;
        speak(detailText, "id-ID", speechRate);
      } else {
        speak(
          `Menyembunyikan detail untuk ${item.namaObat}`,
          "id-ID",
          speechRate
        );
      }
    };

    const handleSimpanPress = () => {
      setSavedItemIds({ ...savedItemIds, [item.id]: !isCurrentlySaved });
      speak(
        isCurrentlySaved
          ? `${item.namaObat} sudah dihapus dari penyimpanan`
          : `${item.namaObat} berhasil disimpan`,
        "id-ID",
        speechRate
      );
    };

    const handleHapusPress = () => {
      // Tambahkan logika penghapusan di sini
      speak(
        `Menghapus riwayat scan untuk ${item.namaObat}`,
        "id-ID",
        speechRate
      );
    };

    return (
      <TouchableOpacity
        onPress={handleContainerPress}
        className="w-[90vw] min-h-[170px] border border-[#150E7C] rounded-[10px] flex items-center px-1 py-2 mb-3"
      >
        <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
        <Text className="text-[#150E7C] my-2">Nama obat: {item.namaObat}</Text>
        <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />
        <View
          className={`${
            isDetailVisible ? "flex" : "hidden"
          } w-[90%] h-fit justify-start items-start content-start my-2`}
        >
          {item.jenisObat && <Text>Jenis obat: {item.jenisObat}</Text>}
          {item.kekuatan && <Text>Kekuatan/Konsentrasi: {item.kekuatan}</Text>}
          {item.indikasi && <Text>Indikasi obat: {item.indikasi}</Text>}
          {item.dosis && <Text>Dosis: {item.dosis}</Text>}
          {item.dikonsumsi && <Text>Dikonsumsi: {item.dikonsumsi}</Text>}
          {item.tanggalKadaluarsa && (
            <Text>Tanggal Kadaluarsa: {item.tanggalKadaluarsa}</Text>
          )}
          {item.petunjukPenyimpanan && (
            <Text>Petunjuk Penyimpanan: {item.petunjukPenyimpanan}</Text>
          )}
          {item.deskripsi && (
            <>
              <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] my-2" />
              <Text>Deskripsi:</Text>
              <Text>{item.deskripsi}</Text>
              <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] mt-1" />
            </>
          )}
        </View>
        {/* three button container */}
        <View className="w-full flex items-center gap-y-3 my-auto">
          {/* button untnuk simpan  */}
          <TouchableOpacity
            onPress={handleSimpanPress}
            className={`${
              isCurrentlySaved ? "border border-[#150E7C]" : "bg-[#150E7C]"
            } w-[70%] h-[40px] flex justify-center items-center rounded-[10px]`}
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className={`${
                isCurrentlySaved ? "text-[#150E7C]" : "text-white"
              } font-normal text-base`}
            >
              {isCurrentlySaved ? "Hasil sudah tersimpan" : "Simpan hasil scan"}
            </Text>
          </TouchableOpacity>
          {/* button hapus */}
          <TouchableOpacity
            onPress={handleHapusPress}
            className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]"
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-white font-normal text-base"
            >
              Hapus
            </Text>
          </TouchableOpacity>
          {/* button lihat detail */}
          <TouchableOpacity
            onPress={handleLihatDetailPress}
            className="bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px]"
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className="text-[#150E7C] font-normal text-base"
            >
              {isDetailVisible ? "Sembunyikan detail" : "Lihat detail"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex flex-1 bg-white items-center content-center p-2">
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

      {/* titlle */}
      <Text className="font-semibold text-2xl mt-2.5 mx-auto text-[#150E7C]">
        Riwayat baca label
      </Text>
      <View className="w-full h-[78vh] flex items-center mt-4">
        <FlatList
          data={dummyRiwayatScan}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}
