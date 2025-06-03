import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthState, useAuth } from '@src/providers/auth';
import AddingCardAndPayment from '@src/screens/AddingCardAndPaymentScreen';
import ChangePasswordScreen from '@src/screens/ChangePasswordScreen';
import CharginStationScreen from '@src/screens/CharginStationScreen';
import FiltersOfStations from '@src/screens/FiltersOfStations';
import ForgotPasswordScreen from '@src/screens/ForgotPasswordScreen';
import LoginScreen from '@src/screens/LoginScreen';
import OtpVerifyScreen from '@src/screens/OtpVerifyScreen';
import { ProfileDetailsScreen } from '@src/screens/ProfileDetailsScreen';
import RegistrationScreen from '@src/screens/RegistrationScreen';
import SetNewPasswordScreen from '@src/screens/SetNewPasswordScreen';
import TopUpAccountScreen from '@src/screens/TopUpAccountScreen';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';

import { Tabs } from '../Tabs';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { t } = useLocalization();
  const { colors } = useAppTheme();
  const { authState } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.main,
        headerTitleStyle: { color: colors.grey_800 },
        title: '',
      }}
    >
      {authState !== AuthState.ready && (
        <Stack.Group navigationKey="unauthorized">
          <Stack.Screen
            options={{ headerShown: false }}
            name="login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ title: t('registration') }}
            name="registration"
            component={RegistrationScreen}
          />
          <Stack.Screen
            options={{ title: t('forgot-password') }}
            name="forgot-password"
            component={ForgotPasswordScreen}
          />
        </Stack.Group>
      )}

      <Stack.Screen
        name="tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ title: 'Пополнение баланса' }}
        name="top-up-account"
        component={TopUpAccountScreen}
      />
      <Stack.Screen
        options={{ title: t('pay-by-card') }}
        name="adding-card-and-payment"
        component={AddingCardAndPayment}
      />
      <Stack.Screen
        options={{ title: t('filters') }}
        name='filters-of-stations'
        component={FiltersOfStations}
      />
      <Stack.Screen
        options={{ title: '' }}
        name='charging-station'
        component={CharginStationScreen}
      />
      <Stack.Screen
        options={{ title: 'Новый пароль' }}
        name='set-new-password'
        component={SetNewPasswordScreen}
      />
      <Stack.Screen
        options={({ route }) => ({ title: route.params.verify === 'registration' ? '' : 'Восстановление пароля' })}
        name='otp-verify'
        component={OtpVerifyScreen}
      />
      {authState === AuthState.ready && (
        <Stack.Group navigationKey="authorized">
          <Stack.Screen
            options={{ title: t('profile') }}
            name="profile-details"
            component={ProfileDetailsScreen}
          />
          <Stack.Screen
            options={{ title: 'Изменить пароль' }}
            name='change-password'
            component={ChangePasswordScreen}
          />

        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
