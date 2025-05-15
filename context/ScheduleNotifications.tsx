import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Ini Fungsi Buat Set Notifikasi
export const scheduleMedicationReminder = async (title:string, body:string, hour:number, minute:number) => {
    const now = new Date();

    const trigger = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        hour - 7, // Subtract 7 to convert WIB to UTC
        minute,
        0
      )
    );  
    // Kalau waktu nya udah lewat, set it for the next day
    if (trigger < new Date()) {
        trigger.setUTCDate(trigger.getUTCDate() + 1);
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
        },
        trigger: trigger as unknown as Notifications.NotificationTriggerInput, // force cast is necessary for now
      });
    
    console.log("Berhasil membuat Notifikasi dengan judul :",`${title}` )
    return id;
};

// Ini buat Handle Kalo butuh Notifikasi banyak dalam sehari (e.g. Panadol 3x Sehari, nah pake ini fungsi)
export const scheduleMultipleReminders = async (
  title: string,
  body: string,
  startHour: number,
  startMinute: number,
  interval: number, // in hours
  timesPerDay: number
) => {
  const ids: string[] = [];

  for (let i = 0; i < timesPerDay; i++) {
    const totalMinutes = (startHour * 60 + startMinute) + i * interval * 60;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const id = await scheduleMedicationReminder(title, body, hour, minute);
    ids.push(id);
  }

  // Use a unique key, or a hash of title
  await AsyncStorage.setItem(`reminder_group_${title}`, JSON.stringify(ids));
};

  

// Object Reminder -> Ditaruh di Form Buat Reminder aja nanti
// type Reminder = {
//     id: string; // notification ID
//     medicationName: string;
//     dosage: string;
//     times: { hour: number; minute: number }[];
//     isPaused: boolean;
//   };


// Ini Buat Stop Reminder Sementara
export const deleteScheduleMedicationReminder = async (id:string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log("Notifikasi Sudah Terhapus")
}

// Ini Buat Hapus Reminder Selamanya
export const deleteScheduleMedicatioReminderForever = async (id:string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(`reminder_${id}`) // what next?
}