import { 
  FallbackNs,
  useTranslation, 
  UseTranslationOptions,
  UseTranslationResponse
} from 'react-i18next';
// import { $Tuple } from 'react-i18next/helpers';
import { FlatNamespace, KeyPrefix, TFunction } from 'i18next';
import { $Tuple } from 'node_modules/react-i18next/helpers';

import { resources } from '../i18n/@types/resources';

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