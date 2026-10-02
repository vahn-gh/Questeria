import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DevDesignReference } from 'src/screens/DevDesignReference'
import { QuestsScreen } from 'src/screens/QuestsScreen'

import { RootStackParamList } from '../types/NavigationParams'
import { Screens } from '../types/Screens'

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Screens.QuestsScreen}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={Screens.QuestsScreen} component={QuestsScreen} />
        <Stack.Screen
          name={Screens.DevDesignReference}
          component={DevDesignReference}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default MainNavigator
