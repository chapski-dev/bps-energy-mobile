import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types.ts'

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
}

export const vibrate = (type: HapticFeedbackTypes) => {
  ReactNativeHapticFeedback.trigger(type, options)
}
