import Config from 'react-native-config';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { t } from 'i18next';

import { dispatchLogout } from '@src/providers/auth';
import { mmkvStorage } from '@src/utils/mmkv';
import { STORAGE_KEYS } from '@src/utils/vars/storage_keys';

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
  const token = mmkvStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? token : undefined;
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
    const refresh_token = mmkvStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
    
    const { access_token, refresh_token: new_refresh_token } = await postRefreshToken({ refresh_token });

    mmkvStorage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    mmkvStorage.set(STORAGE_KEYS.REFRESH_TOKEN, new_refresh_token);

    instance.defaults.headers.common.Authorization = `${access_token}`;
    notifySubscribers(access_token);

    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `${access_token}`;
    }
    return instance(originalRequest);
  } catch (error) {
    dispatchLogout?.();
    throw new Error(t('errors:the-session-has-timed-out-please-log-in'));
  }
};

// Attach token to each request
instance.interceptors.request.use(async (config) => {
  const token = await getStoredAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `${token}`;
  }
  console.log(`[Request Logger] ${config.method?.toUpperCase()} request to ${config.url}`);
  return config;
});

instance.interceptors.response.use(
  (response) => {
    console.log(`[Response Logger] ${response.config.method?.toUpperCase()} request to ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber(async (token: string) => {
            try {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `${token}`;
              }
              resolve(await instance(originalRequest));
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      return await refreshTokenAndRetry(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default instance;
