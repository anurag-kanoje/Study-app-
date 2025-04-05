import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0066CC',
    secondary: '#03DAC6',
    error: '#B00020',
    background: '#F6F6F6',
    surface: '#FFFFFF',
    accent: '#03DAC6',
    onSurface: '#000000',
    placeholder: '#6B6B6B',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
  roundness: 8,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4DA3FF',
    secondary: '#03DAC6',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    accent: '#03DAC6',
    onSurface: '#FFFFFF',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
  roundness: 8,
};

// Default theme (you can switch between light and dark based on user preference)
export const theme = lightTheme; 