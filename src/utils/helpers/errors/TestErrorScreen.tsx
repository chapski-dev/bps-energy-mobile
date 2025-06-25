import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Box, Button, Text } from '@src/ui';

import { ErrorTestingUtils } from './ErrorTestingUtils';

interface TestCase {
  id: string;
  title: string;
  description: string;
  action: () => void;
  severity: 'low' | 'medium' | 'high';
}

const TestErrorScreen = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  // Компонент, который вызовет ошибку рендера
  const CrashingComponent = () => {
    if (shouldCrash) {
      return ErrorTestingUtils.testRenderError();
    }
    return <Text>Component rendered successfully</Text>;
  };

  const testCases: TestCase[] = [
    {
      action: ErrorTestingUtils.testJSError,
      description: 'Синхронная JS ошибка',
      id: 'js_error',
      severity: 'high',
      title: 'JavaScript Error',
    },
    {
      action: ErrorTestingUtils.testAsyncError,
      description: 'Асинхронная ошибка в setTimeout',
      id: 'async_error',
      severity: 'high',
      title: 'Async Error',
    },
    {
      action: ErrorTestingUtils.testPromiseRejection,
      description: 'Необработанное отклонение Promise',
      id: 'promise_rejection',
      severity: 'medium',
      title: 'Promise Rejection',
    },
    {
      action: () => setShouldCrash(true),
      description: 'Ошибка в рендере компонента',
      id: 'render_error',
      severity: 'high',
      title: 'Render Error',
    },
    {
      action: ErrorTestingUtils.testNativeError,
      description: 'Симуляция нативной ошибки',
      id: 'native_error',
      severity: 'high',
      title: 'Native Error',
    },
    {
      action: ErrorTestingUtils.testNetworkError,
      description: 'Ошибка сетевого запроса',
      id: 'network_error',
      severity: 'medium',
      title: 'Network Error',
    },
    {
      action: ErrorTestingUtils.testJSONParseError,
      description: 'Ошибка парсинга JSON',
      id: 'json_error',
      severity: 'medium',
      title: 'JSON Parse Error',
    },
    {
      action: ErrorTestingUtils.testStackOverflow,
      description: 'Переполнение стека вызовов',
      id: 'stack_overflow',
      severity: 'high',
      title: 'Stack Overflow',
    },
    {
      action: ErrorTestingUtils.testUndefinedAccess,
      description: 'Доступ к свойству undefined',
      id: 'undefined_access',
      severity: 'medium',
      title: 'Undefined Access',
    },
    {
      action: ErrorTestingUtils.testTypeError,
      description: 'Ошибка типизации',
      id: 'type_error',
      severity: 'medium',
      title: 'Type Error',
    },
    {
      action: ErrorTestingUtils.testManualCrashlytics,
      description: 'Ручная отправка в Crashlytics',
      id: 'manual_crashlytics',
      severity: 'low',
      title: 'Manual Crashlytics',
    },
    {
      action: ErrorTestingUtils.testCustomEvent,
      description: 'Кастомное событие в Crashlytics',
      id: 'custom_event',
      severity: 'low',
      title: 'Custom Event',
    },
  ];

  const handleTest = (testCase: TestCase) => {
    Alert.alert(
      'Тест ошибки',
      `Вы собираетесь запустить: ${testCase.title}\n\n${testCase.description}\n\nУровень: ${testCase.severity}`,
      [
        { style: 'cancel', text: 'Отмена' },
        {
          onPress: () => {
            console.log(`🧪 Starting test: ${testCase.title}`);

            // Устанавливаем контекст для теста
            // CrashHandler.setErrorContext({
            //   test_case: testCase.id,
            //   test_severity: testCase.severity,
            // });

            testCase.action();
          },
          style: 'destructive',
          text: 'Запустить',
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00aa00';
      default: return '#666666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Box style={styles.headerCard}>
        <Text style={styles.title}>🧪 Error Testing</Text>
        <Text style={styles.subtitle}>
          Тестирование системы обработки ошибок
        </Text>
        <Text style={styles.warning}>
          ⚠️ Некоторые тесты могут закрыть приложение
        </Text>
      </Box>

      <Box style={styles.statusCard}>
        <Text style={styles.statusTitle}>Статус системы:</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Platform:</Text>
          <Text style={styles.statusValue}>{Platform.OS}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Dev Mode:</Text>
          <Text style={styles.statusValue}>{__DEV__ ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Crashlytics:</Text>
          <Text style={styles.statusValue}>Active</Text>
        </View>
      </Box>

      {/* Компонент для тестирования рендер ошибок */}
      <Box style={styles.componentCard}>
        <Text style={styles.componentTitle}>Render Test Component:</Text>
        <CrashingComponent />
        {shouldCrash && (
          <Button
            children="Reset Component"
            onPress={() => setShouldCrash(false)}
            buttonStyle={styles.resetButton}
          />
        )}
      </Box>

      {/* Список тестов */}
      {testCases.map((testCase) => (
        <Box key={testCase.id} style={styles.testCard}>
          <View style={styles.testHeader}>
            <Text style={styles.testTitle}>{testCase.title}</Text>
            <View style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(testCase.severity) }
            ]}>
              <Text style={styles.severityText}>
                {testCase.severity.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.testDescription}>
            {testCase.description}
          </Text>
          <Button
            children="Запустить тест"
            onPress={() => handleTest(testCase)}
            buttonStyle={[
              styles.testButton,
              { backgroundColor: getSeverityColor(testCase.severity) }
            ]}
          />
        </Box>
      ))}

      <Box style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Как тестировать:</Text>
        <Text style={styles.infoText}>
          1. Начните с тестов низкой важности (LOW){'\n'}
          2. Проверьте логи в консоли{'\n'}
          3. Убедитесь что ошибки попадают в Crashlytics{'\n'}
          4. Тесты HIGH могут закрыть приложение{'\n'}
          5. Проверьте email отчеты
        </Text>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  componentCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 45,
  },
  headerCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    marginBottom: 32,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 8,
  },
  severityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  statusLabel: {
    color: '#666',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  testButton: {
    borderRadius: 8,
  },
  testCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
  testDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  testHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  testTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  warning: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TestErrorScreen;