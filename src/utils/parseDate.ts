import i18n from 'i18next';

type ParseMode = 
| 'default' 
| 'dateOnlyLong' 
| 'dateOnlyShort' 
| 'timeOnly' 
| 'numeric' 
| 'withoutWords';

// Функция для получения предлога времени
function getTimePreposition(locale: string): string {
  const lang = locale.split('-')[0].toLowerCase();
  
  const prepositions: Record<string, string> = {
    'bg': 'в',
    'cs': 'v',
    'de': 'um',
    'en': 'at',
    'es': 'a las',
    'fr': 'à',
    'it': 'alle',
    'ja': '時',
    'ko': '시에',
    'pl': 'o',
    'pt': 'às',
    'ru': 'в',
    'uk': 'о',
    'zh': '在',
  };
  
  return prepositions[lang] || 'at';
}

// Проверка, является ли дата сегодня
function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Проверка, является ли дата вчера
function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

// Получение локализованных текстов "Сегодня"/"Вчера"
function getRelativeDay(date: Date, locale: string): string | null {
  if (isToday(date)) {
    const lang = locale.split('-')[0].toLowerCase();
    const todayTexts: Record<string, string> = {
      'bg': 'Днес',
      'cs': 'Dnes',
      'de': 'Heute',
      'en': 'Today',
      'es': 'Hoy',
      'fr': 'Aujourd\'hui',
      'it': 'Oggi',
      'ja': '今日',
      'ko': '오늘',
      'pl': 'Dzisiaj',
      'pt': 'Hoje',
      'ru': 'Сегодня',
      'uk': 'Сьогодні',
      'zh': '今天',
    };
    return todayTexts[lang] || 'Today';
  }
  
  if (isYesterday(date)) {
    const lang = locale.split('-')[0].toLowerCase();
    const yesterdayTexts: Record<string, string> = {
      'bg': 'Вчера',
      'cs': 'Včera',
      'de': 'Gestern',
      'en': 'Yesterday',
      'es': 'Ayer',
      'fr': 'Hier',
      'it': 'Ieri',
      'ja': '昨日',
      'ko': '어제',
      'pl': 'Wczoraj',
      'pt': 'Ontem',
      'ru': 'Вчера',
      'uk': 'Вчора',
      'zh': '昨天',
    };
    return yesterdayTexts[lang] || 'Yesterday';
  }
  
  return null;
}

export function parseDate(
  dateData: string | Date | number,
  mode: ParseMode = 'default',
  withSeconds: boolean = false,
  locale: string = i18n.language || 'en-US'
): string {
  const date = new Date(dateData);
  
  // Только время
  if (mode === 'timeOnly') {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds && { second: '2-digit' }),
      hour12: false
    });
  }

  if (mode === 'dateOnlyLong') {
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  if (mode === 'dateOnlyShort') {
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }
  // Числовой формат без слов
  if (mode === 'withoutWords') {
    const dateStr = date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const timeStr = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds && { second: '2-digit' }),
      hour12: false
    });
    return `${dateStr} ${timeStr}`;
  }
  
  // Время с предлогом
  const timeStr = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds && { second: '2-digit' }),
    hour12: false
  });
  const preposition = getTimePreposition(locale);
  const timeWithPreposition = `${preposition} ${timeStr}`;
  
  // Проверяем на сегодня/вчера
  const relativeDay = getRelativeDay(date, locale);
  if (relativeDay && (mode === 'default' || mode === 'numeric')) {
    return `${relativeDay} ${timeWithPreposition}`;
  }
  
  // Числовой формат для обычных дат
  if (mode === 'numeric') {
    const dateStr = date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    return `${dateStr}, ${timeWithPreposition}`;
  }
  
  // Ваш существующий формат по умолчанию
  const dateKey = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  return `${dateKey}, ${timeWithPreposition}`;
}