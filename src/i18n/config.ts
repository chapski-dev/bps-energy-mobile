/* eslint-disable sort-keys-fix/sort-keys-fix */
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { mmkvStorage } from '@src/utils/mmkv';
import { STORAGE_KEYS } from '@src/utils/vars/storage_keys';

import { resources } from './@types/resources';
import RNLanguageDetector from './LanguageDetector';

export enum AppLangEnum {
  RU = 'ru',
  EN = 'en',
  ZH = 'zh',
}

export const defaultNS = 'shared';

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

export const saveLanguage = async (language: AppLangEnum) => {
  mmkvStorage.set(STORAGE_KEYS.CURRENT_LANG, language);
};

export const initializeI18n = async () => {
  const ns = Object.keys(resources[AppLangEnum.RU]);
  const lng = mmkvStorage.get(STORAGE_KEYS.CURRENT_LANG) || AppLangEnum.RU;

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