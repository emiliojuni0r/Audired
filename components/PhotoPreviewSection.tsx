import { Fontisto } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
} from "react-native";
import * as Speech from "expo-speech";

export default function PhotoPreviewSection({
  photo,
  handleRetakePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
}) {
  const router = useRouter();

  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };

  const handleButtonPotretUlang = () => {
    speak("Potret Ulang gambar");
    handleRetakePhoto();
  }

  const handleButtonLihatHasil = () => {
    speak("Lihat hasil scan");
    router.push("/(tabs)/labelScanner/result");
    handleRetakePhoto();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image
          style={styles.previewContainer}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleButtonPotretUlang}>
          {/* <Fontisto name="trash" size={36} color="black" /> */}
          <Text className="text-white font-extrabold text-2xl">
            Potret Ulang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonLihatHasil}
        >
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
