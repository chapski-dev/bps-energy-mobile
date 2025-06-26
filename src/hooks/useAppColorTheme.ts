import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { AppDarkTheme, AppLightTheme } from '@src/theme/theme';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { useCustomAsyncStorage } from './useAsyncStorage';

export const useAppColorTheme = () => {
  const [appThemeKey, setAppThemeKey] = useCustomAsyncStorage(ASYNC_STORAGE_KEYS.ThemeKey);
  const deviceColorScheme = useColorScheme();
  
  // Вычисляем isDarkTheme на основе сохраненного значения или системной темы
  const isDarkTheme = useMemo(() => {
    // Если есть явно сохраненная тема - используем её
    if (appThemeKey === 'dark') return true;
    if (appThemeKey === 'light') return false;
    
    // Если тема не задана (null/undefined) - используем системную
    return deviceColorScheme === 'dark';
  }, [appThemeKey, deviceColorScheme]);

  // Переключение темы с сохранением в AsyncStorage
  const onChangeTheme = useCallback(() => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setAppThemeKey(newTheme);
  }, [isDarkTheme, setAppThemeKey]);

  // Сброс темы к системной (удаляет из AsyncStorage)
  const resetToSystemTheme = useCallback(() => {
    setAppThemeKey(null); // или undefined, зависит от вашего useCustomAsyncStorage
  }, [setAppThemeKey]);
  
  // Мемоизированный объект темы для NavigationContainer
  const theme = useMemo(() => {
    return isDarkTheme ? AppDarkTheme : AppLightTheme;
  }, [isDarkTheme]);
  
  return { 
    appThemeKey, 
    isDarkTheme, 
    onChangeTheme, 
    resetToSystemTheme,
    theme 
  };
};