import { NativeModules } from 'react-native'
import { LanguageDetectorModule } from 'i18next'

import { isIOS } from '@src/utils/vars/platform'


const RNLanguageDetector: LanguageDetectorModule = {
  cacheUserLanguage: () => {},
  detect: () => {
    const locale = isIOS
      ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier
    return locale.split('_')[0]
  },
  init: () => {},
  type: 'languageDetector',
}

export default RNLanguageDetector
