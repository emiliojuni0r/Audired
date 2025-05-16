import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import { saveItem, getItem } from "@/context/SecureStorage";
import { router, useLocalSearchParams } from "expo-router";
import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { useRef } from "react";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import { scheduleMultipleReminders } from "@/context/ScheduleNotifications";

export default function AddReminderTimePage() {
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

  const { namaObat, jenisObat, dosisObat } = useLocalSearchParams();
  const [intervalHour, setIntervalHour] = useState("");
  const [intervalMinute, setIntervalMinute] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("1");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Izin notifikasi diperlukan untuk mengatur pengingat.");
        speak("Izin notifikasi diperlukan", "id-ID", speechRate);
      }
    };
    requestPermissions();
  }, []);

  const cekRincian = () => {
    const intervalTotalMenit = parseInt(intervalHour || "0") * 60 + parseInt(intervalMinute || "0");
    const startTime = `${startHour.padStart(2, "0")}:${startMinute.padStart(2, "0")}`;
    alert(
      `Obat: ${namaObat}\nSetiap: ${intervalHour} jam ${intervalMinute} menit (${intervalTotalMenit} menit)\nMulai pukul: ${startTime}\n${timesPerDay} kali sehari`
    );
    speak(
      `Rincian jadwal, Obat ${namaObat}, setiap ${intervalHour} jam ${intervalMinute} menit, mulai pukul ${startTime}, ${timesPerDay} kali sehari`,
      "id-ID",
      speechRate
    );
  };

  const tambahDanKembali = async () => {
  const parsedIntervalHour = parseInt(intervalHour) || 0;
  const parsedIntervalMinute = parseInt(intervalMinute) || 0;
  const parsedStartHour = parseInt(startHour) || 0;
  const parsedStartMinute = parseInt(startMinute) || 0;
  const parsedTimesPerDay = parseInt(timesPerDay) || 1;

  if (
    isNaN(parsedIntervalHour) ||
    isNaN(parsedIntervalMinute) ||
    isNaN(parsedStartHour) ||
    isNaN(parsedStartMinute) ||
    isNaN(parsedTimesPerDay)
  ) {
    alert("Error, Harap isi semua data dengan angka yang valid.");
    speak("Harap isi semua data dengan angka yang valid", "id-ID", speechRate);
    return;
  }

  if (parsedStartHour < 0 || parsedStartHour > 23) {
    alert("Jam mulai harus antara 00 dan 23.");
    speak("Jam mulai harus antara 00 dan 23", "id-ID", speechRate);
    return;
  }

  if (parsedStartMinute < 0 || parsedStartMinute > 59) {
    alert("Menit mulai harus antara 00 dan 59.");
    speak("Menit mulai harus antara 00 dan 59", "id-ID", speechRate);
    return;
  }

  if (parsedIntervalHour < 0 || parsedIntervalMinute < 0) {
    alert("Interval waktu tidak boleh negatif.");
    speak("Interval waktu tidak boleh negatif", "id-ID", speechRate);
    return;
  }

  if (parsedTimesPerDay < 1) {
    alert("Jumlah konsumsi per hari harus minimal 1.");
    speak("Jumlah konsumsi per hari harus minimal 1", "id-ID", speechRate);
    return;
  }

  try {
    const startTime = new Date();
    startTime.setHours(parsedStartHour);
    startTime.setMinutes(parsedStartMinute);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    const notificationIds = await scheduleMultipleReminders(
      "Waktunya Minum Obat!",
      `Jangan lupa minum ${namaObat} ${dosisObat}`,
      parsedStartHour,
      parsedStartMinute,
      parsedIntervalHour,
      parsedTimesPerDay
    );

    const notificationTimes: string[] = [];
    for (let i = 0; i < parsedTimesPerDay; i++) {
      const totalMinutes = (parsedStartHour * 60 + parsedStartMinute) + i * parsedIntervalHour * 60;
      const hour = Math.floor(totalMinutes / 60) % 24;
      const minute = totalMinutes % 60;
      const time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(0);
      time.setMilliseconds(0);
      if (time < new Date()) {
        time.setDate(time.getDate() + 1);
      }
      notificationTimes.push(time.toISOString());
    }

    const newReminder = {
      id: Date.now().toString(),
      namaObat: namaObat as string,
      jenisObat: jenisObat as string,
      dosisObat: dosisObat as string,
      intervalHour: parsedIntervalHour,
      intervalMinute: parsedIntervalMinute,
      startHour: parsedStartHour,
      startMinute: parsedStartMinute,
      timesPerDay: parsedTimesPerDay,
      notificationIds: notificationIds || [],
      notificationTimes,
      isActive: true,
    };

    const existingRemindersJSON = await getItem("jadwalObat");
    const existingReminders = existingRemindersJSON ? JSON.parse(existingRemindersJSON) : [];
    existingReminders.push(newReminder);
    await saveItem("jadwalObat", JSON.stringify(existingReminders));

    speak("Jadwal berhasil ditambahkan", "id-ID", speechRate);
    Alert.alert("Sukses", "Jadwal berhasil ditambahkan", [
      { text: "OK", onPress: () => router.back() },
    ]);
  } catch (error) {
    console.error("Gagal menyimpan jadwal:", error);
    alert("Gagal menyimpan jadwal.");
    speak("Gagal menyimpan jadwal", "id-ID", speechRate);
  }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto mb-4"
        onPress={() => {
          router.back();
          speak("Kembali ke Tambah Jadwal", "id-ID", speechRate);
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
      <Text
        style={{
          fontSize: scaledFontSize("text-lg"),
          fontWeight: "bold",
          marginBottom: 20,
          color: "#150E7C",
        }}
      >
        Tambah Waktu Konsumsi Obat
      </Text>
      <Text style={[styles.label, { fontSize: scaledFontSize("text-base") }]}>
        Masukkan jarak waktu
      </Text>
      <View style={styles.timeRow}>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          value={intervalHour}
          placeholder="00"
          onChangeText={(val) => setIntervalHour(val.replace(/[^0-9]/g, ""))}
          maxLength={2}
        />
        <Text style={{ fontSize: scaledFontSize("text-lg") }}>:</Text>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          value={intervalMinute}
          placeholder="00"
          onChangeText={(val) => setIntervalMinute(val.replace(/[^0-9]/g, ""))}
          maxLength={2}
        />
      </View>
      <View style={styles.timeLabelRow}>
        <Text style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}>
          Jam
        </Text>
        <Text style={{ fontSize: scaledFontSize("text-sm") }}>-</Text>
        <Text style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}>
          Menit
        </Text>
      </View>
      <Text
        style={[styles.label, { fontSize: scaledFontSize("text-base"), marginTop: 20 }]}
      >
        Mulai pukul berapa?
      </Text>
      <View style={styles.timeRow}>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          value={startHour}
          placeholder="00"
          onChangeText={(val) => setStartHour(val.replace(/[^0-9]/g, "").slice(0, 2))}
          maxLength={2}
        />
        <Text style={{ fontSize: scaledFontSize("text-lg") }}>:</Text>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          placeholder="00"
          value={startMinute}
          onChangeText={(val) => setStartMinute(val.replace(/[^0-9]/g, "").slice(0, 2))}
          maxLength={2}
        />
      </View>
      <View style={styles.timeLabelRow}>
        <Text style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}>
          Jam
        </Text>
        <Text style={{ fontSize: scaledFontSize("text-sm") }}>-</Text>
        <Text style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}>
          Menit
        </Text>
      </View>
      <Text
        style={[styles.label, { fontSize: scaledFontSize("text-base"), marginTop: 20 }]}
      >
        Berapa kali sehari?
      </Text>
      <TextInput
        style={[styles.inputSingle, { fontSize: scaledFontSize("text-lg"), width: 80 }]}
        keyboardType="number-pad"
        value={timesPerDay}
        onChangeText={(val) => setTimesPerDay(val.replace(/[^0-9]/g, ""))}
        maxLength={2}
      />
      <TouchableOpacity style={styles.checkButton} onPress={cekRincian}>
        <Text style={{ fontSize: scaledFontSize("text-base"), color: "#150E7C" }}>
          Cek rincian jadwal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={tambahDanKembali}>
        <Text style={{ color: "#fff", fontSize: scaledFontSize("text-base") }}>
          Tambah dan kembali
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#150E7C",
  },
  timeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  timeLabelRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  timeLabel: {
    color: "#777",
  },
  input: {
    backgroundColor: "#D9EFFF",
    padding: 10,
    width: 60,
    textAlign: "center",
    borderRadius: 8,
  },
  inputSingle: {
    backgroundColor: "#D9EFFF",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
  },
  // check: true,
  checkButton: {
    borderWidth: 1,
    borderColor: "#150E7C",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    width: "90%",
  },
  saveButton: {
    backgroundColor: "#150E7C",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    width: "90%",
  },
});