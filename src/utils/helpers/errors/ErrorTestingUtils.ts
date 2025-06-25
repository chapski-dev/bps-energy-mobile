// import { CrashHandler } from './CrashHandler';

export class ErrorTestingUtils {
  // Тестирование JS ошибок
  static testJSError() {
    console.log('🧪 Testing JS Error...');
    throw new Error('Test JS Error: This is a simulated JavaScript error');
  }

  // Тестирование асинхронных ошибок
  static testAsyncError() {
    console.log('🧪 Testing Async Error...');
    setTimeout(() => {
      throw new Error('Test Async Error: This is a simulated async error');
    }, 1000);
  }

  // Тестирование Promise rejection
  static testPromiseRejection() {
    console.log('🧪 Testing Promise Rejection...');
    Promise.reject(new Error('Test Promise Rejection: Unhandled promise rejection'));
  }

  // Тестирование ошибки в render
  static testRenderError() {
    console.log('🧪 Testing Render Error...');
    // Этот метод должен быть вызван из компонента
    const obj: any = null;
    return obj.nonExistentProperty.map(); // Вызовет ошибку
  }

  // Тестирование нативной ошибки (только Android)
  static testNativeError() {
    console.log('🧪 Testing Native Error...');
    const { NativeModules } = require('react-native');
    
    // Попытка вызвать несуществующий нативный метод
    try {
      NativeModules.NonExistentModule.crashApp();
    } catch (error) {
      // Если нативный модуль не найден, симулируем нативную ошибку
      const nativeError = new Error('Simulated Native Crash');
      (nativeError as any).isNativeError = true;
      throw nativeError;
    }
  }

  // Тестирование ошибки сети
  static testNetworkError() {
    console.log('🧪 Testing Network Error...');
    fetch('https://nonexistent-domain-12345.com/api/test')
      .catch(error => {
        console.log('Network error caught:', error);
        throw new Error(`Network Error: ${error.message}`);
      });
  }

  // Тестирование ошибки парсинга JSON
  static testJSONParseError() {
    console.log('🧪 Testing JSON Parse Error...');
    const malformedJSON = '{"incomplete": json';
    JSON.parse(malformedJSON);
  }

  // Тестирование переполнения стека
  static testStackOverflow() {
    console.log('🧪 Testing Stack Overflow...');
    const recursiveFunction = (): any => {
      return recursiveFunction();
    };
    recursiveFunction();
  }

  // Тестирование ошибки доступа к undefined
  static testUndefinedAccess() {
    console.log('🧪 Testing Undefined Access...');
    const obj: any = undefined;
    console.log(obj.property.subProperty);
  }

  // Тестирование ошибки типизации
  static testTypeError() {
    console.log('🧪 Testing Type Error...');
    const str: any = 'hello';
    str.map(() => {}); // Вызовет TypeError
  }

  // Ручная отправка ошибки в Crashlytics
  static testManualCrashlytics() {
    console.log('🧪 Testing Manual Crashlytics...');
    // const testError = new Error('Manual Test Error for Crashlytics');
    // CrashHandler.recordError(testError, {
    //   action: 'manual_error_test',
    //   screen: 'TestScreen',
    //   test_type: 'manual_test',
    // });
  }

  // Тестирование кастомного события
  static testCustomEvent() {
    console.log('🧪 Testing Custom Event...');
    // CrashHandler.logEvent('test_event', {
    //   test_parameter: 'test_value',
    //   timestamp: new Date().toISOString(),
    // });
  }
}