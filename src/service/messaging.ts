import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { NativeEventSubscription } from 'react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types.ts';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { registerFCMToken } from '@src/api'
import { isIOS } from '@src/misc/platform';
import notifications from '@src/service/notifications';
import { AppStatus, getAppStatus } from '@src/utils/system';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';
import { vibrate } from '@src/utils/vibrate';

import orders from './orders';

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log('message: ', message);
  
  // TODO check data compatibility
  if (message.data?.eventType === 'new_order') {
    vibrate(HapticFeedbackTypes.notificationSuccess);
    void orders.refresh();
    void notifications.refresh();
  }
  try {
    const channelId = await notifee.createChannel({
      id: 'important',
      importance: AndroidImportance.HIGH,
      name: 'Important Notifications',
    });
    await notifee.displayNotification({
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
      body: message.notification?.body,
      title: message.notification?.title,
    });
  } catch (e) {
    console.error('notifee display error: ', e);
  }
}

const messagingService = () => {
  let _listener: null | NativeEventSubscription;
  let _enabled = false;
  let onMessageUnsubscribe: () => void;

  const init = () => {
    onMessageUnsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    _listener = AppState.addEventListener('change', () =>
      listenAppStateChange(),
    );
    void listenAppStateChange(true);
  };

  const listenAppStateChange = async (forceUpdate = false) => {
    try {
      if (getAppStatus() === AppStatus.inactive) {
        return;
      }

      if (!(await requestPermissions())) {
        return;
      }

      await notifee.setBadgeCount(0);

      const previousToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.FCM_TOKEN_KEY,
      );

      const token = await getFCMToken();
      if (!token) {
        return;
      }
      if (previousToken !== token || forceUpdate) {
        await saveToken(token);
      }
    } catch (error) {
      console.error('messaging listenAppStateChange error', error);
    }
  };

  const requestPermissions = async () => {
    _enabled = true;
    if (isIOS) {
      const authStatus = await messaging().requestPermission();
      _enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } else if (Number(Platform.Version) >= 33) {
      const authStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      _enabled = authStatus === 'granted';
    }
    return _enabled;
  };

  const isEnabled = () => {
    return _enabled;
  };

  const getFCMToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('FCM token', token);
    return token;
  };

  const quitMessaging = async () => {
    _listener?.remove();
    onMessageUnsubscribe?.();
    await messaging().deleteToken();
  };

  const saveToken = async (token: string) => {
    await registerFCMToken(token)
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.FCM_TOKEN_KEY, token);
  };

  const togglePushNotifications = async (enable: boolean) => {
    try {
      if (enable) {
        await requestPermissions();
        const token = await getFCMToken();
        if (token) {
          await saveToken(token);
        }
      } else {
        await quitMessaging();
        await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.FCM_TOKEN_KEY);
      }
      _enabled = enable;
    } catch (error) {
      console.error('Error toggling push notifications', error);
    }
  };

  return {
    getFCMToken,
    init,
    isEnabled,
    quitMessaging,
    requestPermissions,
    saveToken,
    togglePushNotifications,
  };
};

export default messagingService();
