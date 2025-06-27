import { AppRegistry } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

import { name as appName } from './app.json';
import App from './src/App';
import { CrashHandler } from './src/utils/helpers/errors/CrashHandler';

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

AppRegistry.registerComponent(appName, () => App);
