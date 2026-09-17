import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback'

export const triggerHaptic = (
  type: HapticFeedbackTypes = HapticFeedbackTypes.contextClick
): void => {
  ReactNativeHapticFeedback.trigger(type, {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  })
}
