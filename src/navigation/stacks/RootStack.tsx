import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthState, useAuth } from '@src/providers/auth';
import AddingCardAndPayment from '@src/screens/AddingCardAndPaymentScreen';
import CharginStationScreen from '@src/screens/CharginStationScreen';
import FiltersOfStations from '@src/screens/FiltersOfStations';
import ForgotPasswordScreen from '@src/screens/ForgotPasswordScreen';
import LoginScreen from '@src/screens/LoginScreen';
import { ProfileDetailsScreen } from '@src/screens/ProfileDetailsScreen';
import RegistrationScreen from '@src/screens/RegistrationScreen';
import ResetPasswordScreen from '@src/screens/ResetPasswordScreen';
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
        </Stack.Group>
      )}

      <Stack.Screen
        name="tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ title: t('forgot-password') }}
        name="forgot-password"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="reset-password"
        component={ResetPasswordScreen}
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
      {authState === AuthState.ready && (
        <Stack.Group navigationKey="authorized">
          <Stack.Screen
            options={{ title: t('profile') }}
            name="profile-details"
            component={ProfileDetailsScreen}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
