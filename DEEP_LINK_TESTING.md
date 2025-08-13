# Тестирование глубоких ссылок для Android и iOS

## Описание

Реализована система обработки глубоких ссылок для Android и iOS, которая позволяет:
1. Обрабатывать QR-коды с ссылками вида `https://bps-energy.by/qr/start-session/{id}`
2. Выводить в консоль сообщение "сессия {id} началась"
3. Работать как с камерой внутри приложения, так и с внешним сканированием

## Что было реализовано

### Android
#### 1. AndroidManifest.xml
- Добавлен intent-filter для обработки глубоких ссылок
- Настроен autoVerify для автоматической верификации ссылок
- Поддержка схемы https и домена bps-energy.by

#### 2. MainActivity.kt
- Добавлен метод onNewIntent для обработки глубоких ссылок при запущенном приложении

### iOS
#### 1. AppDelegate.mm
- Добавлены методы для обработки Universal Links
- Поддержка openURL и continueUserActivity

#### 2. Info.plist
- Добавлена поддержка Associated Domains
- Настроен домен bps-energy.by

#### 3. apple-app-site-association
- Создан файл для размещения на веб-сервере
- Настроены пути для обработки /qr/start-session/*

### Общее
#### 4. Сервис глубоких ссылок (src/service/deepLinking.ts)
- Класс DeepLinkingService для парсинга и обработки URL
- Система слушателей для уведомления компонентов
- Автоматическая инициализация при запуске приложения

#### 5. Интеграция с камерой
- Обновлен CameraProvider для обработки QR-кодов с глубокими ссылками
- Обновлен ChargingSessionScreen для подписки на события глубоких ссылок

## Как тестировать

### Android

#### 1. Внутреннее сканирование QR-кода
1. Запустите приложение
2. Перейдите на экран "Charging Session"
3. Нажмите на кнопку камеры
4. Отсканируйте QR-код с ссылкой `https://bps-energy.by/qr/start-session/8`
5. В консоли должно появиться: "сессия 8 началась"

#### 2. Внешнее сканирование
1. Используйте любое приложение для сканирования QR-кодов
2. Отсканируйте QR-код с ссылкой `https://bps-energy.by/qr/start-session/8`
3. Выберите ваше приложение для открытия ссылки
4. В консоли должно появиться: "сессия 8 началась"

#### 3. Прямое открытие ссылки
1. В браузере или другом приложении откройте ссылку `https://bps-energy.by/qr/start-session/8`
2. Выберите ваше приложение для открытия
3. В консоли должно появиться: "сессия 8 началась"

### iOS

#### 1. Настройка Universal Links
1. Настройте Associated Domains в Apple Developer Portal
2. Разместите файл apple-app-site-association на сервере
3. Переустановите приложение

#### 2. Тестирование Universal Links
1. Откройте Safari на iOS устройстве
2. Перейдите по ссылке `https://bps-energy.by/qr/start-session/8`
3. Должно появиться предложение открыть приложение
4. Выберите ваше приложение
5. В консоли должно появиться: "сессия 8 началась"

#### 3. Внутреннее сканирование QR-кода (iOS)
1. Запустите приложение
2. Перейдите на экран "Charging Session"
3. Нажмите на кнопку камеры
4. Отсканируйте QR-код с ссылкой `https://bps-energy.by/qr/start-session/8`
5. В консоли должно появиться: "сессия 8 началась"

## Тестовые ссылки

Для тестирования можно использовать следующие ссылки:

- ✅ `https://bps-energy.by/qr/start-session/8` - правильная ссылка
- ✅ `https://bps-energy.by/qr/start-session/123` - правильная ссылка с другим ID
- ❌ `https://example.com/qr/start-session/8` - неправильный домен
- ❌ `https://bps-energy.by/qr/start-session/` - отсутствует ID
- ❌ `https://bps-energy.by/other/path` - неправильный путь

## Структура файлов

```
src/
├── service/
│   └── deepLinking.ts          # Основной сервис глубоких ссылок
├── providers/
│   └── camera.tsx              # Обновлен для обработки QR-кодов
├── screens/
│   └── ChargingSessionScreen.tsx # Обновлен для подписки на события
└── utils/
    └── deepLinkTest.ts         # Тестовые функции

ios/
├── bpsenergy/
│   ├── AppDelegate.mm          # Обновлен для Universal Links
│   └── Info.plist              # Добавлены Associated Domains

android/app/src/main/
├── AndroidManifest.xml         # Добавлен intent-filter
└── java/com/bpsenergy/MainActivity.kt # Добавлен onNewIntent

Файлы для сервера:
├── apple-app-site-association  # Для размещения на bps-energy.by
├── test-qr.html               # QR-коды для тестирования
└── ios-test-links.html        # Тест Universal Links для iOS
```

## Логирование

Все события глубоких ссылок логируются в консоль:
- Успешная обработка: `сессия {id} началась`
- Ошибки парсинга: `Error parsing deep link: {error}`
- Ошибки слушателей: `Error in deep link listener: {error}`

## Дополнительные возможности

В будущем можно расширить функционал:
1. Добавить обработку других типов ссылок
2. Реализовать навигацию к конкретным экранам
3. Добавить обработку параметров в URL
4. Добавить поддержку других доменов
