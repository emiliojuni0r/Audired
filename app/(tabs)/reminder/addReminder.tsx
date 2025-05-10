// import { useFontSize } from "@/context/FontSizeContext";
// import { useSpeechRate } from "@/context/SpeechRateContext";
// import { Ionicons } from "@expo/vector-icons";
// import { useRef, useState } from "react";
// import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
// import * as Speech from "expo-speech";
// import { router } from "expo-router";

// export default function addReminderPAge() {
//   const { scaledFontSize } = useFontSize();
//   const { speechRate } = useSpeechRate();
//   const isSpeaking = useRef(false); // Ref untuk melacak status TTS

//   const speak = (text: string, languageCode = "id-ID", speakSpeed: number) => {
//     if (isSpeaking.current) {
//       Speech.stop(); // Batalkan TTS yang sedang berjalan
//     }
//     isSpeaking.current = true;
//     Speech.speak(text, {
//       language: languageCode,
//       rate: speakSpeed,
//       onStopped: () => {
//         isSpeaking.current = false; // Reset status setelah dihentikan
//       },
//       onDone: () => {
//         isSpeaking.current = false; // Reset status setelah selesai
//       },
//     });
//   };

//   // ini untuk simpan gambar

//   const imgTablet = require("../../../assets/images/icons/Tablet.png");
//   const imgOles = require("../../../assets/images/icons/Oles.png");
//   const imgCair = require("../../../assets/images/icons/Cair.png");
//   const imgKapsul = require("../../../assets/images/icons/Kapsul.png");
//   const imgPerban = require("../../../assets/images/icons/Perban.png");
//   const imgSuntik = require("../../../assets/images/icons/Suntik.png");
//   const imgTetes = require("../../../assets/images/icons/Tetes.png");
//   const imgInhaler = require("../../../assets/images/icons/Inhaler.png");

//   // ini untuk isi form
//   const [namaObat, setNamaObat] = useState("");
//   const [jenisObat, setJenisObat] = useState("");
//   const [dosisObat, setDosisObat] = useState("");

//   return (
//     <View className="flex flex-1 bg-white items-center content-center p-2">
//       {/* button back */}
//       <TouchableOpacity
//         className="flex flex-row w-fit h-fit items-center mr-auto"
//         onPress={() => {
//           router.back();
//           speak("Kembali ke Home Page", "id-ID", speechRate);
//         }}
//       >
//         <Ionicons name="arrow-back" size={25} />
//         <Text
//           style={{ fontSize: scaledFontSize("text-base") }}
//           className="ml-2 text-base text-black font-medium"
//         >
//           Kembali
//         </Text>
//       </TouchableOpacity>

//       {/* titlle */}
//       <Text className="font-semibold text-2xl mt-2.5 mx-auto text-[#150E7C]">
//         Membuat jadwal
//       </Text>

//       <View className="w-[90%] flex mt-2">
//         <Text className="mr-auto font-semibold mt-2">Nama Obat</Text>
//         <TextInput
//           className="w-[100%] h-[5vh] border border-[#D9D9D9] rounded-[8px] mt-2 placeholder:text-gray-500 px-2"
//           placeholder="masukkan nama obat disini"
//           onChangeText={setNamaObat}
//           value={namaObat}
//         ></TextInput>

//         <Text className="mr-auto font-semibold mt-4">Jenis Obat</Text>
//         {/* baris satu */}
//         <View className="w-full h-fit flex flex-row justify-center gap-x-[8%] mt-3">
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("cair");
//               speak("Jenis obat cair", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgCair} width={10} height={10} />
//             <Text className="mt-2">Cair</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("kapsul");
//               speak("Jenis obat kapsul", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgKapsul} width={10} height={10} />
//             <Text className="mt-2">Kapsul</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("tablet");
//               speak("Jenis obat tablet", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgTablet} width={10} height={10} />
//             <Text className="mt-2">Tablet</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("suntik");
//               speak("Jenis obat Suntik", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgSuntik} width={10} height={10} />
//             <Text className="mt-2">Suntik</Text>
//           </TouchableOpacity>
//         </View>
//         {/* baris dua */}
//         <View className="w-full h-fit flex flex-row justify-center gap-x-[8%] mt-4">
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("tetes");
//               speak("Jenis obat tetes", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgTetes} width={10} height={10} />
//             <Text className="mt-2">Tetes</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("oles");
//               speak("Jenis obat oles", "id-ID", speechRate);
//             }}
//             className="flex-col items-center h-full justify-between"
//           >
//             <Image
//               source={imgOles}
//               width={10}
//               height={10}
//               className="my-auto"
//             />
//             <Text className="mt-2">Oles</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("inhaler");
//               speak("Jenis obat inhaler", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgInhaler} width={10} height={10} />
//             <Text className="mt-2">Inhaler</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setJenisObat("perban");
//               speak("Jenis obat Suntik", "id-ID", speechRate);
//             }}
//             className="flex-col items-center"
//           >
//             <Image source={imgPerban} width={10} height={10} />
//             <Text className="mt-2">Perban</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Dosis obat */}
//         <Text className="mr-auto font-semibold mt-6">Dosis obat</Text>
//         <TextInput
//           className="w-[100%] h-[5vh] border border-[#D9D9D9] rounded-[8px] mt-2 placeholder:text-gray-500 px-2"
//           placeholder="masukkan nama obat disini"
//           onChangeText={setDosisObat}
//           value={dosisObat}
//         ></TextInput>

//         {/* waktu konsumsi obat */}
//         <Text className="mr-auto font-semibold mt-6">Waktu Konsumsi Obat</Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.push("/(tabs)/reminder/addTime");
//             speak("Tambah waktu", "id-ID", speechRate);
//           }}
//           className="bg-white border border-[#150E7C] w-full h-[50px] flex justify-center items-center rounded-[10px] mt-2"
//         >
//           <Text
//             style={{ fontSize: scaledFontSize("text-base") }}
//             className="text-[#150E7C] font-normal text-base"
//           >
//             Tambah Waktu
//           </Text>
//         </TouchableOpacity>

//         {/* button untuk save dan kembali */}
//         <TouchableOpacity
//           onPress={() => {}}
//           className="bg-[#150E7C] w-full h-[50px] flex justify-center items-center rounded-[10px] mt-6"
//         >
//           <Text
//             style={{ fontSize: scaledFontSize("text-base") }}
//             className="text-white font-normal text-base"
//           >
//             Tambah Jadwal baru dan kembali
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
import { useFontSize } from "@/context/FontSizeContext";
import { useSpeechRate } from "@/context/SpeechRateContext";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";
import { router } from "expo-router";

export default function AddReminderPage() {
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

  const imgTablet = require("../../../assets/images/icons/Tablet.png");
  const imgOles = require("../../../assets/images/icons/Oles.png");
  const imgCair = require("../../../assets/images/icons/Cair.png");
  const imgKapsul = require("../../../assets/images/icons/Kapsul.png");
  const imgPerban = require("../../../assets/images/icons/Perban.png");
  const imgSuntik = require("../../../assets/images/icons/Suntik.png");
  const imgTetes = require("../../../assets/images/icons/Tetes.png");
  const imgInhaler = require("../../../assets/images/icons/Inhaler.png");

  const [namaObat, setNamaObat] = useState("");
  const [jenisObat, setJenisObat] = useState("");
  const [dosisObat, setDosisObat] = useState("");

  const handleTambahWaktu = () => {
    if (namaObat && jenisObat && dosisObat) {
      router.push({
        pathname: "/(tabs)/reminder/addTime",
        params: { namaObat, jenisObat, dosisObat },
      });
      speak("Menambahkan Waktu", "id-ID", speechRate);
    } else {
      alert("Mohon isi nama obat, jenis obat, dan dosis obat terlebih dahulu.");
      speak(
        "Mohon isi nama obat, jenis obat, dan dosis obat terlebih dahulu.",
        "id-ID",
        speechRate
      );
    }
  };

  return (
    <View className="flex flex-1 bg-white items-center content-center p-2">
      <TouchableOpacity
        className="flex flex-row w-fit h-fit items-center mr-auto"
        onPress={() => {
          router.navigate("/(tabs)/reminder");
          speak("Kembali ke Jadwal", "id-ID", speechRate);
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

      <Text className="font-semibold text-2xl mt-2.5 mx-auto text-[#150E7C]">
        Membuat jadwal
      </Text>

      <View className="w-[90%] flex mt-2">
        <Text className="mr-auto font-semibold mt-2">Nama Obat</Text>
        <TextInput
          className="w-[100%] h-[5vh] border border-[#D9D9D9] rounded-[8px] mt-2 placeholder:text-gray-500 px-2"
          placeholder="masukkan nama obat disini"
          onChangeText={setNamaObat}
          value={namaObat}
        />

        <Text className="mr-auto font-semibold mt-4">Jenis Obat</Text>
        <View className="w-full h-fit flex flex-row justify-center gap-x-[8%] mt-3">
          <TouchableOpacity
            onPress={() => {
              setJenisObat("cair");
              speak("Jenis obat cair", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgCair} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Cair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("kapsul");
              speak("Jenis obat kapsul", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgKapsul} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Kapsul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("tablet");
              speak("Jenis obat tablet", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgTablet} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Tablet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("suntik");
              speak("Jenis obat Suntik", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgSuntik} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Suntik</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-fit flex flex-row justify-center gap-x-[8%] mt-4">
          <TouchableOpacity
            onPress={() => {
              setJenisObat("tetes");
              speak("Jenis obat tetes", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgTetes} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Tetes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("oles");
              speak("Jenis obat oles", "id-ID", speechRate);
            }}
            className="flex-col items-center h-full justify-between"
          >
            <Image
              source={imgOles}
              width={50}
              height={50}
              resizeMode="contain"
              className="my-auto"
            />
            <Text className="mt-2">Oles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("inhaler");
              speak("Jenis obat inhaler", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgInhaler} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Inhaler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setJenisObat("perban");
              speak("Jenis obat Perban", "id-ID", speechRate);
            }}
            className="flex-col items-center"
          >
            <Image source={imgPerban} width={50} height={50} resizeMode="contain" />
            <Text className="mt-2">Perban</Text>
          </TouchableOpacity>
        </View>

        <Text className="mr-auto font-semibold mt-6">Dosis obat</Text>
        <TextInput
          className="w-[100%] h-[5vh] border border-[#D9D9D9] rounded-[8px] mt-2 placeholder:text-gray-500 px-2"
          placeholder="masukkan dosis obat disini"
          onChangeText={setDosisObat}
          value={dosisObat}
          keyboardType="numeric"
        />

        <Text className="mr-auto font-semibold mt-6">Waktu Konsumsi Obat</Text>
        <TouchableOpacity
          onPress={handleTambahWaktu}
          className="bg-white border border-[#150E7C] w-full h-[50px] flex justify-center items-center rounded-[10px] mt-2"
        >
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-[#150E7C] font-normal text-base"
          >
            Tambah Waktu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          className="bg-[#150E7C] w-full h-[50px] flex justify-center items-center rounded-[10px] mt-6"
        >
          <Text
            style={{ fontSize: scaledFontSize("text-base") }}
            className="text-white font-normal text-base"
          >
            Tambah Jadwal baru dan kembali
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}