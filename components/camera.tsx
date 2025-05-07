import { useFontSize } from "@/context/FontSizeContext";
import PhotoPreviewSection from "@/components/PhotoPreviewSection";
import { AntDesign } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Speech from "expo-speech";

export default function Camera() {
  const { scaledFontSize } = useFontSize();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const speak = (text: string, languageCode = "id-ID") => {
    Speech.speak(text, { language: languageCode });
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };

      try {
        const takedPHoto = await cameraRef.current.takePictureAsync(options);
        console.log("Taked Photo", takedPHoto)

        setPhoto(takedPHoto);
      } catch (error) {
        
      }

    }
  };

  //this function for potret button handle two function
  const handlePotretPress = () => {
    handleTakePhoto();
    speak("Mengambil gambar", "id-ID");
  };

  const handleSwitchCameraPress = () => {
    let whichCamera = "";
    toggleCameraFacing();

    if(facing === "back") {
      whichCamera = "Kamu menggunakan kamera depan"
    } else {
      whichCamera = "Kamu menggunakan kamera belakang"
    }

    speak(whichCamera, "id-ID");
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
      />
    );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      ></CameraView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSwitchCameraPress}>
          {/* <AntDesign name="retweet" size={35} color={"white"} /> */}
          <Text
            style={{ fontSize: scaledFontSize("text-2xl") }}
            className="text-white font-extrabold"
          >
            Putar Kamera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePotretPress}>
          {/* <AntDesign name="camera" size={44} color={"black"} /> */}
          <Text
            style={{ fontSize: scaledFontSize("text-2xl") }}
            className="text-white font-extrabold"
          >
            Potret
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 11 / 12,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1 / 12,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginVertical: 15,
  },
  button: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    marginHorizontal: 1,
    backgroundColor: "#150E7C",
    borderRadius: 15,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
