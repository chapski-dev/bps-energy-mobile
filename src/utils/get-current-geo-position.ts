import { Point } from 'react-native-yamap';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

import i18n from '@src/i18n/config';



type GeolocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
};

export const getHighAccuracyPosition = async (
  options: GeolocationOptions = {},
): Promise<Point> => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    ...options,
  };

  return new Promise<Point>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        if (position.coords.accuracy > 100) {
          reject(new Error(i18n.t('errors:low-location-accuracy')));
          return;
        }

        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      defaultOptions,
    );
  });
};