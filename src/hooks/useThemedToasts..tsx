import React from 'react';
import CheckCircleIcon from '@assets/svg/check-circle.svg';
import InfoCircleIcon from '@assets/svg/info.svg';
import WarningCircleIcon from '@assets/svg/warning-circle.svg';
import { toast } from '@backpackapp-io/react-native-toast';

import { useAppTheme } from '@src/theme/theme';

export const useThemedToasts = () => {
  const { colors } = useAppTheme();
  
  const toastSuccess = (message: string) => toast(message, {
    icon: <CheckCircleIcon color={colors.green} />,
    styles: {
      pressable: { backgroundColor: colors.background },
    },
  });
  
  const toastError = (message: string) => toast(message, {
    icon: <WarningCircleIcon color={colors.red_500} />,
    styles: {
      pressable: { backgroundColor: colors.background },
    },
  });
  
  const toastWarning = (message: string) => toast(message, {
    icon: <InfoCircleIcon color={colors.orange_500} />,
    styles: {
      pressable: { backgroundColor: colors.background },
    },
  });
  
  return { toastError, toastSuccess, toastWarning };
};