import { Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useFontSize } from "@/context/FontSizeContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../../firebase";
import { saveItem, getItem } from "@/context/SecureStorage";
import { useSpeechRate } from "@/context/SpeechRateContext";

export default function LabelScannerResult() {
  const { scaledFontSize } = useFontSize();
  const { speechRate } = useSpeechRate();
  const [isSaved, setIsSaved] = useState(false);
  const { image, result } = useLocalSearchParams();
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

  
  // Try parsing result from params
  let parsedResult = null;
  try {
    parsedResult = result ? JSON.parse(result as string) : null;

    // Jika structured false, coba ambil raw JSON dari string (dalam bentuk kode stringified)
    if (
      parsedResult &&
      parsedResult.structured === false &&
      typeof parsedResult.result === "string"
    ) {
      const rawText = parsedResult.result;

      // Bersihkan tanda pemformatan seperti ```json
      const cleanRaw = rawText.replace(/```json|```/g, "").trim();

      // Parse isi JSON-nya
      const parsedFromRaw = JSON.parse(cleanRaw);

      // Ubah struktur agar seragam dengan structured true
      parsedResult = {
        structured: false,
        data: parsedFromRaw,
      };
    }
  } catch (err) {
    console.error("Gagal parsing result:", err);
  }

  // useEffect(() => {
  //   saveKeRiwayat();
  //   // Tambahkan pemanggilan fungsi speak setelah komponen dipasang (load selesai)
  //   if (parsedResult?.data) {
  //     let textToSpeak = "";
  //     for (const key in parsedResult.data) {
  //       if (parsedResult.data.hasOwnProperty(key) && parsedResult.data[key]) {
  //         const formattedKey = key.replace(/([A-Z])/g, " $1").trim(); // Format key untuk dibacakan
  //         textToSpeak += `${formattedKey}: ${parsedResult.data[key]}. `;
  //       }
  //     }
  //     speak(`Hasil scan: ${textToSpeak}`, "id-ID", speechRate);
  //   } else {
  //     speak("Tidak ada hasil scan untuk dibacakan.", "id-ID", speechRate);
  //   }
  // }, [parsedResult, speechRate]);

  // console.log("ini adalah parsed result :",parsedResult)
  const scannedImage = image;

  const handleSaveResult = async () => {
    if (isSaved) return;

    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      if (!token || !parsedResult?.data) {
        alert("User belum login atau data kosong.");
        return;
      }

      const response = await fetch(
        "https://audired-820e0.et.r.appspot.com/api/medication/my/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedResult.data),
        }
      );

      console.log("Sukses simpan:", response.json());
      console.log("🚀 Data yang dikirim:", parsedResult.data);
      speak("Hasil berhasil disimpan.", "id-ID", speechRate);
      setIsSaved(true);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      speak("Gagal menyimpan hasil.", "id-ID", speechRate);
    }
  };

  const RIWAYAT_SCAN_LABEL = "riwayatScan";
  // Simpan Ke Riwayat
  const saveKeRiwayat = async () => {
    try {
      const existing = await getItem(RIWAYAT_SCAN_LABEL);
      let history = [];

      if (existing) {
        history = JSON.parse(existing);
      }

      history.unshift(parsedResult.data); // tambahkan ke awal
      await saveItem(RIWAYAT_SCAN_LABEL, JSON.stringify(history));
    } catch (error) {
      console.log("Gagal Menyimpan Ke Riwayat:", error);
    }
  };
  const handleBacaHasil = () => {
    if (parsedResult?.data) {
      let textToSpeak = "";
      for (const key in parsedResult.data) {
        if (parsedResult.data.hasOwnProperty(key) && parsedResult.data[key]) {
          const formattedKey = key.replace(/([A-Z])/g, " $1").trim(); // Format key untuk dibacakan
          textToSpeak += `${formattedKey}: ${parsedResult.data[key]}. `;
        }
      }
      speak(`Membacakan hasil scan: ${textToSpeak}`, "id-ID", speechRate);
    } else {
      speak("Tidak ada hasil scan untuk dibacakan.", "id-ID", speechRate);
    }
  };

  return (
    <View className="flex-1 bg-white items-center p-2">
      {/* button back */}
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.back();
          speak("Kembali ke beranda", "id-ID", speechRate);
          setIsSaved(false);
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
      <Text className="font-semibold text-2xl mt-2.5">
        Hasil scan sudah siap
      </Text>
      {/* hasil obat container */}
      <View className="w-[88%] h-fit border border-[#150E7C] rounded-[10px] mt-3.5 flex items-center p-2">
        {/* start of hasil scan obat content container */}
        {parsedResult ? (
          <View>
            <View className="w-[90%] h-[0.1px] border-t border-[#150E7C]" />
            <Text className="text-[#150E7C] my-2 mx-auto">
              Nama Obat :{" "}
              {parsedResult.data.namaObat ?? parsedResult.data["Nama Obat"]}
            </Text>
            <View className="w-[90%] h-[0.1px] border-t border-[#150E7C] mb-2" />
            <View className="w-[90%] h-fit justify-start items-start content-start">
              <Text>
                Jenis obat:{" "}
                {parsedResult.data.jenisObat ??
                  parsedResult.data["Jenis Obat"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Kekuatan/Konsentrasi:{" "}
                {parsedResult.data.kekuatanKonsentrasi ??
                  (typeof parsedResult.data["Kekuatan/Konsentrasi"] === "object"
                    ? Object.entries(parsedResult.data["Kekuatan/Konsentrasi"])
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")
                    : parsedResult.data["Kekuatan/Konsentrasi"]) ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Indikasi obat:{" "}
                {parsedResult.data.indikasiObat ??
                  parsedResult.data["Indikasi Obat"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Dosis:{" "}
                {parsedResult.data.pemakaianDalamSehari ??
                  parsedResult.data["Pemakaian dalam sehari"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Aturan Pakai:{" "}
                {parsedResult.data.aturanPakai ??
                  parsedResult.data["Aturan Pakai"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Tanggal Kadaluarsa:{" "}
                {parsedResult.data.tanggalKadaluarsa ??
                  parsedResult.data["Tanggal Kadaluarsa"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Petunjuk Penyimpanan:{" "}
                {parsedResult.data.peringatanPerhatian ??
                  parsedResult.data["Peringatan/Perhatian"] ??
                  "Tidak Ditemukan"}
              </Text>
              <Text>
                Peringatan Penggunaan:{" "}
                {parsedResult.data.petunjukPenyimpanan ??
                  parsedResult.data["Petunjuk Penyimpanan"] ??
                  "Tidak Ditemukan"}
              </Text>
              <View className="w-[100%] h-[0.1px] border-t border-[#150E7C] my-2" />
              <Text>Deskripsi:</Text>
              <Text>
                {parsedResult.data.deskripsiPenggunaanObat ??
                  parsedResult.data["Deskripsi Penggunaan Obat"] ??
                  "Tidak Ditemukan"}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-center text-red-500">
            Tidak ada hasil ditemukan.
          </Text>
        )}
        {/* end of hasil scan obat content container */}
      </View>

      {/* button */}
      <View className="flex flex-col w-[90%] h-fit justify-center items-center gap-y-3 mt-3">
        <TouchableOpacity onPress={handleBacaHasil} className="bg-[#150E7C] w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]">
          <Text className="text-white text-2xl font-extrabold">
            Bacakan Hasil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsSaved(!isSaved);
            handleSaveResult();
            speak(
              isSaved ? "batalkan simpan hasil" : "Simpan hasil",
              "id-ID",
              speechRate
            );
          }}
          className={`${
            isSaved ? "bg-white border border-[#150E7C]" : "bg-[#150E7C]"
          } w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]`}
        >
          <Text
            className={`${
              isSaved ? "text-[#150E7C]" : "text-white"
            } text-2xl font-extrabold`}
          >
            {isSaved ? "Hasil Sudah tersimpan" : "Simpan Hasil"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.back();
            speak("Kembali ke beranda", "id-ID", speechRate);
            setIsSaved(false);
          }}
          className="bg-[#150E7C] w-[90%] h-[8vh] flex justify-center items-center rounded-[10px]"
        >
          <Text className="text-white text-2xl font-extrabold">
            Kembali ke home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
