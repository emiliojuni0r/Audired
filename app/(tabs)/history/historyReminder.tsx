import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList, // Import FlatList
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useSpeechRate } from "@/context/SpeechRateContext";

// Interface untuk item riwayat pengingat
interface RiwayatPengingatItem {
  id: string;
  namaObat: string;
  tipeObat:
    | "Tablet"
    | "Oles"
    | "Cair"
    | "Kapsul"
    | "Perban"
    | "Suntik"
    | "Tetes"
    | "Inhaler";
  dosis: string;
  frekuensi: string;
  terakhirDinonaktifkan?: string;
  sudahDikonsumsiSelama?: string;
  isActive: boolean;
}

// Data dummy untuk riwayat pengingat
const dummyRiwayatPengingat: RiwayatPengingatItem[] = [
  {
    id: "1",
    namaObat: "Paracetamol",
    tipeObat: "Tablet",
    dosis: "1 tablet",
    frekuensi: "3 kali sehari",
    terakhirDinonaktifkan: "58 menit lalu",
    sudahDikonsumsiSelama: "3 hari",
    isActive: false,
  },
  {
    id: "2",
    namaObat: "Salep Luka",
    tipeObat: "Oles",
    dosis: "Secukupnya",
    frekuensi: "2 kali sehari",
    isActive: true,
  },
  {
    id: "3",
    namaObat: "Amoxicillin",
    tipeObat: "Kapsul",
    dosis: "1 kapsul",
    frekuensi: "3 kali sehari",
    sudahDikonsumsiSelama: "5 hari",
    isActive: true,
  },
  {
    id: "4",
    namaObat: "Insto",
    tipeObat: "Tetes",
    dosis: "1-2 tetes",
    frekuensi: "3 kali sehari",
    terakhirDinonaktifkan: "1 jam yang lalu",
    isActive: false,
  },
  // Tambahkan data dummy lainnya di sini
];

export default function historyReminder() {
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
  const { scaledFontSize } = useFontSize();
  const {speechRate} = useSpeechRate();
  const [lihatDetailId, setLihatDetailId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<{ [key: string]: boolean }>(
    {}
  );

  // ini kumpulan variable untuk gambar sesuai dengan tipe obat
  const imageSources = {
    Tablet: require("../../../assets/images/icons/Tablet.png"),
    Oles: require("../../../assets/images/icons/Oles.png"),
    Cair: require("../../../assets/images/icons/Cair.png"),
    Kapsul: require("../../../assets/images/icons/Kapsul.png"),
    Perban: require("../../../assets/images/icons/Perban.png"),
    Suntik: require("../../../assets/images/icons/Suntik.png"),
    Tetes: require("../../../assets/images/icons/Tetes.png"),
    Inhaler: require("../../../assets/images/icons/Inhaler.png"),
  };

  const renderItem = ({ item }: { item: RiwayatPengingatItem }) => {
    const isDetailVisible = lihatDetailId === item.id;
    const isActiveItem =
      activeItemId[item.id] !== undefined
        ? activeItemId[item.id]
        : item.isActive;
    const imageSource =
      imageSources[item.tipeObat] ||
      require("../../../assets/images/icons/Tablet.png"); // Default ke Tablet jika tidak ditemukan

    return (
      <View className="w-[80vw] min-h-[15vh] border border-[#150E7C] rounded-[10px] items-center p-1 mb-3">
        <View className="w-[90%] h-fit flex flex-row items-center mx-auto">
          <Image
            source={imageSource}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          {/* tampilan ketika belum di klik 'lihat detail' */}
          <Text
            className={`${
              isDetailVisible ? "hidden" : "flex"
            } text-base font-normal text-[#150E7C] ml-3`}
          >
            {item.namaObat}, {item.tipeObat.toLowerCase()}: {item.frekuensi}
          </Text>
          {/* ini nanti muncul setelah 'lihat detail' */}
          <View className={`${isDetailVisible ? "flex" : "hidden"} ml-3`}>
            <Text className="font-semibold">
              {item.namaObat}, {item.tipeObat}
            </Text>
            <Text>Dosis: {item.dosis}</Text>
            <Text>Jarak waktu: {item.frekuensi}</Text>
          </View>
        </View>
        <View
          className={`${
            isDetailVisible ? "flex" : "hidden"
          } w-full items-center my-3`}
        >
          <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
          {item.sudahDikonsumsiSelama && (
            <Text className="text-[#150E7C] my-2">
              Obat Pernah dikonsumsi selama {item.sudahDikonsumsiSelama}
            </Text>
          )}
          <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
          {/* ini untuk kapan terakhir dinonaktifkan */}
          {item.terakhirDinonaktifkan && (
            <Text className="text-base">
              Jadwal dinonaktifkan sejak: {item.terakhirDinonaktifkan}
            </Text>
          )}
          {/* ini button untuk aktifkan kembali jadwal */}
          <TouchableOpacity
            onPress={() => {
              setActiveItemId({ ...activeItemId, [item.id]: !isActiveItem });
            }}
            className={`${
              isActiveItem ? "bg-white border border-[#150E7C]" : "bg-[#150E7C]"
            } w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className={`${
                isActiveItem ? "text-[#150E7C]" : "text-white"
              } font-normal text-base`}
            >
              {isActiveItem
                ? "Jadwal telah diaktifkan kembali"
                : "Aktifkan kembali jadwal"}
            </Text>
          </TouchableOpacity>
          {/* ini untuk delete */}
          <TouchableOpacity
            onPress={() => {
              // Tambahkan logika penghapusan di sini
            }}
            className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
          >
            <Text
              style={{ fontSize: scaledFontSize("text-base") }}
              className={"text-[#150E7C] font-normal text-base"}
            >
              Hapus secara permanen
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setLihatDetailId(isDetailVisible ? null : item.id);
          }}
          className="bg-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-auto"
        >
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-white font-normal text-base"
          >
            {isDetailVisible ? "sembunyikan detail" : "Lihat Detail"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex flex-1 bg-white items-center content-center p-2">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke Beranda", "id-ID", speechRate);
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
        Riwayat pengingat jadwal obat
      </Text>

      {/* start of list riwayat pengingat */}
      <View className="w-full h-[78vh] flex items-center mt-4">
        <FlatList
          data={dummyRiwayatPengingat}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}
