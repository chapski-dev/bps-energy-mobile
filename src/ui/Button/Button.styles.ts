import { StyleSheet } from 'react-native';

export const commonStytle = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '500'
  },
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
});

export const clearStyle = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 15,
  },
});

export const filledStyle = StyleSheet.create({
  text: {
    color: 'white',
  },
});

export const outlineStyle = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
  },
});