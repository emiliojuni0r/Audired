import { createContext, useContext, useState } from "react";

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
  
  export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
    const [fontScale, setFontScale] = useState(defaultFontSizeContext.fontScale);
    const baseFontSize = defaultFontSizeContext.baseFontSize;
  
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