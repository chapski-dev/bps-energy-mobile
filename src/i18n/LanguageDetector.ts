import { NativeModules } from 'react-native'
import YaMap from 'react-native-yamap'
import { LanguageDetectorModule } from 'i18next'

import { isIOS } from '@src/misc/platform'



const RNLanguageDetector: LanguageDetectorModule = {
  cacheUserLanguage: () => {},
  detect: () => {
    const locale = isIOS
      ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier
      
      YaMap.setLocale(locale)
    return locale.split('_')[0]
  },
  init: () => {},
  type: 'languageDetector',
}

export default RNLanguageDetector
