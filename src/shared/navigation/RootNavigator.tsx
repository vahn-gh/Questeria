import { useCallback, useRef } from 'react'

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainNavigator from './navigators/MainNavigator'
import { Screens } from './types/Screens'

export const navigationRef = createNavigationContainerRef()
const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  const routeNameRef = useRef<string>(undefined)

  const handleNavigationReady = useCallback(() => {
    const route = navigationRef.getCurrentRoute()?.name

    routeNameRef.current = route
  }, [])

  const handleNavigationChange = useCallback(() => {
    try {
      const route = navigationRef.getCurrentRoute()?.name

      routeNameRef.current = route
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationChange}
    >
      <Stack.Navigator
        initialRouteName={Screens.RootMain}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={Screens.RootMain} component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
