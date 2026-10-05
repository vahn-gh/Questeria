import '@abraham/reflection'

import { Pressable } from 'react-native'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { useSafeInsets } from 'shared/hooks/useSafeInsets'
import { navigationRef } from 'shared/navigation/RootNavigator'
import { Screens } from 'shared/navigation/types/Screens'
import { CommonStyles } from 'shared/theme/commonStyles'

import { ApplicationErrorBoundary } from './ErrorBoundary'
import { SplashScreen } from './SplashScreen'
import { Typography } from './Typography'

function App() {
  return <AppContent />
}

function AppContent() {
  return (
    <GestureHandlerRootView style={CommonStyles.flex1}>
      <SafeAreaProvider>
        <DevFunctions />
        <Load />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const DevFunctions = () => {
  const { topInset } = useSafeInsets()

  return (
    <Pressable
      style={[
        ss.devFunctions,
        {
          top: topInset,
        },
      ]}
      onPress={() => navigationRef.navigate(Screens.DevDesignReference)}
    >
      <Typography type="p1" colorValue="#dc7d00">
        Dev Design Reference
      </Typography>
    </Pressable>
  )
}

const Load = () => {
  return (
    <>
      <ApplicationErrorBoundary />

      <SplashScreen />
    </>
  )
}

const ss = StyleSheet.create({
  devFunctions: {
    position: 'absolute',
    right: 10,
    zIndex: 999,
    alignItems: 'center',
    paddingTop: 8,
  },
})

export default App
