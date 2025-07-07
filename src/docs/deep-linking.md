# Deep Linking для ChargingSummaryScreen

## Обзор

Реализован диплинкинг для экрана `ChargingSummaryScreen` с защитой авторизации. Пользователи могут переходить на экран деталей зарядки из пуш-уведомлений, но только если они авторизованы.

## Структура

### Типы данных
- `ChargingDetails` - тип для данных о завершенной зарядке
- Обновлены типы навигации в `RootStackParamList`

### Функции защиты
- `checkAuthOrRedirect()` - проверяет авторизацию и редиректит на логин
- `handleDeepLinkWithAuth()` - обрабатывает диплинки с проверкой авторизации

### Хук для обработки
- `useDeepLinkHandler()` - хук для обработки диплинков из пуш-уведомлений

## Использование

### 1. Обработка пуш-уведомлений

```typescript
import { useDeepLinkHandler } from '@src/hooks/useDeepLinkHandler';

const { handleChargingCompleteNotification } = useDeepLinkHandler();

// При получении пуш-уведомления о завершении зарядки
handleChargingCompleteNotification('session_id');
```

### 2. Навигация с защитой

```typescript
import { handleDeepLinkWithAuth } from '@src/providers/auth';

// Если пользователь авторизован - переходит на экран
// Если не авторизован - редиректит на логин
handleDeepLinkWithAuth(
  authState,
  'charging-session-summary',
  {
    session: chargingDetails,
    remainingSessions: 0
  }
);
```

## Настройка диплинкинга

### iOS (Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.bpsenergy.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>bpsenergy</string>
    </array>
  </dict>
</array>
```

### Android (AndroidManifest.xml)
```xml
<activity>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="bpsenergy" />
  </intent-filter>
</activity>
```

### React Navigation Linking
```typescript
const linking = {
  prefixes: ['bpsenergy://', 'https://bpsenergy.com'],
  config: {
    screens: {
      'charging-session-summary': 'charging-complete/:sessionId',
      // другие экраны...
    },
  },
};
```

## Схемы URL

- `bpsenergy://charging-complete/123` - переход на экран деталей зарядки
- `https://bpsenergy.com/charging-complete/123` - universal link

## Безопасность

1. **Проверка авторизации** - перед навигацией проверяется `authState`
2. **Редирект на логин** - неавторизованные пользователи перенаправляются на экран входа
3. **Валидация данных** - проверка корректности параметров сессии

## Тестирование

```typescript
// Тестовый вызов диплинка
handleChargingCompleteNotification('123');
```

## Интеграция с пуш-уведомлениями

При получении пуш-уведомления о завершении зарядки:

1. Извлекаем `sessionId` из данных уведомления
2. Вызываем `handleChargingCompleteNotification(sessionId)`
3. Хук автоматически проверит авторизацию и выполнит навигацию 