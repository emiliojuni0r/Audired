// // app/reminder/add.tsx (dengan Expo Router)
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Notifications from 'expo-notifications';

// export default function AddReminder() {
//   const [intervalHour, setIntervalHour] = useState(8);
//   const [intervalMinute, setIntervalMinute] = useState(0);
//   const [startHour, setStartHour] = useState(8);
//   const [startMinute, setStartMinute] = useState(0);
//   const [timesPerDay, setTimesPerDay] = useState('3');

//   const scheduleReminder = async () => {
//     const hours = startHour;
//     const minutes = startMinute;

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Waktunya minum obat',
//         body: 'Jangan lupa ya!',
//       },
//       trigger: {
//         hour: hours,
//         minute: minutes,
//         repeats: true,
//       },
//     });

//     alert('Reminder berhasil dijadwalkan!');
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Masukkan jarak waktu</Text>
//       <View style={styles.timeRow}>
//         <TextInput style={styles.input} keyboardType="number-pad" value="00" editable={false} />
//         <TextInput style={styles.input} keyboardType="number-pad" value={String(intervalHour).padStart(2, '0')} onChangeText={val => setIntervalHour(Number(val))} />
//         <TextInput style={styles.input} keyboardType="number-pad" value={String(intervalMinute).padStart(2, '0')} onChangeText={val => setIntervalMinute(Number(val))} />
//       </View>

//       <Text>Mulai pukul berapa?</Text>
//       <View style={styles.timeRow}>
//         <TextInput style={styles.input} keyboardType="number-pad" value={String(startHour).padStart(2, '0')} onChangeText={val => setStartHour(Number(val))} />
//         <TextInput style={styles.input} keyboardType="number-pad" value={String(startMinute).padStart(2, '0')} onChangeText={val => setStartMinute(Number(val))} />
//       </View>

//       <Text>Berapa kali sehari?</Text>
//       <TextInput style={[styles.input, { width: 80 }]} keyboardType="number-pad" value={timesPerDay} onChangeText={setTimesPerDay} />

//       <Pressable style={styles.checkButton}>
//         <Text>Cek rincian jadwal</Text>
//       </Pressable>

//       <Pressable style={styles.saveButton} onPress={scheduleReminder}>
//         <Text style={{ color: '#fff' }}>Tambah dan kembali</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   timeRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
//   input: {
//     backgroundColor: '#D9EFFF',
//     padding: 10,
//     width: 60,
//     textAlign: 'center',
//     borderRadius: 8,
//     fontSize: 18
//   },
//   checkButton: {
//     borderWidth: 1,
//     borderColor: '#333',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center'
//   },
//   saveButton: {
//     backgroundColor: '#2A0A81',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 15,
//     alignItems: 'center'
//   }
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import {saveItem, getItem} from "@/context/SecureStorage"
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

  const { namaObat, jenisObat, dosisObat } = useLocalSearchParams();
  const [intervalHour, setIntervalHour] = useState(" ");
  const [intervalMinute, setIntervalMinute] = useState(" ");
  const [startHour, setStartHour] = useState(" ");
  const [startMinute, setStartMinute] = useState(" ");
  const [timesPerDay, setTimesPerDay] = useState("1"); // Default to 1

  const cekRincian = () => {
    const intervalTotalMenit =
      parseInt(intervalHour) * 60 + parseInt(intervalMinute);
    const startTime = `${startHour.padStart(2, "0")}:${startMinute.padStart(
      2,
      "0"
    )}`;
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
    const intervalTotalMenit = parseInt(intervalHour) * 60 + parseInt(intervalMinute);
    const startTime = new Date();
    startTime.setHours(parseInt(startHour));
    startTime.setMinutes(parseInt(startMinute));
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    if (!intervalHour || !intervalMinute || !startHour || !startMinute || !timesPerDay) {
      alert("Error, Harap isi semua data terlebih dahulu");
      speak("Harap isi semua data terlebih dahulu", "id-ID", speechRate);
      return;
    }

    try {
    const notificationIds = await scheduleMultipleReminders(
      "Waktunya Minum Obat!",
      `Jangan lupa minum ${namaObat} ${dosisObat}`,
      parseInt(startHour),
      parseInt(startMinute),
      parseInt(intervalHour), // interval in hours
      parseInt(timesPerDay)   // how many times per day
    );

    // Simpan data reminder ke AsyncStorage
    const newReminder = {
      namaObat,
      jenisObat,
      dosisObat,
      intervalHour: parseInt(intervalHour),
      intervalMinute: parseInt(intervalMinute),
      startHour: parseInt(startHour),
      startMinute: parseInt(startMinute),
      timesPerDay: parseInt(timesPerDay),
      notificationIds, // Simpan ID notifikasi untuk pengelolaan nanti
      isActive: true, // Set to active by default
    };

      // Ambil data existing dan gabungkan dengan data baru
      const existingRemindersJSON = await getItem("jadwalObat");
      const existingReminders = existingRemindersJSON ? JSON.parse(existingRemindersJSON) : [];
      existingReminders.push(newReminder);
      await saveItem("jadwalObat", JSON.stringify(existingReminders));

      speak("Jadwal berhasil ditambahkan", "id-ID", speechRate);
      Alert.alert("Sukses", "Jadwal berhasil ditambahkan", [
        { text: "OK", onPress: () => router.back() }
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
        <Text
          style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}
        >
          Jam
        </Text>
        <Text style={{ fontSize: scaledFontSize("text-sm") }}>-</Text>
        <Text
          style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}
        >
          Menit
        </Text>
      </View>

      <Text
        style={[
          styles.label,
          { fontSize: scaledFontSize("text-base"), marginTop: 20 },
        ]}
      >
        Mulai pukul berapa?
      </Text>
      <View style={styles.timeRow}>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          value={startHour}
          placeholder="00"
          onChangeText={(val) =>
            setStartHour(val.replace(/[^0-9]/g, "").slice(0, 2))
          }
          maxLength={2}
        />
        <Text style={{ fontSize: scaledFontSize("text-lg") }}>:</Text>
        <TextInput
          style={[styles.input, { fontSize: scaledFontSize("text-lg") }]}
          keyboardType="number-pad"
          placeholder="00"
          value={startMinute}
          onChangeText={(val) =>
            setStartMinute(val.replace(/[^0-9]/g, "").slice(0, 2))
          }
          maxLength={2}
        />
      </View>
      <View style={styles.timeLabelRow}>
        <Text
          style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}
        >
          Jam
        </Text>
        <Text style={{ fontSize: scaledFontSize("text-sm") }}>-</Text>
        <Text
          style={[styles.timeLabel, { fontSize: scaledFontSize("text-sm") }]}
        >
          Menit
        </Text>
      </View>

      <Text
        style={[
          styles.label,
          { fontSize: scaledFontSize("text-base"), marginTop: 20 },
        ]}
      >
        Berapa kali sehari?
      </Text>
      <TextInput
        style={[
          styles.inputSingle,
          { fontSize: scaledFontSize("text-lg"), width: 80 },
        ]}
        keyboardType="number-pad"
        value={timesPerDay}
        onChangeText={(val) => setTimesPerDay(val.replace(/[^0-9]/g, ""))}
        maxLength={2}
      />

      <TouchableOpacity style={styles.checkButton} onPress={cekRincian}>
        <Text
          style={{ fontSize: scaledFontSize("text-base"), color: "#150E7C" }}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center"
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
    width: "90%"
  },
});
