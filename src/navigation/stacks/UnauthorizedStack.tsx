import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@src/screens/LoginScreen';
import { useAppTheme } from '@src/theme/theme';

import { UnauthorizedStackParamList } from '../types';
import LoginViaEmailScreen from '@src/screens/LoginEmailScreen';

const Stack = createNativeStackNavigator<UnauthorizedStackParamList>();

export const UnauthorizedStack = () => {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: colors.main,
      headerTitleStyle: { color: colors.textDefault },
      title: ''
    }}>
      <Stack.Screen
        options={{ headerShown: false, }}
        name='login-via-phone' component={LoginViaEmailScreen}
      />
      <Stack.Screen
        options={{ headerShown: false, }}
        name="login" component={LoginScreen}
      />
    </Stack.Navigator>
  );
};
