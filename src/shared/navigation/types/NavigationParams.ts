import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { Screens } from './Screens'

export type ScreenParamList = MainNavigatorParamsList

export type ScreenProps<T extends keyof ScreenParamList> =
  NativeStackScreenProps<ScreenParamList, T>

type MainNavigatorParamsList = {
  [Screens.RootMain]: undefined

  [Screens.QuestsScreen]: undefined
  [Screens.DevDesignReference]: undefined
}

export type RootStackParamList = MainNavigatorParamsList

declare global {
  // oxlint-disable-next-line typescript/no-namespace
  namespace ReactNavigation {
    // oxlint-disable-next-line typescript/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
