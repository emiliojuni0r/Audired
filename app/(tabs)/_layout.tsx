// import { Stack } from "expo-router";
// import "../global.css"

// export default function RootLayout() {
//   return <Stack />;
// }

import { Stack, Tabs } from "expo-router";
import "../../global.css";
// import { StatusBar } from "react-native";
// import CustomTabButton from "@/components/CustomeTabButton";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#efefef",
          tabBarInactiveTintColor: "#ffffff",
          tabBarStyle: {
            backgroundColor: "#150E7C",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 70,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle : 'Home',
            tabBarLabel : 'Beranda',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home-outline" : "home"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel : 'Pengaturan',
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "settings-outline" : "settings"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen name="reminder/index" options={{href: null, headerShown: false}} /> // reminder ga nambah di bottom nav
        <Tabs.Screen name="reminder/addReminder" options={{href: null, headerShown: false}} /> // reminder ga nambah di bottom nav
        <Tabs.Screen name="history/index" options={{href: null, headerShown: false}} /> // history ga nambah di bottom nav
        <Tabs.Screen name="labelScanner/index" options={{href: null, headerShown: false}} /> // history ga nambah di bottom nav
        <Tabs.Screen name="labelScanner/result" options={{href: null, headerShown: false}} /> // history ga nambah di bottom nav
        <Tabs.Screen name="simpan/index" options={{href: null, headerShown: false}} /> // history ga nambah di bottom nav
        <Tabs.Screen name="history/historyReminder" options={{href: null, headerShown: false}} /> // history ga nambah di bottom na
        <Tabs.Screen name="history/historyScan" options={{href: null, headerShown: false}} /> // history ga nambah di bottom nav
      </Tabs>
    </>
  );
}
