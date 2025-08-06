import React from 'react';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import WarningCircleIcon from '@assets/svg/warning-circle.svg';
import { toast, ToastOptions, ToastPosition } from '@backpackapp-io/react-native-toast';
import { AxiosError } from 'axios';

import i18n from '@src/i18n/config';
import { BaseColors } from '@src/theme/colors';
import { AppLightTheme } from '@src/theme/theme';

import { vibrate } from '../vibrate';

interface ServerErrorResponse {
  error_message?: string;
  message?: string;
  error?: string;
}

export const toastError = (message: string, options?: ToastOptions) => {
  vibrate(HapticFeedbackTypes.notificationError);
  toast(message, {
    icon: <WarningCircleIcon color={AppLightTheme.colors.error_500} />,
    position: ToastPosition.TOP,
    styles: {
      pressable: { backgroundColor: AppLightTheme.colors.background },
      text: { color: BaseColors.grey_800 },
    },
    ...options
  });
};

const getStatusCodeMessage = (statusCode: number): string => {
  if (statusCode >= 500) {
    return i18n.t('errors:api.server-error');
  } else if (statusCode >= 400) {
    switch (statusCode) {
      case 400:
        return i18n.t('errors:api.bad-request');
      case 401:
        return i18n.t('errors:api.unauthorized');
      case 403:
        return i18n.t('errors:api.forbidden');
      case 404:
        return i18n.t('errors:api.not-found');
      case 408:
        return i18n.t('errors:api.request-timeout');
      case 429:
        return i18n.t('errors:api.too-many-requests');
      default:
        return i18n.t('errors:api.client-error');
    }
  }
  return i18n.t('errors:unknown-error');
};

const extractServerError = (error: AxiosError): string | null => {
  const data = error.response?.data as ServerErrorResponse;
  return data?.error_message || data?.message || data?.error || null;
};

const extractStatusCode = (errorMessage: string): number | null => {
  const match = errorMessage.match(/Request failed with status code (\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'string') {
    return error.toLowerCase().includes('network');
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as Error).message?.toLowerCase() || '';
    return message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound');
  }

  return false;
};

export const handleCatchError = (
  e: AxiosError | unknown | Error | string,
  where: string = ''
): string | null => {
  console.error(`${where ? `[${where}]` : ''} Error:`, e);

  let errorText: string | null = null;

  try {
    // Проверяем сетевые ошибки в первую очередь
    if (isNetworkError(e)) {
      errorText = i18n.t('errors:network-connection-lost');
      toastError(errorText);
      return errorText;
    }

    switch (true) {
      // Обработка AxiosError
      case e instanceof Error && 'response' in e && 'isAxiosError' in e: {
        const axiosError = e as AxiosError;
        const serverError = extractServerError(axiosError);
        const statusCode = axiosError.response?.status;

        if (serverError) {
          errorText = serverError;
        } else if (statusCode) {
          errorText = getStatusCodeMessage(statusCode);
        } else {
          errorText = axiosError.message || i18n.t('errors:unknown-error');
        }
        break;
      }

      // Обработка обычных Error объектов
      case e instanceof Error: {
        const error = e as Error;

        if (error.message?.includes('Request failed with status code')) {
          const statusCode = extractStatusCode(error.message);
          if (statusCode) {
            errorText = getStatusCodeMessage(statusCode);
          } else {
            errorText = error.message;
          }
        } else {
          errorText = error.message || i18n.t('errors:unknown-error');
        }
        break;
      }

      // Обработка строковых ошибок
      case typeof e === 'string': {
        if (e.includes('Request failed with status code')) {
          const statusCode = extractStatusCode(e);
          if (statusCode) {
            errorText = getStatusCodeMessage(statusCode);
          } else {
            errorText = e;
          }
        } else {
          errorText = e;
        }
        break;
      }

      // Обработка объектов с полем message
      case e && typeof e === 'object' && 'message' in e: {
        const objError = e as { message: string };
        errorText = objError.message || i18n.t('errors:unknown-error');
        break;
      }

      // Fallback для неизвестных типов ошибок
      default: {
        errorText = i18n.t('errors:unknown-error');
        console.warn('Unhandled error type:', typeof e, e);
        break;
      }
    }

    // Показываем toast только если есть текст ошибки и это не пустая строка
    if (errorText && errorText.trim()) {
      toastError(errorText);
    }

  } catch (handlingError) {
    // Если произошла ошибка при обработке ошибки
    console.error('Error while handling error:', handlingError);
    const fallbackMessage = i18n.t('errors:unknown-error');
    toastError(fallbackMessage);
    return fallbackMessage;
  }

  return errorText;
};