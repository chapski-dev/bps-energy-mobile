import { Alert } from 'react-native';
import CodePush, { DownloadProgress, RemotePackage } from '@bravemobile/react-native-code-push';
import * as Sentry from '@sentry/react-native';

import { logToLogtail } from '@src/utils/logger';

const log = (...args: unknown[]) => {
  console.log('[CodePush] ', { args });
  logToLogtail('[CodePush]', { args });
};

export const onCheckUpdates = () => {
  CodePush.checkForUpdate().then((update: RemotePackage | null) => {
    log('checkForUpdate result:', update);
    if (update) {
      log('CodePush_UpdateAvailable', { appVersion: update.appVersion, label: update.label, update });
      Alert.alert(
        'Доступно обновление',
        `Вышла новая версия: ${update.label || update.appVersion || 'неизвестно'}`,
        [
          {
            onPress: () => {
              log('User pressed download');
              CodePush.sync(
                {
                  installMode: CodePush.InstallMode.IMMEDIATE,
                },
                (status: CodePush.SyncStatus) => {
                  log('CodePush sync status:', status);
                },
                (progress: DownloadProgress) => {
                  log('CodePush download progress:', progress);
                }
              );
            },
            text: 'Скачать',
          },
          {
            onPress: () => {
              log('User cancelled download');
            },
            style: 'cancel',
            text: 'Позже',
          },
        ]
      );
    } else {
      log('Нет доступных обновлений');
    }
  }).catch((err) => {
    log('Ошибка при checkForUpdate:', err);
    Sentry.captureException(err);
  });
}