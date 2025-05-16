import { AppState } from 'react-native'

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
