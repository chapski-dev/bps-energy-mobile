// import { useColorScheme } from 'react-native';

import { AppLightTheme } from '@src/theme/theme';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

import { useCustomAsyncStorage } from './useAsyncStorage';
// TODO: return in the future to changeble theme
export const useAppColorTheme = () => {
  const [appThemeKey] = useCustomAsyncStorage(ASYNC_STORAGE_KEYS.ThemeKey);
  // const deviceColorScheme = useColorScheme();

  const theme: Omit<App.Theme, 'insets'> = AppLightTheme;

  // switch (appThemeKey) {
  //   case 'dark': {
  //     theme = AppDarkTheme;
  //     break;
  //   }
  //   case 'light': {
  //     theme = AppLightTheme;
  //     break;
  //   }
  //   default: {
  //     theme = deviceColorScheme === 'dark' ? AppDarkTheme : AppLightTheme;
  //     break;
  //   }
  // }

  return { appThemeKey, theme };
};
