import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YaMap, { Geocoder } from 'react-native-yamap';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';

import { RootStack } from '@src/navigation/stacks/RootStack';
import app from '@src/service/app';

import '@src/translations/i18n';

import { useAppColorTheme } from './hooks/useAppColorTheme';
import { navigationRef } from './navigation/navigationRef';
import { UnauthorizedStack } from './navigation/stacks/UnauthorizedStack';
import { AuthProvider, AuthState, useAuth } from './providers/auth';
import { ModalLayout } from './ui/Layouts/ModalLayout';
import { AppServiceStatus } from './events';

const navigationLift = () => {
  app.isNavigationReady = AppServiceStatus.on;
};

YaMap.init('75fa36de-698d-4673-add7-359845159f49');
Geocoder.init('e15f9e9e-9e7f-49bf-88ff-4e98db8416be');

function App(): React.JSX.Element {
  const { theme } = useAppColorTheme();

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <SafeAreaProvider >
          <NavigationContainer
            onReady={navigationLift}
            theme={theme}
            ref={navigationRef}
          >
            <BottomSheetModalProvider>
              <Content />
              <Toasts />
              <ModalLayout />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

const Content = () => {
  const { authState } = useAuth();
  return authState === AuthState.ready ? <RootStack /> : <UnauthorizedStack />;
};

export default App;
