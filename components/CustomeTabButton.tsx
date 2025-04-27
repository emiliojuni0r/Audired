import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function CustomTabButton({
  onPress,
  accessibilityState,
  routeName,
}: any) {
  const focused = accessibilityState.selected;

  let iconName = "";
  if (routeName === "index") iconName = "home";
  else if (routeName === "reminder") iconName = "alarm";
  else if (routeName === "history") iconName = "bookmark";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabButtonContainer}
    >
      <View
        style={[
          styles.tabButton,
          focused && styles.tabButtonActive,
          { transform: [{ translateY: focused ? -10 : 0 }] },
        ]}
      >
        <Ionicons name={iconName} size={24} color="white" />
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
          {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButtonContainer: {
    flex: 1,
    alignItems: "center",
  },
  tabButton: {
    zIndex: 1,
    position: "absolute",
    backgroundColor: "navy",
    borderRadius: 50,
    padding: 10,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "green",
  },
  tabLabel: {
    color: "white",
    fontSize: 10,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: "bold",
  },
});
