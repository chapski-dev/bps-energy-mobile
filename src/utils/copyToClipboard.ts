import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { toast } from '@backpackapp-io/react-native-toast'
import Clipboard from '@react-native-clipboard/clipboard'

import { vibrate } from './vibrate';

export const copyToClipboard = (textToCopy: string, message: string) => {
  Clipboard.setString(textToCopy)
  vibrate(HapticFeedbackTypes.notificationSuccess)
  toast.success(message)
}
