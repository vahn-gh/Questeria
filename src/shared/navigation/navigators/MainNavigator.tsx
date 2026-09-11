import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DevDesignReference } from 'src/screens/DevDesignReference'
import { ProgressScreen } from 'src/screens/ProgressScreen'

import { RootStackParamList } from '../types/NavigationParams'
import { Screens } from '../types/Screens'

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Screens.ProgressScreen}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={Screens.ProgressScreen}
          component={ProgressScreen}
        />
        <Stack.Screen
          name={Screens.DevDesignReference}
          component={DevDesignReference}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default MainNavigator
