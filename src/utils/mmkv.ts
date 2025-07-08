/* eslint-disable sort-keys-fix/sort-keys-fix */
import { NativeModules,Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Нативный модуль для исключения из iCloud бэкапов
const { MMKVBackupExclusion } = NativeModules;

// Функция для исключения файлов из iCloud бэкапов (iOS)
const excludeFromBackup = async () => {
  if (Platform.OS === 'ios' && MMKVBackupExclusion) {
    try {
      await MMKVBackupExclusion.excludeFromBackup();
      console.log('MMKV: Successfully excluded from iCloud backup');
    } catch (error) {
      console.error('MMKV: Failed to exclude from iCloud backup:', error);
    }
  }
};

// Создаем основной экземпляр MMKV для приложения
export const storage = new MMKV({
  id: 'bpsenergy-storage',
  // Шифрование для дополнительной безопасности
  encryptionKey: 'bpsenergy-secure-key-2024'
});

// Исключаем файл из iCloud бэкапов после создания
excludeFromBackup();

// Основные функции для работы с MMKV
export const mmkvStorage = {
  // Получить значение
  get: (key: string): string | undefined => {
    return storage.getString(key);
  },

  // Установить значение
  set: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Удалить значение
  delete: (key: string): void => {
    storage.delete(key);
  },

  // Проверить существование ключа
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  // Очистить все данные
  clear: (): void => {
    storage.clearAll();
  },

  // Получить все ключи
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  // Получить количество элементов
  size: (): number => {
    return storage.size;
  }
};

// Асинхронные обертки для Zustand (только для совместимости)
export const zustandStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return value ?? null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    storage.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    storage.delete(key);
  },

  clear: async (): Promise<void> => {
    storage.clearAll();
  },

  multiGet: async (keys: string[]): Promise<[string, string | null][]> => {
    return keys.map(key => [key, storage.getString(key) ?? null]);
  },

  multiSet: async (keyValuePairs: [string, string][]): Promise<void> => {
    keyValuePairs.forEach(([key, value]) => {
      storage.set(key, value);
    });
  },

  multiRemove: async (keys: string[]): Promise<void> => {
    keys.forEach(key => storage.delete(key));
  }
};