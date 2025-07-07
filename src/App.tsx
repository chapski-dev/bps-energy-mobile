import React from 'react';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YaMap, { Geocoder } from 'react-native-yamap';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';

import { RootStack } from '@src/navigation/RootStack';
import app from '@src/service/app';

import '@src/i18n/config';

import { useAppColorTheme } from './hooks/useAppColorTheme';
import { navigationRef } from './navigation/navigationRef';
import { AuthProvider } from './providers/auth';
import { CameraProvider } from './providers/camera';
import { AppDarkTheme, AppLightTheme } from './theme/theme';
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


function App(): React.JSX.Element {
  const { currentTheme } = useAppColorTheme();
  
  // Определяем тему для NavigationContainer
  const theme = currentTheme === 'dark' ? AppDarkTheme : AppLightTheme;
  
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

export default Sentry.wrap(App);