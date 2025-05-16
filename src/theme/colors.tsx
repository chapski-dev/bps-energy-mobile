export const DefaultColors = {
  background: '#FAFAFA',
  black: '#000000',
  blue: '#639DF4',
  border: '#E1E1E1',
  dark_grey: '#494D4E',
  disabled: '#D7D6D6',
  green: '#81CC20',
  grey: '#EDEDED',
  label: '#798391',
  light_green: '#81CC20',
  light_grey: '#EEEEEE',
  light_red: '#FFCCCC',
  main: '#008C92',
  main_light: '#FAB54D26',
  red: '#EC1B2E',
  textDefault: '#091C21',
  textDefaultReverse: '#FFFFFF',
  textSecondary: '#979797',
  white: '#FFFFFF',
} as const;

export const lightColors = {
  ...DefaultColors,
} as const;

export const darkColors = {
  ...DefaultColors,
} as const;
