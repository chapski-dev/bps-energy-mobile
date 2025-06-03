import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { t } from 'i18next';

import { dispatchLogout } from '@src/providers/auth';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { postRefreshToken } from './index';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const instance = axios.create({
  baseURL: Config.API_HOST,
  headers: { 'Content-Type': 'application/json' },
});

axiosRetry(instance, {
  retries: 3,
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
});

const getStoredAccessToken = async () => {
  const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN);
  return token ? `${token}` : undefined;
};

let isRefreshing = false;
const subscribers: Array<(token: string) => void> = [];

const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers.length = 0;
  isRefreshing = false;
};

const addSubscriber = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const refreshTokenAndRetry = async (
  originalRequest: CustomAxiosRequestConfig
): Promise<AxiosResponse> => {
  try {
    const refresh_token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
    const { access_token, refresh_token: new_refresh_token } = await postRefreshToken({ refresh_token });

    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN, access_token);
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, new_refresh_token);

    instance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    notifySubscribers(access_token);

    originalRequest.headers.Authorization = `Bearer ${access_token}`;
    return instance(originalRequest);
  } catch (error) {
    await AsyncStorage.multiRemove([ASYNC_STORAGE_KEYS.ACCESS_TOKEN, ASYNC_STORAGE_KEYS.REFRESH_TOKEN]);
    dispatchLogout?.();
    throw new Error(t('translation:the_session_has_timed_out_please_log_in'));
  }
};

// Attach token to each request
instance.interceptors.request.use(async (config) => {
  const token = await getStoredAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = token;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber(async (token: string) => {
            try {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(await instance(originalRequest));
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      return refreshTokenAndRetry(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default instance;
