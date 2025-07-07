# Миграция с AsyncStorage на MMKV

## Обзор

Проект был успешно мигрирован с `@react-native-async-storage/async-storage` на `react-native-mmkv`. MMKV - это высокопроизводительная библиотека для хранения данных, которая значительно быстрее AsyncStorage.

## Что было изменено

### 1. Установка MMKV
```bash
yarn add react-native-mmkv
```

### 2. Создан файл конфигурации MMKV
`src/utils/mmkv.ts` - основной файл для работы с MMKV, содержащий:
- Экземпляр MMKV с ID `bpsenergy-storage`
- Вспомогательные функции `mmkvStorage`
- Асинхронные обертки `mmkvAsyncStorage` для совместимости с AsyncStorage API

### 3. Обновленные файлы

#### Основные изменения:
- `src/hooks/useAsyncStorage.ts` - обновлен для работы с MMKV
- `src/i18n/config.ts` - замена AsyncStorage на MMKV
- `src/api/config.ts` - обновлен для работы с токенами через MMKV
- `src/providers/auth.tsx` - миграция аутентификации
- `src/actions/onNavigationReady.ts` - обновлен
- `src/service/app.ts` - замена очистки хранилища
- `src/service/messaging.ts` - обновлен для FCM токенов
- `src/store/useFilterOfStationsStore.tsx` - обновлен Zustand store
- `src/hooks/useAppColorTheme.ts` - обновлен для работы с темами

### 4. Ключи хранилища
Все существующие ключи AsyncStorage остались без изменений:
```typescript
export const ASYNC_STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/access_token',
  AUTH_STATE: '@app/auth_state',
  CURRENT_LANG: '@i18/current_language',
  FCM_TOKEN_KEY: '@firebase_messaging/token',
  LOCATIONS: '@driver/locations',
  LOCK_METHOD: '@security/lock_method',
  OFFLINE_LOCATIONS: '@driver/offline_geolocations',
  REFRESH_TOKEN: '@app/refresh_token',
  ThemeKey: '@appTheme/string'
}
```

## Преимущества MMKV

1. **Производительность**: MMKV работает в 10-100 раз быстрее AsyncStorage
2. **Синхронные операции**: MMKV предоставляет синхронные методы для чтения/записи
3. **Меньший размер**: Библиотека занимает меньше места
4. **Лучшая совместимость**: Поддерживает больше типов данных

## API совместимость

### Синхронные операции (рекомендуется):
```typescript
import { mmkvStorage } from '@src/utils/mmkv';

// Получить значение
const value = mmkvStorage.get('key');

// Установить значение
mmkvStorage.set('key', 'value');

// Удалить значение
mmkvStorage.delete('key');

// Проверить существование
const exists = mmkvStorage.contains('key');
```

### Асинхронные обертки (для совместимости):
```typescript
import { mmkvAsyncStorage } from '@src/utils/mmkv';

// Аналогично AsyncStorage API
await mmkvAsyncStorage.setItem('key', 'value');
const value = await mmkvAsyncStorage.getItem('key');
await mmkvAsyncStorage.removeItem('key');
```

## Хуки

### useCustomAsyncStorage
Хук для работы с MMKV как с реактивным состоянием:
```typescript
const [value, setValue, removeValue] = useCustomAsyncStorage('key');
```

### useParsedStorage
Хук для работы с JSON данными:
```typescript
const [data, setData, removeData] = useParsedStorage<MyType>('key');
```

## Удаление AsyncStorage

После успешного тестирования можно удалить AsyncStorage:

```bash
yarn remove @react-native-async-storage/async-storage
```

## Тестирование

1. Проверьте, что все данные корректно сохраняются и загружаются
2. Убедитесь, что аутентификация работает правильно
3. Проверьте работу с темами и языками
4. Протестируйте FCM уведомления
5. Убедитесь, что фильтры станций работают корректно

## Обратная совместимость

Все существующие данные в AsyncStorage будут автоматически доступны в MMKV, так как мы используем те же ключи. Однако рекомендуется протестировать миграцию на тестовых устройствах.

## Производительность

Ожидаемые улучшения:
- Более быстрая загрузка приложения
- Уменьшение времени отклика при работе с данными
- Снижение нагрузки на основной поток
- Улучшение пользовательского опыта 