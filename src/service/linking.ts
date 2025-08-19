import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { Linking } from 'react-native';
import chargingService from './charging';
import { navigationRef } from '@src/navigation/navigationRef';

import { LinkingOptions } from '@react-navigation/native';

export const handleDeepLink = async (url: string | null) => {
  if (!url) {
    console.error('URL is null or undefined');
    return;
  }

  console.log('Обработка deeplink:', url);

  // Парсинг URL
  const parseUrl = (url: string) => {
    try {
      if (
        url.startsWith('https://bps-energy.by') ||
        url.startsWith('bpsenergy://')
      ) {
        const path = url
          .replace('https://bps-energy.by', '')
          .replace('bpsenergy://', '');
        const pathParts = path.split('/').filter(Boolean);
        console.log('pathParts -> ', pathParts);

        if (
          pathParts.length >= 3 &&
          pathParts[0] === 'qr' &&
          pathParts[1] === 'session' &&
          pathParts[2] === 'start' &&
          pathParts[3]
        ) {
          return { path: url, connector_id: pathParts[3] };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  };

  const result = parseUrl(url);
  console.log('result ->', result);

  if (!result) {
    console.error('Неверный QR-код или URL:', url);
    throw new Error('Неверный QR-код или URL');
  }

  const { path, connector_id } = result;

  // Обработка пути /qr/session/start
  if (path.includes('/qr/session/start')) {
    try {
      console.log('Запуск сессии для connector_id:', connector_id);
      await chargingService.startSession(Number(connector_id));
      navigationRef.navigate('tabs', { screen: 'charging-session' });
    } catch (error) {
      handleCatchError(error);
    }
  } else {
    console.log('Неизвестный путь:', path);
  }
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['bpsenergy://', 'https://bps-energy.by'],
  config: {
    screens: {
      tabs: {
        screens: {
          'charging-session': 'qr/session/start/:id', // Автоматическое сопоставление пути
        },
      },
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) {
      console.log('Приложение открыто через:', url);
      await handleDeepLink(url); // Обрабатываем начальный URL
      return url;
    }
    return null;
  },
  subscribe(listener) {
    const onReceiveURL = async ({ url }: { url: string }) => {
      console.log('Получена ссылка:', url);
      await handleDeepLink(url); // Обрабатываем входящий URL
      listener(url); // Передаём URL в react-navigation для обработки навигации
    };
    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => subscription.remove();
  },
};
