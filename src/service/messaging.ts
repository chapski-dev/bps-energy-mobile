import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { NativeEventSubscription } from 'react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { registerFCMToken } from '@src/api';
import { isIOS } from '@src/misc/platform';
import notifications from '@src/service/notifications';
import { AppStatus, getAppStatus } from '@src/utils/system';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';
import { vibrate } from '@src/utils/vibrate';
import { toast } from '@backpackapp-io/react-native-toast';
import { BaseColors } from '@src/theme/colors';

const toastSuccess = (message: string) => {
  vibrate(HapticFeedbackTypes.notificationSuccess)
  toast(message, {
    // icon: <CheckCircleIcon color={BaseColors.green} />,
    styles: {
      pressable: { backgroundColor: BaseColors.white },
    },
  })
};

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log('message: ', message);

  // TODO check data compatibility
  if (message.data?.eventType === 'session_complite') {
    vibrate(HapticFeedbackTypes.notificationSuccess);
    void notifications.refresh();
  }

  const appStatus = getAppStatus();
  const isAppActive = appStatus === AppStatus.active;

  if (isAppActive) {
    if (message.notification?.body || message.notification?.title) {
      toastSuccess(message.notification?.title || message.notification.body);
    }
    return;
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
      ios: {
        sound: 'local.wav',
        foregroundPresentationOptions: {
          badge: true,
          banner: true,
          list: true,
          sound: true,
        },
      },
      title: message.notification?.title,
    });
  } catch (e) {
    console.error('notifee display error: ', e);
  }
}

// Обработчик событий notifee для iOS
const onNotifeeEvent = async (event: { type: EventType; notification?: unknown }) => {
  console.log('Notifee event:', event);
  
  if (event.type === EventType.PRESS) {
    // Обработка нажатия на уведомление
    console.log('Notification pressed:', event.notification);
  }
};

const messagingService = () => {
  let _listener: null | NativeEventSubscription;
  let _enabled = false;
  let onMessageUnsubscribe: () => void;
  let notifeeUnsubscribe: () => void;
  let _badgeCount = 0;

  const init = async () => {
    // Инициализируем notifee для iOS
    if (isIOS) {
      await notifee.requestPermission();
    }

    onMessageUnsubscribe = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    // Подписываемся на события notifee
    notifeeUnsubscribe = notifee.onForegroundEvent(onNotifeeEvent);

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
    notifeeUnsubscribe?.();
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
