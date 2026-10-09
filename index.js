/**
 * @format
 */

import 'react-native-get-random-values'
import { AppRegistry } from 'react-native'

import './src/shared/theme/unistyles'

import { name as appName } from './app.json'
import App from './src/shared/components/App'

AppRegistry.registerComponent(appName, () => App)
