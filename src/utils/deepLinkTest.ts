import { deepLinkingService } from '@src/service/deepLinking';

/**
 * Тестовые функции для проверки работы глубоких ссылок
 */
export const testDeepLinks = () => {
  console.log('=== Тестирование глубоких ссылок ===');
  
  // Тест 1: Правильная ссылка
  const testUrl1 = 'https://bps-energy.by/qr/start-session/8';
  console.log('Тест 1:', testUrl1);
  deepLinkingService.handleDeepLink(testUrl1);
  
  // Тест 2: Ссылка с другим ID
  const testUrl2 = 'https://bps-energy.by/qr/start-session/123';
  console.log('Тест 2:', testUrl2);
  deepLinkingService.handleDeepLink(testUrl2);
  
  // Тест 3: Неправильная ссылка (должна быть проигнорирована)
  const testUrl3 = 'https://example.com/qr/start-session/8';
  console.log('Тест 3:', testUrl3);
  deepLinkingService.handleDeepLink(testUrl3);
  
  // Тест 4: Неправильный формат ссылки
  const testUrl4 = 'https://bps-energy.by/qr/start-session/';
  console.log('Тест 4:', testUrl4);
  deepLinkingService.handleDeepLink(testUrl4);
  
  console.log('=== Тестирование завершено ===');
};

/**
 * Функция для тестирования парсинга URL
 */
export const testUrlParsing = () => {
  console.log('=== Тестирование парсинга URL ===');
  
  const testUrls = [
    'https://bps-energy.by/qr/start-session/8',
    'https://bps-energy.by/qr/start-session/123',
    'https://bps-energy.by/qr/start-session/abc',
    'https://example.com/qr/start-session/8',
    'https://bps-energy.by/qr/start-session/',
    'https://bps-energy.by/other/path',
  ];
  
  testUrls.forEach((url, index) => {
    const result = deepLinkingService.parseDeepLink(url);
    console.log(`URL ${index + 1}: ${url}`);
    console.log(`Результат:`, result);
    console.log('---');
  });
  
  console.log('=== Парсинг URL завершен ===');
};
