import React from 'react';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import WarningCircleIcon from '@assets/svg/warning-circle.svg';
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast';
import { AxiosError } from 'axios';

import { AppLightTheme } from '@src/theme/theme';

import { vibrate } from './vibrate';


const toastError = (message: string) => {
  vibrate(HapticFeedbackTypes.notificationError)
  toast(message, {
    icon: <WarningCircleIcon color={AppLightTheme.colors.red_500} />,
    position: ToastPosition.TOP,
    styles: {
      pressable: { backgroundColor: AppLightTheme.colors.background },
    },
  })
};

export const handleCatchError = (e: AxiosError | unknown | Error | string, where: string = '') => {
  const serverError =
  // @ts-ignore
    e?.response?.data?.message?.kk || e?.response?.data?.message?.ru || e?.response?.data?.error_message;

  let errorText;
  switch (true) {
    case typeof serverError === 'string':
      errorText = serverError;
      break;
    case !!e?.message:
      errorText = e?.message;
      break;
    case typeof e === 'string':
      errorText = e;
      break;
  }
  if (!errorText.includes('Network')) {
    errorText && toastError(errorText);
  }
  if (errorText.includes('Network')) {
    toastError('Неполадки сети интернет. Попробуйте пожалуйста позже.');
  }
  console.error(`${where} - ${e}`);
  console.error(errorText);
  return errorText;
};
