import { useColorScheme } from 'react-native';

import { STORAGE_KEYS } from '@src/utils/vars/storage_keys';

import { useStorage } from './useStorage';

export const useAppColorTheme = () => {
  const [appThemeKey, setAppThemeKey, removeAppThemeKey] = useStorage(STORAGE_KEYS.ThemeKey);
  const systemColorScheme = useColorScheme();

  // Определяем текущую тему
  const currentTheme = appThemeKey || systemColorScheme || 'light';

  // Функция для переключения темы
  const toggleTheme = () => {
    if (currentTheme === 'light') {
      setAppThemeKey('dark');
    } else {
      setAppThemeKey('light');
    }
  };

  // Переключение темы с сохранением в MMKV
  const setDarkTheme = () => {
    setAppThemeKey('dark');
  };

  const setLightTheme = () => {
    setAppThemeKey('light');
  };

  // Сброс темы к системной (удаляет из MMKV)
  const resetToSystemTheme = () => {
    removeAppThemeKey();
  };

  return {
    currentTheme,
    isSystemTheme: !appThemeKey,
    resetToSystemTheme,
    setDarkTheme,
    setLightTheme,
    toggleTheme,
  };
};