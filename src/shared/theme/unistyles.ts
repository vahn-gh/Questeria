import { StyleSheet } from 'react-native-unistyles'

import { GrassThemeColors } from './colors'

const AppThemes = {
  grass: {
    colors: GrassThemeColors,
  },
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: false,
    initialTheme: 'grass',
  },
  themes: AppThemes,
})

type AppThemes = typeof AppThemes

declare module 'react-native-unistyles' {
  /*eslint-disable @typescript-eslint/no-empty-object-type*/
  export interface UnistylesThemes extends AppThemes {}
}
