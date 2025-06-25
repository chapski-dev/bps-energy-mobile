import { Alert, BackHandler,Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import crashlytics from '@react-native-firebase/crashlytics';

import i18n from '@src/i18n/config';

interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  [key: string]: any;
}

class CrashHandlerService {
  private static instance: CrashHandlerService;
  private errorContext: ErrorContext = {};
  private isHandlingCrash = false;

  static getInstance(): CrashHandlerService {
    if (!CrashHandlerService.instance) {
      CrashHandlerService.instance = new CrashHandlerService();
    }
    return CrashHandlerService.instance;
  }

  // Инициализация обработчиков ошибок
  init() {
    // this.setupJSExceptionHandler();
    // this.setupNativeExceptionHandler();
    // this.setupCrashlyticsCollection();
  }

  // Установка контекста для ошибок
  setErrorContext(context: ErrorContext) {
    this.errorContext = { ...this.errorContext, ...context };
    
    // Устанавливаем контекст в Crashlytics
    crashlytics().setAttributes({
      current_screen: context.screen || 'unknown',
      last_action: context.action || 'unknown',
      user_id: context.userId || 'anonymous',
      ...context,
    });
  }

  // Очистка контекста
  clearErrorContext() {
    this.errorContext = {};
  }

  // Настройка обработчика JS ошибок
  private setupJSExceptionHandler() {
    setJSExceptionHandler((error, isFatal) => {
      // if (this.isHandlingCrash) return;
      // this.isHandlingCrash = true;

      console.error('JS Exception:', error, 'isFatal:', isFatal);
      
      // Логируем в Crashlytics
      this.logErrorToCrashlytics(error, {
        context: this.errorContext,
        isFatal,
        type: 'js_exception',
      });

      if (isFatal) {
        this.handleFatalError(error, 'JavaScript');
      } else {
        console.log('Non-fatal JS error:', error);
      }
    }, true);

  }

  // Настройка обработчика нативных ошибок
  private setupNativeExceptionHandler() {
    setNativeExceptionHandler((exceptionString) => {
      console.error('exceptionString ->', exceptionString);
      
      // if (this.isHandlingCrash) return;
      // this.isHandlingCrash = true;

      console.error('Native Exception:', exceptionString);
      
      // Создаем Error объект из строки
      const error = new Error(`Native Exception: ${exceptionString}`);
      
      // Логируем в Crashlytics
      this.logErrorToCrashlytics(error, {
        context: this.errorContext,
        isFatal: true,
        nativeStack: exceptionString,
        type: 'native_exception',
      });

      this.handleFatalError(error, 'Native');
    });
  }

  // Настройка сбора данных Crashlytics
  private async setupCrashlyticsCollection() {
    try {
      // Включаем сбор данных в продакшене
      await crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);
      
      // Устанавливаем базовые атрибуты устройства
      const deviceInfo = await this.getDeviceInfo();
      await crashlytics().setAttributes(deviceInfo);
      
      console.log('Crashlytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Crashlytics:', error);
    }
  }

  // Логирование ошибки в Crashlytics
  private async logErrorToCrashlytics(error: Error, metadata: any) {
    try {
      // Добавляем метаданные
      await crashlytics().setAttributes({
        error_type: metadata.type,
        is_fatal: metadata.isFatal?.toString(),
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
        ...metadata.context,
      });

      // Если есть нативный стек, добавляем его
      if (metadata.nativeStack) {
        await crashlytics().setAttributes({
          native_stack: metadata.nativeStack,
        });
      }

      // Записываем ошибку
      crashlytics().recordError(error);
      
      // Логируем кастомное событие
      crashlytics().log(`${metadata.type} occurred: ${error.message}`);
      
    } catch (loggingError) {
      console.error('Failed to log to Crashlytics:', loggingError);
    }
  }

  // Обработка фатальных ошибок
  public handleFatalError(error: Error, errorType: string) {
    const errorMessage = __DEV__ 
      ? `${errorType} Error: ${error.message}\n\nStack: ${error.stack?.substring(0, 200)}...`
      : i18n.t('errors:critical.critical-error-occurred');

    Alert.alert(
      i18n.t('errors:critical.critical-error-title'),
      errorMessage,
      [
        {
          onPress: () => this.sendErrorReport(error, errorType),
          text: i18n.t('errors:critical.send-report'),
        },
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
      { 
        cancelable: false,
        onDismiss: () => this.restartApp(),
      }
    );
  }

  // Отправка отчета об ошибке
  private async sendErrorReport(error: Error, errorType: string) {
    try {
      const deviceInfo = await this.getDeviceInfo();
      const appInfo = await this.getAppInfo();
      
      const reportData = {
        app: appInfo,
        context: this.errorContext,
        device: deviceInfo,
        error: {
          message: error.message,
          stack: error.stack,
          type: errorType,
        },
        timestamp: new Date().toISOString(),
      };

      // Отправляем отчет по email
      await this.sendEmailReport(reportData);
      
    } catch (reportError) {
      console.error('Failed to send error report:', reportError);
      this.restartApp();
    }
  }

  // Отправка отчета по email
  private async sendEmailReport(reportData: any) {
    const supportEmail = 'support@bps-energy.by';
    try {
      const subject = encodeURIComponent(`Critical Error Report - ${reportData.error.type}`);
      const body = encodeURIComponent(`
Critical Error Report

ERROR DETAILS:
Type: ${reportData.error.type}
Message: ${reportData.error.message}
Timestamp: ${reportData.timestamp}

DEVICE INFO:
${JSON.stringify(reportData.device, null, 2)}

APP INFO:
${JSON.stringify(reportData.app, null, 2)}

CONTEXT:
${JSON.stringify(reportData.context, null, 2)}

STACK TRACE:
${reportData.error.stack}

Please investigate this issue.
      `);
      
      const mailUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
      
      const canOpen = await Linking.canOpenURL(mailUrl);
      if (canOpen) {
        await Linking.openURL(mailUrl);
        
        // Небольшая задержка перед перезапуском
        setTimeout(() => this.restartApp(), 2000);
      } else {
        throw new Error('Cannot open email client');
      }
    } catch (error) {
      // Fallback - показываем email для ручного копирования
      Alert.alert(
        i18n.t('errors:critical.manual-report-title'),
        `${i18n.t('errors:critical.manual-report-message')}\n\n${supportEmail}`,
        [
          {
            onPress: () => this.restartApp(),
            text: i18n.t('errors:critical.restart-app'),
          },
        ]
      );
    }
  }

  // Перезапуск приложения
  private restartApp() {
    if (__DEV__) {
      // В dev режиме используем reload
      const DevSettings = require('react-native').DevSettings;
      DevSettings.reload();
    } else {
      // В продакшене закрываем приложение
      this.closeApp();
    }
  }

  // Закрытие приложения
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

  // Получение информации об устройстве
  private async getDeviceInfo() {
    try {
      return {
        available_storage: await DeviceInfo.getFreeDiskStorage(),
        battery_level: await DeviceInfo.getBatteryLevel(),
        device_brand: DeviceInfo.getBrand(),
        device_id: await DeviceInfo.getUniqueId(),
        device_model: DeviceInfo.getModel(),
        has_notch: DeviceInfo.hasNotch(),
        is_emulator: await DeviceInfo.isEmulator(),
        is_tablet: DeviceInfo.isTablet(),
        system_name: DeviceInfo.getSystemName(),
        system_version: DeviceInfo.getSystemVersion(),
        total_memory: await DeviceInfo.getTotalMemory(),
        used_memory: await DeviceInfo.getUsedMemory(),
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

  // Получение информации о приложении
  private async getAppInfo() {
    try {
      return {
        app_name: DeviceInfo.getApplicationName(),
        app_version: DeviceInfo.getVersion(),
        build_number: DeviceInfo.getBuildNumber(),
        bundle_id: DeviceInfo.getBundleId(),
        install_time: await DeviceInfo.getFirstInstallTime(),
        is_debug: __DEV__,
        update_time: await DeviceInfo.getLastUpdateTime(),
      };
    } catch (error) {
      console.error('Failed to get app info:', error);
      return {
        app_name: 'unknown',
        app_version: 'unknown',
        is_debug: __DEV__,
      };
    }
  }

  // Ручная отправка ошибки
  recordError(error: Error, context?: ErrorContext) {
    if (context) {
      this.setErrorContext(context);
    }
    
    this.logErrorToCrashlytics(error, {
      context: this.errorContext,
      isFatal: false,
      type: 'manual_report',
    });
  }

  // Логирование кастомного события
  logEvent(eventName: string, parameters?: { [key: string]: any }) {
    try {
      crashlytics().log(`Custom event: ${eventName}`);
      if (parameters) {
        crashlytics().setAttributes(parameters);
      }
    } catch (error) {
      console.error('Failed to log custom event:', error);
    }
  }
}

// Экспортируем синглтон
export const CrashHandler = CrashHandlerService.getInstance();
