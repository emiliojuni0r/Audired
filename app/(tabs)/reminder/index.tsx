import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { saveItem, getItem } from "@/context/SecureStorage";
import {
  deleteScheduleMedicationReminder,
  deleteScheduleMedicatioReminderForever,
} from "@/context/ScheduleNotifications";

// buat interface dulu bang
export interface ReminderData {
  id: string;
  namaObat: string;
  jenisObat: string;
  dosisObat: string;
  intervalHour: number;
  intervalMinute: number;
  startHour: number;
  startMinute: number;
  timesPerDay: number;
  notificationTimes: string[]; // ISO date strings
  isActive: boolean;
}

// Data dummy (contoh)
const dummyReminderData: ReminderData[] = [
  {
    id: "1",
    namaObat: "Paracetamol",
    jenisObat: "Tablet",
    dosisObat: "500mg",
    intervalHour: 8,
    intervalMinute: 0,
    startHour: 9,
    startMinute: 0,
    timesPerDay: 3,
    notificationTimes: ["2025-05-11T09:00:00.000Z", "2025-05-11T17:00:00.000Z"],
    isActive: true,
  },
  {
    id: "2",
    namaObat: "Amoxicillin",
    jenisObat: "Kapsul",
    dosisObat: "250mg",
    intervalHour: 6,
    intervalMinute: 0,
    startHour: 8,
    startMinute: 30,
    timesPerDay: 4,
    notificationTimes: [
      "2025-05-11T08:30:00.000Z",
      "2025-05-11T14:30:00.000Z",
      "2025-05-11T20:30:00.000Z",
    ],
    isActive: true,
  },
  {
    id: "3",
    namaObat: "Salep Luka",
    jenisObat: "Oles",
    dosisObat: "Secukupnya",
    intervalHour: 12,
    intervalMinute: 0,
    startHour: 7,
    startMinute: 0,
    timesPerDay: 2,
    notificationTimes: ["2025-05-11T07:00:00.000Z", "2025-05-11T19:00:00.000Z"],
    isActive: false,
  },
];

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
  const [reminderData, setReminderData] = useState<ReminderData[]>(
    dummyReminderData // Menggunakan data dummy di sini untuk inisialisasi awal
  );

  // ini kumpulan variable untuk gambar sesuai dengan tipe obat

  const imgTablet = require("../../../assets/images/icons/Tablet.png");

  const imgOles = require("../../../assets/images/icons/Oles.png");

  const imgCair = require("../../../assets/images/icons/Cair.png");

  const imgKapsul = require("../../../assets/images/icons/Kapsul.png");

  const imgPerban = require("../../../assets/images/icons/Perban.png");

  const imgSuntik = require("../../../assets/images/icons/Suntik.png");

  const imgTetes = require("../../../assets/images/icons/Tetes.png");

  const imgInhaler = require("../../../assets/images/icons/Inhaler.png");

  const getImageByType = (jenisObat: string) => {
    switch (jenisObat.toLowerCase()) {
      case "tablet":
        return imgTablet;
      case "oles":
        return imgOles;
      case "cair":
        return imgCair;
      case "kapsul":
        return imgKapsul;
      case "perban":
        return imgPerban;
      case "suntik":
        return imgSuntik;
      case "tetes":
        return imgTetes;
      case "inhaler":
        return imgInhaler;
      default:
        return imgTablet; // Gambar default jika tidak dikenali
    }
  };

  const handleReminderData = async (): Promise<ReminderData[] | null> => {
    try {
      const rawData = await getItem("jadwalObat");
      console.log(rawData);
      if (!rawData) return null;

      const parsedData: ReminderData[] = JSON.parse(rawData);
      return parsedData;
    } catch (error) {
      console.error("Error reading reminder data:", error);
      return null;
    }
  };

  const fetchReminder = async () => {
    const reminder = await handleReminderData();
    if (reminder) {
      setReminderData(reminder);
      console.log("Berhasil Ambil Data bang");
    }
  };

  const deleteReminder = async () => {};

  const deleteReminderForever = async () => {};

  useEffect(() => {
    // fetchReminder(); // Ngambil Data dari Lokal (sementara pakai dummy)
  }, []);

  return (
    <View className="flex-1 bg-white align-top p-2">
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center"
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

      {/* button untuk nambah jadwal */}
      <TouchableOpacity
        onPress={() => {
          router.navigate("/(tabs)/reminder/addReminder");
          speak("Menambahkan Jadwal", "id-ID", speechRate);
        }}
        className="w-[80%] h-[60px] bg-[#150E7C] rounded-[20px] flex items-center mx-auto mt-3"
      >
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
          Jadwal yang sedang berlangsung: {reminderData.filter((item) => item.isActive).length}
        </Text>

        {/* start of generate list jadwal minum obat yang ada */}
        {/* container */}
        <FlatList
          data={reminderData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="w-[95%] min-h-[15vh] border border-[#150E7C] rounded-[10px] items-center p-2 mb-3">
              <View className="w-[95%] h-fit flex flex-row items-center ">
                <Image
                  source={getImageByType(item.jenisObat)}
                  width={100}
                  height={100}
                />

                {/* tampilan ketika belum di klik 'lihat detail' */}

                <Text
                  className={`${
                    lihatDetail ? "hidden" : "flex"
                  } text-base font-normal text-[#150E7C] ml-3`}
                >
                  {item.namaObat}, {item.intervalHour} jam {item.intervalMinute} menit
                </Text>

                {/* ini nanti muncul setelah 'lihat detail' */}

                <View className={`${lihatDetail ? "flex" : "hidden"} ml-3`}>
                  <Text>
                    {item.namaObat}, {item.jenisObat}
                  </Text>

                  <Text>Dosis: {item.dosisObat}</Text>

                  <Text>
                    Jarak waktu: {item.intervalHour} jam ({item.timesPerDay}x sehari)
                  </Text>
                </View>
              </View>

              <View
                className={`${
                  lihatDetail ? "flex" : "hidden"
                } w-full items-center my-3`}
              >
                <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />

                <Text className="text-[#150E7C] my-2">
                  Jadwal mendatang : {/* Implementasikan logika perhitungan waktu mendatang */}
                  {item.notificationTimes.length > 0
                    ? new Date(item.notificationTimes[0]).toLocaleTimeString(
                        "id-ID",
                        { hour: "2-digit", minute: "2-digit" }
                      )
                    : "Tidak ada jadwal"}
                </Text>

                <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />

                {/* ini untuk kapan terakhir dinonaktifkan */}

                <Text className="text-base my-1">
                  Telah berlangsung selama: {/* Implementasikan logika perhitungan durasi */}
                  {item.isActive ? "Sedang Berlangsung" : "Belum diaktifkan"}
                </Text>

                {/* ini button untuk aktifkan kembali jadwal */}

                <TouchableOpacity
                  onPress={() => {
                    // Implementasikan logika untuk mengaktifkan/menonaktifkan jadwal
                    // setIsActive(!isActive);
                  }}
                  className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
                >
                  <Text
                    style={{ fontSize: scaledFontSize("text-base") }}
                    className={`
                      text-[#150E7C]
                    } font-normal text-base`}
                  >
                    {item.isActive
                      ? "Matikan jadwal sementara"
                      : "Aktifkan jadwal"}
                  </Text>
                </TouchableOpacity>

                {/* ini untuk delete */}

                <TouchableOpacity
                  onPress={() => {
                    // Implementasikan logika untuk menghapus jadwal selamanya
                  }}
                  className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
                >
                  <Text
                    style={{ fontSize: scaledFontSize("text-base") }}
                    className={"text-[#150E7C] font-normal text-base"}
                  >
                    Hapus jadwal selamanya
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
                  {lihatDetail ? "Sembunyikan Detail" : "Lihat Detail"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      {/* end of  container list jadwal */}
    </View>
  );
}