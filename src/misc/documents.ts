import { AppLangEnum } from '@src/i18n/resources';
import Config from 'react-native-config';

export const OFFERS = {
  [AppLangEnum.RU]: Config.API_HOST + '/static/oferta.html',
  [AppLangEnum.EN]: Config.API_HOST + '/static/oferta_en.html',
  [AppLangEnum.ZH]: Config.API_HOST + '/static/oferta_en.html',
};

export const PRIVACY_POLICY = {
  [AppLangEnum.RU]: Config.API_HOST + '/static/policy.html',
  [AppLangEnum.EN]: Config.API_HOST + '/static/policy_en.html',
  [AppLangEnum.ZH]: Config.API_HOST + '/static/policy_en.html',
};

export const FAQ_LINK = {
  [AppLangEnum.RU]: Config.API_HOST + '/static/faq.html',
  [AppLangEnum.EN]: Config.API_HOST + '/static/faq_en.html',
  [AppLangEnum.ZH]: Config.API_HOST + '/static/faq_en.html',
};

export const RULES = {
  [AppLangEnum.RU]: Config.API_HOST + '/static/rules_en.html',
  [AppLangEnum.EN]: Config.API_HOST + '/static/rules_en.html',
  [AppLangEnum.ZH]: Config.API_HOST + '/static/rules_en.html',
};