import { StyleSheet } from 'react-native-unistyles'

import { Theme } from 'shared/types/Theme'

import { FantasyThemeColor, ColorNameType } from './colors'

interface AppTheme {
  colors: Partial<Record<ColorNameType, string>>
}

const AppThemes: Record<Theme, AppTheme> = {
  Fantasy: {
    colors: FantasyThemeColor,
  },
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: false,
    initialTheme: Theme.Fantasy,
  },
  themes: AppThemes,
})

type AppThemes = typeof AppThemes

declare module 'react-native-unistyles' {
  // oxlint-disable-next-line typescript/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}
