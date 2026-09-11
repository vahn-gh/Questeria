import { StyleSheet } from 'react-native-unistyles'

import { Theme } from 'shared/types/Theme'

import {
  CoffeeThemeColors,
  ColorNameType,
  HackerThemeColors,
  KawaiiThemeColors,
} from './colors'

interface AppTheme {
  colors: Partial<Record<ColorNameType, string>>
}

const AppThemes: Record<Theme, AppTheme> = {
  Coffee: {
    colors: CoffeeThemeColors,
  },
  Kawaii: {
    colors: KawaiiThemeColors,
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
  /*eslint-disable @typescript-eslint/no-empty-object-type*/
  export interface UnistylesThemes extends AppThemes {}
}
