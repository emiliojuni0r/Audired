// app/_layout.tsx
import { FontSizeProvider } from "@/context/FontSizeContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/auth";
import { StatusBar } from "react-native";
import { ReactNode, useEffect } from "react";
import { SpeechRateProvider } from "@/context/SpeechRateContext";

function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const segments = useSegments(); // Get the current route
  const router = useRouter();

  useEffect(() => {
    const isInsideTabs = segments[0] === "(tabs)";

    // If the user is not authenticated and is inside tabs, redirect to login
    if (!user && isInsideTabs) {
      router.replace("/login");
    }
    // If the user is authenticated and not in the tabs route, redirect to tabs
    else if (user && !isInsideTabs && segments[0] !== null) {
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SpeechRateProvider>
        <FontSizeProvider>
          <StatusBar barStyle={"dark-content"} />
          {/* Wrap everything with AuthGate to manage authentication flow */}
          <AuthGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </AuthGate>
        </FontSizeProvider>
      </SpeechRateProvider>
    </AuthProvider>
  );
}
