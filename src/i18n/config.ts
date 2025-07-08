/* eslint-disable sort-keys-fix/sort-keys-fix */
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { defaultNS,resources } from './@types/resources';
import RNLanguageDetector from './LanguageDetector';

export enum AppLangEnum {
  RU = 'ru',
  EN = 'en',
  ZH = 'zh',
}

export const LANGUAGE_LIST = [
  {
    lang: AppLangEnum.RU,
    title: 'russian',
  },
  {
    lang: AppLangEnum.EN,
    title: 'english',
  },
  {
    lang: AppLangEnum.ZH,
    title: 'china',
  },
] as const;

export const saveLanguageAsyncStorage = async (language: AppLangEnum) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CURRENT_LANG, language);
};

export const initializeI18n = async () => {
  const ns = Object.keys(resources[AppLangEnum.RU]);
  const lng = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.CURRENT_LANG) || AppLangEnum.RU;

  await i18n
    .use(RNLanguageDetector)
    .use(initReactI18next)
    .init({
      debug: __DEV__,
      resources,
      defaultNS,
      ns,
      lng,
      fallbackLng: AppLangEnum.EN,
      keySeparator: '.',
      nsSeparator: ':',
      interpolation: {
        escapeValue: false,
      },
      parseMissingKeyHandler: (key) => {
        console.warn(`[MISSING KEY] ${key}`);
        return `${key}`;
      },
    });
};

// Инициализация при загрузке
initializeI18n().catch(console.error);

export default i18n;