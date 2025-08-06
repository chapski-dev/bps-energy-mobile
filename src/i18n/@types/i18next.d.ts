import { defaultNS } from './../resources';
import Resources from './resources.d';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: defaultNS
    resources: Resources;
  }
}