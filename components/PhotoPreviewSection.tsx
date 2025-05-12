import { Fontisto } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
} from "react-native";
import * as Speech from "expo-speech";
import { auth } from "../firebase";
import { useSpeechRate } from "@/context/SpeechRateContext";

export default function PhotoPreviewSection({
  photo,
  handleRetakePhoto,
}: {
  photo: CameraCapturedPicture;
  scannedPhoto?: JSON;
  handleRetakePhoto: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleButtonPotretUlang = () => {
    speak("Potret Ulang gambar","id-ID", speechRate);
    handleRetakePhoto();
  };

  // const handleButtonLihatHasil = () => {
  //   router.push("/(tabs)/labelScanner/result");
  //   handleRetakePhoto();
  // }

  const sendToBackend = async () => {
    speak("Lihat hasil scan", "id-ID", speechRate);
    setLoading(true);
    try {
      console.log("Starting API call..."); // Debugging log

      const user = auth.currentUser;
      const token = await user?.getIdToken();

      if (!photo.base64) {
        console.error("Base64 image data is missing");
        return;
      }

      console.log("processing image from backend");
      const imageData = photo.base64;
      const language = "id";

      const response = await fetch(
        "https://audired-820e0.et.r.appspot.com/api/process/scan-medication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageData,
            language,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Scan result:", JSON.stringify(data));
        router.push({
          pathname: "/(tabs)/labelScanner/result",
          params: {
            image: imageData,
            result: JSON.stringify(data),
          },
        });
      } else {
        throw new Error(data?.error || "Failed to process label scanning.");
      }
    } catch (error) {
      console.error("Error during label reading:", error);
      Alert.alert(
        "Scan Failed",
        "An error occurred while processing the label."
      );
    } finally {
      setLoading(false);
      handleRetakePhoto();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image
          style={styles.previewContainer}
          source={{
            uri: Platform.OS == "web"
              ? photo.base64
              : "data:image/jpg;base64," + photo.base64,
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPotretUlang}
        >
          {/* <Fontisto name="trash" size={36} color="black" /> */}
          <Text className="text-white font-extrabold text-2xl">
            Potret Ulang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sendToBackend}>
          {/* <Fontisto name="trash" size={36} color="black" /> */}
          <Text className="text-white font-extrabold text-2xl">
            Lihat Hasil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    borderRadius: 15,
    padding: 1,
    width: "95%",
    flex: 5 / 6,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    width: "100%",
    height: "90%",
    borderRadius: 15,
  },
  buttonContainer: {
    flex: 1 / 6,
    marginTop: "3%",
    flexDirection: "row",
    width: "95%",
  },
  button: {
    backgroundColor: "#150E7C",
    height: "70%",
    borderRadius: 25,
    // padding: 5,
    alignItems: "center",
    marginHorizontal: 1,
    justifyContent: "center",
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
