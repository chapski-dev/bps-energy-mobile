import { StyleSheet } from 'react-native';

export const commonStytle = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: 18,
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
  textDisabled: {
    color: '#A7ADB2',
  },
  buttonTap: {
    backgroundColor: '#F2F5F7',
    transform: [{ scale: 0.99 }],
  },
});

export const filledStyle = StyleSheet.create({
  text: {
    color: 'white',
  },
  buttonDisabled: {
    backgroundColor: '#E6EAED',
  },
  textDisabled: {
    color: '#8A8F93',
  },
  buttonTap: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }], 
    borderRadius: 8,
  },
});


export const outlineStyle = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
  },
  buttonDisabled: {
    borderColor: '#E6EAED',
  },
  textDisabled: {
    color: '#A7ADB2',
  },
  buttonTap: {
    backgroundColor: '#F2F5F7',
    borderWidth: 0,
    transform: [{ scale: 0.99 }],
  },
});
