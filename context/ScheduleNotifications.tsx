import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Ini Fungsi Buat Set Notifikasi
export const scheduleMedicationReminder = async (title:string, body:string, hour:number, minute:number) => {
    const trigger = new Date();
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);

    // Kalau waktu nya udah lewat, set it for the next day
    if (trigger < new Date()) {
        trigger.setDate(trigger.getDate() + 1);
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
        },
        trigger : trigger as unknown as Notifications.NotificationTriggerInput, // i really dont have any idea what the fuck is this
      });
    
    console.log("Berhasil membuat Notifikasi dengan judul :",`${title}` )
    return id;
};

// Ini buat Handle Kalo butuh Notifikasi banyak dalam sehari (e.g. Panadol 3x Sehari, nah pake ini fungsi)
// const scheduleMultipleReminders = async (title:string, body:string, startHour:number, interval:number, timesPerDay:number) => {
//     let ids = [];
  
//     for (let i = 0; i < timesPerDay; i++) {
//       const hour = startHour + i * interval;
//       const id = await scheduleMedicationReminder(title, body, hour % 24, 0);
//       ids.push(id);
//     }
  
//     await AsyncStorage.setItem(`reminder_group_${title}`, JSON.stringify(ids));
//   };
  

// Object Reminder -> Ditaruh di Form Buat Reminder aja nanti
type Reminder = {
    id: string; // notification ID
    medicationName: string;
    dosage: string;
    times: { hour: number; minute: number }[];
    isPaused: boolean;
  };


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