import Resources from './resources.d';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'shared'
    resources: Resources;
  }
}