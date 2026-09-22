import { StyleSheet } from 'react-native-unistyles'

import { Theme } from 'shared/types/Theme'

import {
  CoffeeThemeColors,
  ColorNameType,
  HackerThemeColors,
  CuteThemeColors,
} from './colors'

interface AppTheme {
  colors: Partial<Record<ColorNameType, string>>
}

const AppThemes: Record<Theme, AppTheme> = {
  Coffee: {
    colors: CoffeeThemeColors,
  },
  Cute: {
    colors: CuteThemeColors,
  },
  Hacker: {
    colors: HackerThemeColors,
  },
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: false,
    initialTheme: Theme.Coffee,
  },
  themes: AppThemes,
})

type AppThemes = typeof AppThemes

declare module 'react-native-unistyles' {
  // oxlint-disable-next-line typescript/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}
