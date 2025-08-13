# Настройка Universal Links для iOS

## Что нужно сделать

### 1. Настройка Apple Developer Account

1. Войдите в [Apple Developer Portal](https://developer.apple.com/account/)
2. Перейдите в "Certificates, Identifiers & Profiles"
3. Выберите ваш App ID (com.bpsenergy.charging)
4. Включите "Associated Domains" capability
5. Сохраните изменения

### 2. Настройка веб-сервера

Файл `apple-app-site-association` должен быть размещен на сервере `bps-energy.by` по адресу:
```
https://bps-energy.by/.well-known/apple-app-site-association
```

#### Содержимое файла:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.bpsenergy.charging",
        "paths": [
          "/qr/start-session/*"
        ]
      }
    ]
  }
}
```

#### Важные моменты:
- Замените `TEAM_ID` на ваш реальный Team ID из Apple Developer Portal
- Файл должен быть доступен по HTTPS
- Content-Type должен быть `application/json`
- Файл должен быть доступен без редиректов

### 3. Проверка настройки

После размещения файла на сервере, проверьте его доступность:
```bash
curl -I https://bps-energy.by/.well-known/apple-app-site-association
```

Должен вернуться статус 200 и Content-Type: application/json

### 4. Тестирование

1. Установите приложение на устройство
2. Откройте Safari и перейдите по ссылке: `https://bps-energy.by/qr/start-session/8`
3. Должно появиться предложение открыть приложение
4. При выборе приложения в консоли должно появиться: "сессия 8 началась"

## Troubleshooting

### Проблема: Ссылки не открываются в приложении

1. Проверьте, что файл `apple-app-site-association` доступен по HTTPS
2. Убедитесь, что Team ID указан правильно
3. Проверьте, что "Associated Domains" включена в App ID
4. Переустановите приложение после изменений

### Проблема: Файл не загружается

1. Проверьте права доступа к файлу на сервере
2. Убедитесь, что сервер отдает правильный Content-Type
3. Проверьте, что нет редиректов

### Проверка Team ID

Team ID можно найти в Apple Developer Portal:
1. Войдите в [developer.apple.com](https://developer.apple.com)
2. Перейдите в "Membership"
3. Team ID указан в разделе "Membership Information"

## Примеры ссылок для тестирования

- ✅ `https://bps-energy.by/qr/start-session/8`
- ✅ `https://bps-energy.by/qr/start-session/123`
- ❌ `https://example.com/qr/start-session/8` (неправильный домен)
- ❌ `https://bps-energy.by/other/path` (неправильный путь)
