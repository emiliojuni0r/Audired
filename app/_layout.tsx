// import { Stack } from "expo-router";
// import "../global.css"

// export default function RootLayout() {
//   return <Stack />;
// }

import { Tabs } from "expo-router";
import CustomTabButton from "@/components/CustomeTabButton";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "orange",
          height: 90,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          overflow: "visible",
        },
        tabBarButton: (props) => (
          <CustomTabButton {...props} routeName={route.name} />
        ),
      })}
    >
      <Tabs.Screen name="reminder" options={{ title: "Reminder" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
    </Tabs>
  );
}



