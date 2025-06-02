/* eslint-disable sort-keys-fix/sort-keys-fix */

export const DefaultColors = {
  background: '#fff',
  black: '#000000',
  green: '#34C759',
  green_light: '#34c75926',
  grey_50: '#F2F5F7',
  /** disabled color */
  grey_100: '#E6EAED',
  /** border color */
  grey_200: '#D7DCE0',
  grey_300: '#C2C7CC',
  grey_400: '#A7ADB2',
  grey_500: '#9BA4AD',
  /** label */
  grey_600: '#8A8F93',
  grey_700: '#46484A',
  /** text default */
  grey_800: '#000A0A',
  main: '#008C92',
  red_500: '#E73054',
  red_light: '#E7303026',
  orange_500: '#E7B930',
  white: '#FFF',
  white_transparent: '#ffffffea',
} as const;

export const lightColors = {
  ...DefaultColors,
} as const;

export const darkColors = {
  ...DefaultColors,
} as const;
