import { Platform } from 'react-native';
import { Config } from 'react-native-config';

export const logToLogtail = (message: string, extra?: object) => {
  const payload = {
    dt: new Date().toISOString(),
    message,
    ...extra,
    platform: typeof Platform !== 'undefined' ? Platform.OS : undefined,
  };

  fetch(Config.LOGTAIL_URL, {
    body: JSON.stringify(payload),
    headers: {
      'Authorization': `Bearer ${Config.LOGTAIL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).catch((err) => {
    if (__DEV__) {
      console.log('[Logtail] Failed to send log:', err);
    }
  });
};