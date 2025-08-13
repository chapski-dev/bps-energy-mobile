import { Linking } from 'react-native';

export interface DeepLinkData {
  type: 'start-session';
  sessionId: string;
}

export class DeepLinkingService {
  private static instance: DeepLinkingService;
  private listeners: ((data: DeepLinkData) => void)[] = [];

  static getInstance(): DeepLinkingService {
    if (!DeepLinkingService.instance) {
      DeepLinkingService.instance = new DeepLinkingService();
    }
    return DeepLinkingService.instance;
  }

  /**
   * Парсит URL и извлекает данные глубокой ссылки
   */
  parseDeepLink(url: string): DeepLinkData | null {
    try {
      const urlObj = new URL(url);
      
      // Проверяем, что это наш домен
      if (urlObj.hostname !== 'bps-energy.by') {
        return null;
      }

      // Парсим путь для start-session
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 4 && pathParts[1] === 'qr' && pathParts[2] === 'start-session') {
        const sessionId = pathParts[3];
        if (sessionId) {
          return {
            sessionId,
            type: 'start-session',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  }

  /**
   * Обрабатывает глубокую ссылку
   */
  handleDeepLink(url: string): void {
    const data = this.parseDeepLink(url);
    if (data) {
      console.log(`сессия ${data.sessionId} началась`);
      this.notifyListeners(data);
    }
  }

  /**
   * Добавляет слушателя для глубоких ссылок
   */
  addListener(listener: (data: DeepLinkData) => void): () => void {
    this.listeners.push(listener);
    
    // Возвращаем функцию для удаления слушателя
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Уведомляет всех слушателей
   */
  private notifyListeners(data: DeepLinkData): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in deep link listener:', error);
      }
    });
  }

  /**
   * Инициализирует обработку глубоких ссылок
   */
  init(): (() => void) | undefined {
    // Обрабатываем начальную ссылку при запуске приложения
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('Initial URL:', url);
        this.handleDeepLink(url);
      }
    }).catch(error => {
      console.error('Error getting initial URL:', error);
    });

    // Обрабатываем ссылки, когда приложение уже запущено
    const subscription = Linking.addEventListener('url', event => {
      console.log('URL event received:', event.url);
      this.handleDeepLink(event.url);
    });

    // Возвращаем функцию для очистки (можно использовать при необходимости)
    return () => {
      subscription?.remove();
    };
  }
}

export const deepLinkingService = DeepLinkingService.getInstance();
