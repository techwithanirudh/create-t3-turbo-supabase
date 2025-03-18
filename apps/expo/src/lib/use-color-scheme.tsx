import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { Appearance } from "react-native";

export const useColorScheme = () => {
  const { colorScheme } = useNativewindColorScheme();

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme: (scheme: "light" | "dark") => {
      Appearance.setColorScheme(scheme);
    },
    toggleColorScheme: () => {
      const current = colorScheme ?? "dark";
      Appearance.setColorScheme(current === "dark" ? "light" : "dark");
    },
  };
};
