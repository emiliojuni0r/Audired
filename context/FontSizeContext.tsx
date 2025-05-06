import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Storage Async ==> local database for simple data.


interface FontSizeContextProps {
    baseFontSize: number;
    fontScale: number;
    setFontScale: (scale: number) => void;
    scaledFontSize: (tailwindSize?: string) => number | undefined;
  }
  
  const defaultFontSizeContext: FontSizeContextProps = {
    baseFontSize: 16, // Our reference base font size
    fontScale: 1, // Default scale (no change)
    setFontScale: () => {},
    scaledFontSize: () => undefined,
  };
  
  const FontSizeContext = createContext(defaultFontSizeContext);
  
  export const useFontSize = () => useContext(FontSizeContext);
  
  interface FontSizeProviderProps {
    children: React.ReactNode;
  }

  const FONT_SCALE_KEY = "fontScale"; // key untuk nyimpen data ke AsyncStorage
  
  export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
    const [fontScale, setFontScaleState] = useState(defaultFontSizeContext.fontScale);
    const baseFontSize = defaultFontSizeContext.baseFontSize;
    
    // Saat Load App, Load Font Scale yang udah disimpan dulu
    useEffect(() => {
      const loadFontScale = async () => {
        try {
          const storedScale = await AsyncStorage.getItem(FONT_SCALE_KEY); // Diambil dari AsyncStorage pakai KEY yg udah ditentuin
          if (storedScale !== null) {
            setFontScaleState(parseFloat(storedScale));
          }
        } catch (e) {
          console.warn("Failed to load font scale:", e);
        }
      };

      // Load dari Async Storage Font Seting Sebelumnya
      loadFontScale();
    }, []);

    // Set Font Scale yang disimpen, semua update bakal kesimpen
    const setFontScale = async (scale: number) => {
      try {
        await AsyncStorage.setItem(FONT_SCALE_KEY, scale.toString());
        setFontScaleState(scale);
      } catch (e) {
        console.error("Failed to save font scale:", e);
      }
    };

    const scaledFontSize = (tailwindSize?: string): number | undefined => {
      if (!tailwindSize) {
        return baseFontSize * fontScale; // Default scaling
      }
  
      // You'll need to map your Tailwind classes to base font sizes.
      // This is a simplified example and might need adjustments based on your
      // Tailwind configuration.
      const sizeMap: { [key: string]: number } = {
        'text-xs': 12,
        'text-sm': 14,
        'text-base': 16,
        'text-lg': 18,
        'text-xl': 20,
        'text-2xl': 24,
        // Add more Tailwind sizes as needed
      };
  
      const base = sizeMap[tailwindSize];
      return base ? base * fontScale : undefined;
    };
  
    return (
      <FontSizeContext.Provider value={{ baseFontSize, fontScale, setFontScale, scaledFontSize }}>
        {children}
      </FontSizeContext.Provider>
    );
  };