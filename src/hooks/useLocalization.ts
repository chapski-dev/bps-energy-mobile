import { 
  FallbackNs,
  useTranslation as useI18nTranslation, 
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

// Базовые типы
type AllNamespaces = keyof (typeof resources)['ru'];

// Все ключи из defaultNS с полной вложенностью
type DefaultNSKeys = NestedKeyOf<(typeof resources)['ru']['shared']>;

// Ключи с namespace и полной вложенностью
type KeysWithNamespace<T extends AllNamespaces> = T extends string 
  ? `${T}:${NestedKeyOf<(typeof resources)['ru'][T]>}`
  : never;

type AllPossibleKeys = 
  | DefaultNSKeys
  | KeysWithNamespace<Exclude<AllNamespaces, 'shared'>>;

// Элегантное решение с type casting (как в их примере)
export const useLocalization = useI18nTranslation as {
  // Без параметров - расширенный автокомплит
  (): Omit<UseTranslationResponse<'shared', undefined>, 't'> & {
    t: (key: AllPossibleKeys, options?: Parameters<TFunction>[1]) => string;
  };
  
  // С параметрами - стандартное поведение useTranslation
  <
    Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
  >(
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
  ): UseTranslationResponse<FallbackNs<Ns>, KPrefix>;
};