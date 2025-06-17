import { AppLangEnum } from '../config';
import commonEn from '../en';
import countriesEn from '../en/countries.json';
import errorsEn from '../en/errors.json';
import sharedEn from '../en/shared.json';
import commonRu from '../ru';
import countriesRu from '../ru/countries.json';
import errorsRu from '../ru/errors.json';
import sharedRu from '../ru/shared.json';



export const resources = {
  [AppLangEnum.EN]: {
    common: commonEn,
    countries: countriesEn.countries,
    errors: errorsEn.errors,
    shared: sharedEn.shared,
  },
  [AppLangEnum.RU]: {
    common: commonRu,
    countries: countriesRu.countries,
    errors: errorsRu.errors,
    shared: sharedRu.shared,
  },
}
