import { FontSizeProvider } from "@/context/FontSizeContext";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    // fontSizeProvide untuk naikin size
    <FontSizeProvider>
        <StatusBar barStyle={"dark-content"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reminder" options={{}} />
      </Stack>
    </FontSizeProvider>
  );
}
