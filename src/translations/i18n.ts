import { initReactI18next, useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { TFunction } from 'i18next';

import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import enTranslation from './en.json';
import RNLanguageDetector from './LanguageDetector';
import ruTranslation from './ru.json';

export enum AppLangEnum {
  RU = 'ru',
  EN = 'en',
}

export const resources = {
  [AppLangEnum.EN]: {
    translation: enTranslation,
  },
  [AppLangEnum.RU]: {
    translation: ruTranslation,
  },
} as const


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


type NestedKeyOf<Obj extends object> = {
  [Key in keyof Obj & string]: 
    Obj[Key] extends Record<string, any> 
      ? `${Key}.${NestedKeyOf<Obj[Key]>}`
      : Key;
}[keyof Obj & string];

export type LocalizationKeys = NestedKeyOf<
  (typeof resources)[AppLangEnum.RU]['translation']
>;

type TFunctionOptions = Parameters<TFunction>[1];

export const useLocalization = useTranslation as (
  ...p: Parameters<typeof useTranslation>
) => Omit<ReturnType<typeof useTranslation>, 't'> & {
  t: (k: LocalizationKeys, opts?: TFunctionOptions) => string;
};

export const saveLanguageAsyncStorage = async (language: AppLangEnum) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.CURRENT_LANG, language);
};


(async () => {
  i18n
    .use(RNLanguageDetector)
    .use(initReactI18next)
    .init({
      defaultNS: undefined,
      fallbackLng: AppLangEnum.RU,
      lng: (await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.CURRENT_LANG)) || AppLangEnum.RU,
      ns: [],
      parseMissingKeyHandler: (key) => {
        console.warn(`[MISSING KEY] ${key}`);
        return `[MISSING KEY] ${key}`
      },
      resources,
    });
})();

export default i18n;
