import { useUnistyles } from 'react-native-unistyles'

export const FantasyThemeColor = {
  Primary: '#654a2e', // Worn Wood
  Secondary: '#b58b5c', // Tan Leather
  Tertiary: '#d5b88e', // Aged Parchment
  Quaternary: '#8d4f3b', // Wax Seal
  Outline: '#482b03', // Ink Brown
}

export const useTheme = () => {
  const { theme } = useUnistyles()

  return theme
}

export const useColors = () => {
  const theme = useTheme()

  return theme.colors
}

export type ColorNameType = keyof typeof FantasyThemeColor
