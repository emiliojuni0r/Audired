import { useFontSize } from "@/context/FontSizeContext";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

// home page
export default function Index() {
  const { scaledFontSize } = useFontSize();

  return (
    // button reminder medicine label
    <View className="flex-1 bg-white justify-center items-center gap-y-5">
      <Link
        href={"/reminder"}
        className="w-[280px] h-[60px] bg-[#FFA600] active:opacity-70 flex rounded-[20px] align-middle"
      >
        <Text style={{ fontSize: scaledFontSize('text-2xl') }}  className="text-2xl font-extrabold text-[#150E7C] text-center">
          Reminder medicine intake
        </Text>
      </Link>

      <TouchableOpacity className="w-[280px] h-[60px] bg-[#FFA600] justify-center items-center rounded-[20px]">
        <Text style={{ fontSize: scaledFontSize('text-2xl') }} className="text-2xl font-extrabold text-[#150E7C]">
          Scan medicine label
        </Text>
      </TouchableOpacity>

      <Link
        href={"/history"}
        className="w-[280px] h-[60px] bg-[#FFA600] active:opacity-70 flex rounded-[20px] align-middle"
      >
        <Text style={{ fontSize: scaledFontSize('text-2xl') }} className="text-2xl font-extrabold text-[#150E7C] text-center">
          All history and saved
        </Text>
      </Link> 
    </View>
  );
}
