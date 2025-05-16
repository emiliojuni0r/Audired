import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { saveItem, getItem } from "@/context/SecureStorage";
import {
  deleteScheduleMedicationReminder,
  deleteScheduleMedicatioReminderForever,
  scheduleMultipleReminders,
} from "@/context/ScheduleNotifications";

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
  notificationIds: string[];
  notificationTimes: string[];
  isActive: boolean;
}

export default function ReminderScreen() {
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
  const isSpeaking = useRef(false);

  const speak = (text: string, languageCode = "id-ID", speakSpeed: number) => {
    if (isSpeaking.current) {
      Speech.stop();
    }
    isSpeaking.current = true;
    Speech.speak(text, {
      language: languageCode,
      rate: speakSpeed,
      onStopped: () => {
        isSpeaking.current = false;
      },
      onDone: () => {
        isSpeaking.current = false;
      },
    });
  };

  const [lihatDetail, setLihatDetail] = useState<{ [key: string]: boolean }>({});
  const [reminderData, setReminderData] = useState<ReminderData[]>([]);

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
        return imgTablet;
    }
  };

  const handleReminderData = async (): Promise<ReminderData[]> => {
  try {
    const rawData = await getItem("jadwalObat");
    if (!rawData) return [];

    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      console.warn("Data jadwalObat bukan array, mengembalikan array kosong.");
      return [];
    }

    // Validasi setiap item memiliki struktur yang benar
    const validatedData = parsedData.filter((item: ReminderData) => {
      const isValid =
        item &&
        typeof item.id === "string" &&
        typeof item.namaObat === "string" &&
        typeof item.jenisObat === "string" &&
        typeof item.dosisObat === "string" &&
        typeof item.intervalHour === "number" &&
        typeof item.intervalMinute === "number" &&
        typeof item.startHour === "number" &&
        typeof item.startMinute === "number" &&
        typeof item.timesPerDay === "number" &&
        Array.isArray(item.notificationIds) &&
        Array.isArray(item.notificationTimes) &&
        typeof item.isActive === "boolean";
      if (!isValid) {
        console.warn("Item reminder tidak valid:", item);
      }
      return isValid;
    });

    return validatedData;
  } catch (error) {
    console.error("Error reading reminder data:", error);
    return [];
  }
};

  const fetchReminder = async () => {
    const reminder = await handleReminderData();
    if (reminder) {
      setReminderData(reminder);
      console.log("Berhasil Ambil Data");
    }
  };

  const deleteReminder = async (id: string, notificationIds: string[]) => {
  try {
    // Pastikan notificationIds adalah array dan tidak kosong
    if (Array.isArray(notificationIds) && notificationIds?.length > 0) {
      for (const notifId of notificationIds) {
        await deleteScheduleMedicationReminder(notifId);
      }
    } else {
      console.warn("notificationIds tidak valid atau kosong:", notificationIds);
    }

    // Ambil data existing reminders
    const existingRemindersJSON = await getItem("jadwalObat");
    let existingReminders: ReminderData[] = [];

    // Pastikan data yang diambil valid
    if (existingRemindersJSON) {
      try {
        existingReminders = JSON.parse(existingRemindersJSON);
        if (!Array.isArray(existingReminders)) {
          console.warn("Data jadwalObat bukan array, menginisialisasi ulang.");
          existingReminders = [];
        }
      } catch (parseError) {
        console.error("Gagal parsing jadwalObat:", parseError);
        existingReminders = [];
      }
    }

    // Perbarui status isActive untuk reminder yang sesuai
    existingReminders = existingReminders.map((reminder: ReminderData) =>
      reminder.id === id ? { ...reminder, isActive: false } : reminder
    );

    // Simpan kembali data
    await saveItem("jadwalObat", JSON.stringify(existingReminders));
    setReminderData(existingReminders);
    speak("Jadwal dinonaktifkan", "id-ID", speechRate);
  } catch (error) {
    console.error("Gagal menonaktifkan jadwal:", error);
    speak("Gagal menonaktifkan jadwal", "id-ID", speechRate);
  }
};

  const deleteReminderForever = async (id: string, notificationIds: string[]) => {
  try {
    // Pastikan notificationIds adalah array dan tidak kosong
    if (Array.isArray(notificationIds) && notificationIds?.length > 0) {
      for (const notifId of notificationIds) {
        await deleteScheduleMedicatioReminderForever(notifId);
      }
    } else {
      console.warn("notificationIds tidak valid atau kosong:", notificationIds);
    }

    // Ambil data existing reminders
    const existingRemindersJSON = await getItem("jadwalObat");
    let existingReminders: ReminderData[] = [];

    // Pastikan data yang diambil valid
    if (existingRemindersJSON) {
      try {
        existingReminders = JSON.parse(existingRemindersJSON);
        if (!Array.isArray(existingReminders)) {
          console.warn("Data jadwalObat bukan array, menginisialisasi ulang.");
          existingReminders = [];
        }
      } catch (parseError) {
        console.error("Gagal parsing jadwalObat:", parseError);
        existingReminders = [];
      }
    }

    // Hapus reminder dengan id yang sesuai
    existingReminders = existingReminders.filter((reminder: ReminderData) => reminder.id !== id);

    // Simpan kembali data
    await saveItem("jadwalObat", JSON.stringify(existingReminders));
    setReminderData(existingReminders);
    speak("Jadwal dihapus selamanya", "id-ID", speechRate);
  } catch (error) {
    console.error("Gagal menghapus jadwal:", error);
    speak("Gagal menghapus jadwal", "id-ID", speechRate);
  }
};

  useEffect(() => {
    fetchReminder();
  }, []);

  const toggleDetail = (id: string) => {
    setLihatDetail((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle status untuk id tertentu
    }));
  };

  const renderItemReminder = ({ item }: { item: ReminderData }) => (
  <View className="w-[80vw] min-h-[15vh] border border-[#150E7C] rounded-[10px] items-center p-2 mb-3">
    <View className="w-[95%] h-fit flex flex-row items-center ">
      <Image source={getImageByType(item.jenisObat)} width={100} height={100} />
      <Text
        className={`${lihatDetail ? "hidden" : "flex"} text-base font-normal text-[#150E7C] ml-3`}
      >
        {item.namaObat}, {item.intervalHour} jam {item.intervalMinute} menit
      </Text>
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
    <View className={`${lihatDetail ? "flex" : "hidden"} w-full items-center my-3`}>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <Text className="text-[#150E7C] my-2">
        Jadwal mendatang: {item.notificationTimes?.length > 0
          ? new Date(item.notificationTimes[0]).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Tidak ada jadwal"}
      </Text>
      <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
      <Text className="text-base my-1">
        Telah berlangsung selama: {item.isActive ? "Sedang Berlangsung" : "Belum diaktifkan"}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (item.isActive) {
            deleteReminder(item.id, item.notificationIds || []);
          } else {
            scheduleMultipleReminders(
              "Waktunya Minum Obat!",
              `Jangan lupa minum ${item.namaObat} ${item.dosisObat}`,
              item.startHour,
              item.startMinute,
              item.intervalHour,
              item.timesPerDay
            ).then(async (newNotificationIds) => {
              const existingRemindersJSON = await getItem("jadwalObat");
              let existingReminders = existingRemindersJSON ? JSON.parse(existingRemindersJSON) : [];
              existingReminders = existingReminders.map((reminder: ReminderData) =>
                reminder.id === item.id
                  ? { ...reminder, isActive: true, notificationIds: newNotificationIds }
                  : reminder
              );
              await saveItem("jadwalObat", JSON.stringify(existingReminders));
              setReminderData(existingReminders);
              speak("Jadwal diaktifkan kembali", "id-ID", speechRate);
            });
          }
        }}
        className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
      >
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="text-[#150E7C] font-normal text-base"
        >
          {item.isActive ? "Matikan jadwal sementara" : "Aktifkan jadwal"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteReminderForever(item.id, item.notificationIds || [])}
        className={`bg-white border border-[#150E7C] w-[70%] h-[40px] flex justify-center items-center rounded-[10px] mt-3`}
      >
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="text-[#150E7C] font-normal text-base"
        >
          Hapus jadwal selamanya
        </Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      onPress={() => toggleDetail(item.id)}
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
      <View className="w-[90%] h-[1px] bg-[#150E7C] mx-auto mt-4"></View>
      <View className="w-[95%] h-[75%] border border-[#150E7C] rounded-t-[10px] mt-6 mx-auto flex flex-col items-center p-2 mb-auto">
        <Text
          style={{ fontSize: scaledFontSize("text-base") }}
          className="text-base font-semibold text-[#150E7C] mb-3"
        >
          Jadwal yang sedang berlangsung: {reminderData.filter((item) => item.isActive)?.length}
        </Text>
        <FlatList
          data={reminderData}
          renderItem={renderItemReminder}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}