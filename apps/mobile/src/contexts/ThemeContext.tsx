import React, { createContext, useContext, useState } from 'react';
import { DefaultTheme } from 'react-native-paper';

// Indonesia-inspired color palette
const indonesianColors = {
  red: '#DC143C',      // Indonesian flag red
  white: '#FFFFFF',    // Indonesian flag white  
  gold: '#FFD700',     // Traditional Indonesian gold
  emerald: '#50C878',  // Indonesian emerald
  brown: '#8B4513',    // Traditional Indonesian brown
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: indonesianColors.red,
    secondary: indonesianColors.gold,
    accent: indonesianColors.emerald,
    background: indonesianColors.white,
    surface: '#F8F9FA',
    text: '#2C2C2C',
    onSurface: '#2C2C2C',
    disabled: '#9E9E9E',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: indonesianColors.red,
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
};

interface ThemeContextType {
  theme: typeof theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
