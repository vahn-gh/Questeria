import { Dimensions, Platform } from 'react-native'

export const PLATFORM_OS = Platform.OS

export const IS_ANDROID = PLATFORM_OS === 'android'
export const IS_IOS = PLATFORM_OS === 'ios'

const windowDimensions = Dimensions.get('window')
export const DEVICE_WIDTH = windowDimensions.width
export const DEVICE_HEIGHT = windowDimensions.height

export const IS_SMALL_DEVICE = DEVICE_WIDTH <= 350

const screenDimensions = Dimensions.get('screen')
export const SCREEN_WIDTH = screenDimensions.width
export const SCREEN_HEIGHT = screenDimensions.height
