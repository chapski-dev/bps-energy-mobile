import { Alert } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import Config from 'react-native-config';
import { getUpdateSource, HotUpdater } from '@hot-updater/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppServiceStatus } from '@src/events';
import { navigationRef } from '@src/navigation/navigationRef';
import { dispatchAuth } from '@src/providers/auth';
import { AuthActionType } from '@src/providers/reducers/authReducer';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

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

async function checkForAppUpdate() {
  try {
    const updateInfo = await HotUpdater.checkForUpdate({
      source: getUpdateSource(`${Config.HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`, {
        updateStrategy: 'fingerprint', // or "appVersion"
      }),
    });

    if (!updateInfo) {
      return {
        status: 'UP_TO_DATE',
      };
    }

    const handleUpdate = async () => {
      await updateInfo.updateBundle()
      HotUpdater.reload();
    }

    if (updateInfo.shouldForceUpdate) {
      await handleUpdate()
      return;
    }

    // const messageInfo: Partial<CheckForUpdateResult> = {
    //   'id': updateInfo.id,
    //   'message': updateInfo.message,
    //   'shouldForceUpdate': updateInfo.shouldForceUpdate,
    //   'status': updateInfo.status,
    // }
    Alert.alert('Update now!', JSON.stringify(updateInfo.message), [
      {
        'isPreferred': true,
        'onPress': handleUpdate,
        'text': 'Update',
      },
      {
        'text': 'Later',
      }
    ])
    /**
     * You can apply updates using one of two methods:
     * 
     * Method 1: Use the updateBundle() method from the updateInfo object
     * - A convenience method built into the return value from checkForUpdate
     * - Performs the same function as HotUpdater.updateBundle with all required arguments pre-filled
     */
    // await updateInfo.updateBundle();

    /**
     * Method 2: Call HotUpdater.updateBundle() directly
     * - Explicitly pass the necessary values extracted from updateInfo
     */
    // await HotUpdater.updateBundle({
    //   bundleId: updateInfo.id,
    //   fileUrl: updateInfo.fileUrl,
    //   status: updateInfo.status,
    // });

    return updateInfo;
  } catch (error) {
    Alert.alert(`Failed to check for update: ${JSON.stringify(error)}`,)
    console.error('Failed to check for update:', error);
    return null;
  }
}

export const onNavigationReady = async (status: AppServiceStatus) => {
  if (status === AppServiceStatus.on) {
    const isStorageFilled = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_STATE)
    dispatchAuth?.({ type: isStorageFilled ? AuthActionType.setReady : AuthActionType.setEmpty })
    await waitForNavigationReady()
    await BootSplash.hide({ fade: true });
    await checkForAppUpdate()
  }
};
