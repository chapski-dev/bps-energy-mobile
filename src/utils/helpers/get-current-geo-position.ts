import { PermissionsAndroid } from 'react-native';
import Geolocation, { PositionError } from 'react-native-geolocation-service';
import { Point } from 'react-native-yamap';

import { isIOS } from '@src/misc/platform';


type GeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
};

const requestLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      buttonNegative: 'Cancel',
      buttonNeutral: 'Ask Me Later',
      buttonPositive: 'OK',
      message: 'Can we access your location?',
      title: 'Geolocation Permission',
    },
  );
  if (granted === 'granted') {
    return true;
  } else {
    throw new Error();
  }
};

export const getHighAccuracyPosition = async (
  options: GeolocationOptions = {},
): Promise<Point> => {
  let counterOfTries = 0; // Делаем счетчик локальной переменной
  let timeoutId: NodeJS.Timeout | null = null; // Для хранения ID таймаута

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  if (!isIOS) {
    await requestLocationPermission();
  }
  return new Promise<Point>((resolve, reject) => {
    const defaultOptions: Geolocation.GeoOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
      ...options,
    };

    const tryGetPosition = () => {
      Geolocation.getCurrentPosition(
        (position: Geolocation.GeoPosition) => {
          cleanup(); // Очищаем таймаут при успехе
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === PositionError.PERMISSION_DENIED && counterOfTries < 3) {
            counterOfTries++;
            timeoutId = setTimeout(tryGetPosition, 3000);
          } else {
            cleanup(); // Очищаем таймаут при окончательной ошибке
            reject(error);
          }
        },
        defaultOptions,
      );
    };

    tryGetPosition();
  });
};