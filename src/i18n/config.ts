/* eslint-disable sort-keys-fix/sort-keys-fix */
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { resources } from './@types/resources';
import RNLanguageDetector from './LanguageDetector';

export enum AppLangEnum {
  RU = 'ru',
  EN = 'en',
}

export const defaultNS = 'shared';

export const LANGUAGE_LIST = [
  {
    flag: '🇬🇧',
    lang: AppLangEnum.EN,
    title: 'english',
  },
  {
    flag: '🇷🇺',
    lang: AppLangEnum.RU,
    title: 'russian',
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
        return `[MISSING KEY] ${key}`;
      },
    });
};

// Инициализация при загрузке
initializeI18n().catch(console.error);

export default i18n;