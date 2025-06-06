import { AppState , NativeModules } from 'react-native'

import { isIOS } from '@src/misc/platform'
import { navigationRef } from '@src/navigation/navigationRef.ts'

export enum AppStatus {
  inactive,
  active,
}

export function getAppStatus() {
  return AppState.currentState === 'active' ? AppStatus.active : AppStatus.inactive
}

export const waitForNavigationReady = () => {
  return new Promise((resolve) => {
    const handler = () => {
      if (!navigationRef?.isReady()) {
        setTimeout(handler, 500)
      } else {
        resolve(true)
      }
    }

    handler()
  })
}

export const getRegion = () => {
  const region = !isIOS ? NativeModules.I18nManager.localeIdentifier : NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages?.[0];

  region.split('_')[1];
};
