/* eslint-disable sort-keys-fix/sort-keys-fix */

import { Alert, BackHandler, DevSettings, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import * as Sentry from '@sentry/react-native';

import i18n from '@src/i18n/config';

// Interface for device data
interface DeviceInfoData {
  device_brand: string;
  device_model: string;
  system_name: string;
  system_version: string;
}

// Interface for app data
interface AppInfoData {
  app_version: string;
  build_number: string;
  app_name: string;
}


/**
 * Class for handling application errors with Sentry integration.
 * Implements the Singleton pattern for a single instance.
 */
class CrashHandlerService {
  private static instance: CrashHandlerService;
  private deviceInfo: DeviceInfoData | null = null; // Cached device data
  private appInfo: AppInfoData | null = null; // Cached app data

  /**
   * Get the single instance of the class (Singleton pattern).
   * @returns CrashHandlerService instance
   */
  public static getInstance(): CrashHandlerService {
    if (!CrashHandlerService.instance) {
      CrashHandlerService.instance = new CrashHandlerService();
    }
    return CrashHandlerService.instance;
  }

  /**
   * Initialize the service: configure Sentry and error handlers.
   * @param dsn - Sentry DSN
   */
  public async init(dsn: string) {
    this.deviceInfo = await this.getDeviceInfo();
    this.appInfo = await this.getAppInfo();
    await this.setupSentry(dsn);
    this.setupJSExceptionHandler();
    this.setupNativeExceptionHandler();
  }

  /**
   * Set user data for Sentry.
   * @param id - User ID
   * @param email - User email (optional)
   * @param username - Username (optional)
   */
  public setUser(id: string | number, email?: string, username?: string): void {
    Sentry.setUser({
      id: String(id), // Convert to string for consistency
      email,
      username,
    });
  }

  clearErrorContext() {
    Sentry.setUser(null);
    Sentry.setContext('device', {});
    Sentry.setContext('app', {});
  }

  // Configure Sentry for error reporting
  private async setupSentry(dsn: string) {
    try {
      Sentry.init({
        dsn,
        sendDefaultPii: true, // Disable PII sending for privacy protection
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
        tracesSampleRate: __DEV__ ? 1.0 : 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        autoSessionTracking: true,
        integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
      });

      // Set tags and context for all Sentry events
      Sentry.setTags({
        app_version: this.appInfo?.app_version,
        device_brand: this.deviceInfo?.device_brand,
        device_model: this.deviceInfo?.device_model,
        platform: Platform.OS,
      });
      Sentry.setContext('device', this.deviceInfo);
      Sentry.setContext('app', this.appInfo);

      console.log('Sentry initialized');
    } catch (error) {
      console.error('Sentry init failed:', error);
    }
  }

  /**
   * Configure JavaScript error handler.
   */
  private setupJSExceptionHandler() {
    setJSExceptionHandler((error, isFatal) => {
      if (isFatal) {
        Sentry.captureException(error); // Send fatal error to Sentry
        this.handleFatalError(error, 'JS');
      } else {
        console.log('Non-fatal JS error:', error);
      }
    }, true);
  }

  // Native error handler
  private setupNativeExceptionHandler() {
    setNativeExceptionHandler((errorString) => {
      const error = new Error(`Native Crash: ${errorString}`);
      Sentry.captureException(error); // Send native error to Sentry
      this.handleFatalError(error, 'Native');
    }, false);
  }

  /**
   * Handle fatal errors: show message and restart the app.
   * @param error - Error object
   * @param type - Error type ('JS' or 'Native')
   */
  public handleFatalError(error: Error, type: 'JS' | 'Native') {
    const errorMessage = __DEV__
      ? `${type} Error: ${error.message}\n\nStack: ${error.stack?.substring(0, 200)}...`
      : i18n.t('errors:critical.critical-error-occurred');

    Alert.alert(
      i18n.t('errors:critical.critical-error-title'),
      errorMessage,
      [
        {
          onPress: () => this.restartApp(),
          style: 'default',
          text: i18n.t('errors:critical.restart-app'),
        },
        {
          onPress: () => this.closeApp(),
          style: 'destructive',
          text: i18n.t('errors:critical.close-app'),
        },
      ],
    );
  }

  private closeApp() {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      // На iOS показываем инструкцию
      Alert.alert(
        i18n.t('errors:critical.close-app-title'),
        i18n.t('errors:critical.close-app-ios-instruction'),
        [{ text: 'OK' }]
      );
    }
  }

  // Restart or close the app
  private restartApp() {
    RNRestart.restart()
    if (__DEV__) {
      DevSettings.reload();
    } else {
      RNRestart.restart()
    }
  }

  /**
   * Get device data (cached during initialization).
   * @returns Object with device data
   */
  private async getDeviceInfo() {
    try {
      return {
        device_brand: DeviceInfo.getBrand(),
        device_model: DeviceInfo.getModel(),
        system_name: DeviceInfo.getSystemName(),
        system_version: DeviceInfo.getSystemVersion(),
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      return {
        device_brand: 'unknown',
        device_model: 'unknown',
        system_name: Platform.OS,
        system_version: Platform.Version.toString(),
      };
    }
  }

  /**
   * Get app data (cached during initialization).
   * @returns Object with app data
   */
  private async getAppInfo(): Promise<AppInfoData> {
    try {
      return {
        app_name: DeviceInfo.getApplicationName(),
        app_version: DeviceInfo.getVersion(),
        build_number: DeviceInfo.getBuildNumber(),
      };
    } catch (error) {
      console.error('Failed to get app info:', error);
      return {
        app_name: 'unknown',
        app_version: 'unknown',
        build_number: 'unknown',
      };
    }
  }
}

export const CrashHandler = CrashHandlerService.getInstance();