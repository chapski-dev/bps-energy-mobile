import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import { t } from 'i18next';

import { dispatchLogout } from '@src/providers/auth';
// import geolocationService from '@src/service/geolocation-service';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { postRefreshToken } from './index';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface IServerError {
  code?: number;
  message?: string;
  status?: 'ERROR';
  type?: ServerErrorTypeEnum;
  details?: string[];
}
enum ServerErrorTypeEnum {
  /** токен истек - можно рефрешить */
  TOKEN_INVALID_EXP = 'TOKEN_INVALID_EXP',
  /** токен отозван - необходимо перелогиниться */
  TOKEN_INVALID_REV = 'TOKEN_INVALID_REV'
}

type TRefreshCallback = (token: string) => void;

export const defaultHeaders = { 'Content-Type': 'application/json' };

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      return 'Bearer ' + (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN));
    }
  } catch (err) {
    console.error('getAuthToken', err);
  }
};
let isRefreshing = false;
const refreshSubscribes: Array<(token: string) => void> = [];

const refreshTokenAndRetry = async (
  originalRequest: CustomAxiosRequestConfig
): Promise<AxiosResponse> => {
  try {
    const refreshToken = (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN)) || '';
    const response = await postRefreshToken({ refreshToken });
    const accessToken = response.access_token;
    onTokenRefreshed(response.access_token);
    // await geolocationService.updateConfig({ accessToken, refreshToken });
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return await instance(originalRequest);
  } catch (error: any) {
    if (error?.response && error?.response?.status === 400) {
      dispatchLogout?.();
      throw new Error(t('translation:the_session_has_timed_out_please_log_in'));
    } else {
      throw error;
    }
  }
};

const instance = axios.create({
  baseURL: Config.API_HOST,
  headers: defaultHeaders
});

axiosRetry(instance, {
  retries: 3,
  retryCondition: (error) => isNetworkOrIdempotentRequestError(error)
});

instance.interceptors.request.use(async (config) => {
  const authToken = await getAuthToken();
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = authToken;
  }
  return config;
});

instance.interceptors.response.use(
  (options) => options,
  async (error: AxiosError<IServerError>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const errorResponseData = error?.response?.data;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          try {
            refreshSubscribes.push(async (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              const response = await instance(originalRequest);
              resolve(response);
            });
          } catch (e: unknown) {
            reject(e);
          }
        });
      } else {
        // if (errorResponseData?.type) {
        originalRequest._retry = true;
        isRefreshing = true;

        return await refreshTokenAndRetry(originalRequest);

        // switch (errorResponseData.type) {
        //   // Обновление токена
        //   case ServerErrorTypeEnum.TOKEN_INVALID_EXP:
        //     return await refreshTokenAndRetry(originalRequest);

        //   // Проверка на девайсы
        //   case ServerErrorTypeEnum.TOKEN_INVALID_REV:
        //     // return await checkLastSessionInfo();
        // }
        // }
      }
    }

    return Promise.reject(error);
  }
);

const onTokenRefreshed = (token: string): void => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  refreshSubscribes.forEach((callback: TRefreshCallback) => callback(token));
  refreshSubscribes.length = 0;
  isRefreshing = false;
};

export default instance;
