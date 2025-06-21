import React from 'react';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import CheckCircleIcon from '@assets/svg/check-circle.svg';
import InfoCircleIcon from '@assets/svg/info.svg';
import WarningCircleIcon from '@assets/svg/warning-circle.svg';
import { toast } from '@backpackapp-io/react-native-toast';

import { useAppTheme } from '@src/theme/theme';
import { vibrate } from '@src/utils/vibrate';

export const useThemedToasts = () => {
  const { colors } = useAppTheme();

  const toastSuccess = (message: string) => {
    vibrate(HapticFeedbackTypes.notificationSuccess)
    toast(message, {
      icon: <CheckCircleIcon color={colors.green} />,
      styles: {
        pressable: { backgroundColor: colors.background },
      },
    })
  };

  const toastError = (message: string) => {
    vibrate(HapticFeedbackTypes.notificationError)
    toast(message, {
      icon: <WarningCircleIcon color={colors.red_500} />,
      styles: {
        pressable: { backgroundColor: colors.background },
      },
    })
  };

  const toastWarning = (message: string) => {
    vibrate(HapticFeedbackTypes.notificationWarning)
    toast(message, {
      icon: <InfoCircleIcon color={colors.orange_500} />,
      styles: {
        pressable: { backgroundColor: colors.background },
      },
    })
  };

  return { toastError, toastSuccess, toastWarning };
};