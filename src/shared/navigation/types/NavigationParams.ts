import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { Screens } from './Screens'

export type ScreenParamList = MainNavigatorParamsList

export type ScreenProps<T extends keyof ScreenParamList> =
  NativeStackScreenProps<ScreenParamList, T>

type MainNavigatorParamsList = {
  [Screens.RootMain]: undefined

  [Screens.ProgressScreen]: undefined
  [Screens.DevDesignReference]: undefined
}

export type RootStackParamList = MainNavigatorParamsList

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
