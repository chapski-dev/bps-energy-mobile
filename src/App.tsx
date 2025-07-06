import React from 'react';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YaMap, { Geocoder } from 'react-native-yamap';
import { Toasts } from '@backpackapp-io/react-native-toast';
import type { UpdateCheckRequest } from '@bravemobile/react-native-code-push';
import CodePush from '@bravemobile/react-native-code-push';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';

import { RootStack } from '@src/navigation/RootStack';
import app from '@src/service/app';
import { logToLogtail } from '@src/utils/logger';

import '@src/i18n/config';

import { useAppColorTheme } from './hooks/useAppColorTheme';
import { navigationRef } from './navigation/navigationRef';
import { AuthProvider } from './providers/auth';
import { CameraProvider } from './providers/camera';
import { ModalLayout } from './ui/Layouts/ModalLayout';
import { CrashHandler } from './utils/helpers/errors/CrashHandler';
import { NetworkStatusBar } from './widgets/NetworkStatusBar';
import { AppServiceStatus } from './events';

const navigationLift = () => {
  app.isNavigationReady = AppServiceStatus.on;
};

CrashHandler.init(Config.SENTRY_DNS)

YaMap.init(Config.YA_MAP_API_KEY);
Geocoder.init(Config.GEOCODER_API_KEY);

const releaseHistoryFetcher = async (updateRequest: UpdateCheckRequest) => {
  const platform = (updateRequest as any).platform ?? (updateRequest as any).os ?? 'ios';
  const app_version = updateRequest.app_version ?? '';
  const identifier = (updateRequest as any).identifier ?? 'production';
  const url = `${Config.SUPABASE_STORAGE_URL}/histories/${platform}/${identifier}/${app_version}.json`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
        Expires: '0',
        Pragma: 'no-cache',
      },
      params: { ts: Date.now() },
    });
    logToLogtail('releaseHistoryFetcher: response', { data: response.data, status: response.status });
    return response.data;
  } catch (error) {
    logToLogtail('releaseHistoryFetcher: error', { error });
    Sentry.captureException(error);
    return {};
  }
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  releaseHistoryFetcher,
};

function App(): React.JSX.Element {
  const { theme } = useAppColorTheme();

  return (
    <AuthProvider>
      <NavigationContainer
        onReady={navigationLift}
        theme={theme}
        ref={navigationRef}
      >
        <SafeAreaProvider >
          <CameraProvider>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <NetworkStatusBar/>
                <RootStack />
                <Toasts />
                <ModalLayout />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </CameraProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

const CodePushedApp = CodePush(codePushOptions)(App);
export default Sentry.wrap(CodePushedApp);