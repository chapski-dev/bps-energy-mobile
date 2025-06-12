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

export const defaultNS = 'common';
const ns = Object.keys(resources[AppLangEnum.RU]);

export const LANGUAGE_LIST: {
  lang: AppLangEnum;
  title: string;
  flag: string;
}[] = [
  {
    flag: '🇰🇿',
    lang: AppLangEnum.EN,
    title: 'english',
  },
  {
    flag: '🇷🇺',
    lang: AppLangEnum.RU,
    title: 'russian',
  },
];

export const saveLanguageAsyncStorage = async (language: AppLangEnum) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CURRENT_LANG, language);
};

(async () => {
  i18n
    .use(RNLanguageDetector)
    .use(initReactI18next)
    .init({
      debug: true,
      resources,
      defaultNS: defaultNS,
      ns: ns,
      fallbackLng: AppLangEnum.RU,
      lng: (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.CURRENT_LANG)) || AppLangEnum.RU,
      parseMissingKeyHandler: (key) => {
        console.warn(`[MISSING KEY] ${key}`);
        return `[MISSING KEY] ${key}`
      },
    });
})();

export default i18n;
