import { useUnistyles } from 'react-native-unistyles'

export const CuteThemeColors = {
  Primary: '#EB6383', // Rose Pink
  Secondary: '#FA9191', // Coral Blush
  Tertiary: '#FFE9C5', // Cream Peach
  Quaternary: '#B4F2E1', // Mint Pastel
}

export const HackerThemeColors = {
  Primary: '#05614B', // Deep Teal
  Secondary: '#020E0E', // Very Dark Cyan
  Tertiary: '#01DE82', // Bright Mint Green
  Quaternary: '#FF2E2E', // Alert Red
}

export const CoffeeThemeColors = {
  Primary: '#40312f', // Espresso Bean
  Secondary: '#A17D45', // Amber Oak
  Tertiary: '#EAD7DE', // Blush Mist
  Quaternary: '#5C2339', // Wine Bean
}

export const useTheme = () => {
  const { theme } = useUnistyles()

  return theme
}

export const useColors = () => {
  const theme = useTheme()

  return theme.colors
}

export type ColorNameType =
  | keyof typeof CuteThemeColors
  | keyof typeof HackerThemeColors
  | keyof typeof CoffeeThemeColors
