import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { View, Text, Touchable, TouchableOpacity, Image } from "react-native";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { useSpeechRate } from "@/context/SpeechRateContext";
import {saveItem,getItem} from "@/context/SecureStorage";
import {deleteScheduleMedicationReminder,deleteScheduleMedicatioReminderForever} from "@/context/ScheduleNotifications";


// buat interface dulu bang
export interface ReminderData {
  id : string
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
  const [reminderData, setReminderData] = useState<ReminderData[]>([]);  

  // ini kumpulan variable untuk gambar sesuai dengan tipe obat

  const imgTablet = require("../../../assets/images/icons/Tablet.png");

  const imgOles = require("../../../assets/images/icons/Oles.png");

  const imgCair = require("../../../assets/images/icons/Cair.png");

  const imgKapsul = require("../../../assets/images/icons/Kapsul.png");

  const imgPerban = require("../../../assets/images/icons/Perban.png");

  const imgSuntik = require("../../../assets/images/icons/Suntik.png");

  const imgTetes = require("../../../assets/images/icons/Tetes.png");

  const imgInhaler = require("../../../assets/images/icons/Inhaler.png");

  const handleReminderData = async (): Promise<ReminderData[] | null> => {
    try {
      const rawData = await getItem("jadwalObat");
      console.log(rawData)
      if (!rawData) return null;
  
      const parsedData: ReminderData[] = JSON.parse(rawData);
      return parsedData;
    } catch (error) {
      console.error("Error reading reminder data:", error);
      return null;
    }
  }

  const fetchReminder = async () => {
    const reminder = await handleReminderData();
    if (reminder) {
      setReminderData(reminder);
      console.log("BErhasil AMbil Data bang")
    }
  }

  const deleteReminder = async () => {

  }

  const deleteReminderForever = async () => {

  }


  useEffect(() => {
    fetchReminder(); // Ngambil Data dari Lokal
  }, []);
  

  const renderItemReminder = ({item}: {item: ReminderData}) => (
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
                  className="text-white font-normal text-base"
                >
                  {lihatDetail ? "Sembunyikan Detail" : "Lihat Detail"}
                </Text>
              </TouchableOpacity>
            </View>
  );

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
          renderItem={renderItemReminder}
          keyExtractor={(item) => item.id}
        />
      </View>
      {/* end of  container list jadwal */}
    </View>
  );
}
