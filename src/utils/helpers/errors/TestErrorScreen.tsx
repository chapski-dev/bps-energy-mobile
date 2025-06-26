import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@src/theme/theme';
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
  const { colors, insets } = useAppTheme();
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
      case 'high': return colors.error_500;
      case 'medium': return colors.warning_500;
      case 'low': return colors.green;
      default: return '#666666';
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 15,
        paddingHorizontal: 16,
        paddingTop: insets.top,
      }}
    >
      <Box mb={16}>
        <Text
          variant='h3'
          center
          mb={8}
          children="🧪 Error Testing"
        />
        <Text
          style={styles.subtitle}
          colorName='grey_600'
          children="Тестирование системы обработки ошибок"
        />
        <Text
          variant='p3-semibold'
          center
          colorName='error_500'
          children="⚠️ Некоторые тесты могут закрыть приложение"
        />
      </Box>

      <Box mb={16} borderRadius={12} backgroundColor={colors.card} px={16} py={12}>
        <Text variant='h5' mb={8}>Статус системы:</Text>
        <Box row justifyContent='space-between' mb={4}>
          <Text children="Platform:" />
          <Text fontWeight='600'>{Platform.OS}</Text>
        </Box>
        <Box row justifyContent='space-between' mb={4}>
          <Text>Dev Mode:</Text>
          <Text fontWeight='600'>{__DEV__ ? 'Yes' : 'No'}</Text>
        </Box>
        <Box row justifyContent='space-between' mb={4}>
          <Text>Crashlytics:</Text>
          <Text fontWeight='600'>Active</Text>
        </Box>
      </Box>

      {/* Компонент для тестирования рендер ошибок */}
      <Box mb={16} borderRadius={12} backgroundColor={colors.grey_200} px={16} py={12} >
        <Text variant='h5' mb={8} children="Render Test Component:" />
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
          <Text
            style={styles.testDescription}
            colorName='label'
            children={testCase.description}
          />
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

      <Box>
        <Text style={styles.infoTitle} children="💡 Как тестировать:" />
        <Text style={styles.infoText} colorName='label' >
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
  container: {
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resetButton: {
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
  statusLabel: {
    fontSize: 14,
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
});

export default TestErrorScreen;