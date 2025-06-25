import React from 'react';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YaMap, { Geocoder } from 'react-native-yamap';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';

import { RootStack } from '@src/navigation/RootStack';
import app from '@src/service/app';

import '@src/i18n/config';

import { useAppColorTheme } from './hooks/useAppColorTheme';
import { navigationRef } from './navigation/navigationRef';
import { AuthProvider } from './providers/auth';
import { CameraProvider } from './providers/camera';
import { ModalLayout } from './ui/Layouts/ModalLayout';
import { CrashHandler } from './utils/helpers/errors/CrashHandler';
import { AppServiceStatus } from './events';

const navigationLift = () => {
  app.isNavigationReady = AppServiceStatus.on;
};

YaMap.init('75fa36de-698d-4673-add7-359845159f49');
Geocoder.init('e15f9e9e-9e7f-49bf-88ff-4e98db8416be');

setJSExceptionHandler((error, isFatal) => {
  console.log({ error, isFatal });
  if (isFatal) {

    // Send the error details to a server or display an error screen.
    // Example: axios.post('https://your-backend-server.com/errors'
    // Display a custom error message or UI.
    CrashHandler.handleFatalError(error, 'JavaScript')
  } else {
    console.log('Non-fatal JS error:', error); // Non-fatal error handling
  }

  // Optionally log the error to a server or third-party error tracking service like Sentry or Bugsnag.
}, true);

setNativeExceptionHandler((errorString) => {
  console.error('Caught native error:', errorString);

  // Send the error details to a server or display an error screen.
  // Example: axios.post('https://your-backend-server.com/errors', { error: errorString });
  // Display an alert or log this for debugging purpose
}, false);

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

export default App;
