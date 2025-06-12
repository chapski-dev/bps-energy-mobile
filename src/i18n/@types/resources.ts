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
    countries: countriesEn,
    errors: errorsEn,
    shared: sharedEn,
  },
  [AppLangEnum.RU]: {
    common: commonRu,
    countries: countriesRu,
    errors: errorsRu,
    shared: sharedRu,
  },
}
