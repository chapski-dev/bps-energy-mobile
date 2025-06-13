import React from 'react';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthState, useAuth } from '@src/providers/auth';
import AddingCardAndPayment from '@src/screens/AddingCardAndPaymentScreen';
import ChangePasswordScreen from '@src/screens/ChangePasswordScreen';
import ChangeUserFieldsScreen from '@src/screens/ChangeUserFieldsScreen';
import ChargingHistoryScreen from '@src/screens/ChargingHistoryScreen';
import CharginStationScreen from '@src/screens/CharginStationScreen';
import FiltersOfStations from '@src/screens/FiltersOfStations';
import ForgotPasswordScreen from '@src/screens/ForgotPasswordScreen';
import LoginScreen from '@src/screens/LoginScreen';
import NotificationsSettingsScreen from '@src/screens/NotificationsSettingsScreen';
import OtpVerifyScreen from '@src/screens/OtpVerifyScreen';
import { ProfileDetailsScreen } from '@src/screens/ProfileDetailsScreen';
import RechargeHistoryScreen from '@src/screens/RechargeHistoryScreen';
import RechargeTransactionDetailScreen from '@src/screens/RechargeTransactionDetailScreen';
import RegistrationScreen from '@src/screens/RegistrationScreen';
import SetNewPasswordScreen from '@src/screens/SetNewPasswordScreen';
import SupportService from '@src/screens/SupportServiceScreen';
import TopUpAccountScreen from '@src/screens/TopUpAccountScreen';
import { useAppTheme } from '@src/theme/theme';

import { Tabs } from './Tabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { t } = useTranslation();
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
        options={{ title: 'Пополнить баланс' }}
        name="top-up-account"
        component={TopUpAccountScreen}
      />
      <Stack.Screen
        options={{ title: 'Пополнить баланс' }}
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
        options={({ route }) => ({
          title: route.params.verify === 'registration' ?
            '' : 'Восстановление пароля'
        })}
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
            options={({ route }) => ({
              title: route.params.filed === 'name' ?
                'Как к вам обращаться?' : 'Номер телефона'
            })}
            name='change-user-fields'
            component={ChangeUserFieldsScreen}
          />
          <Stack.Screen
            options={{ title: 'Изменить пароль' }}
            name='change-password'
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            options={{ title: 'История зарядок' }}
            name='charging-history'
            component={ChargingHistoryScreen}
          />
          <Stack.Screen
            options={{ title: 'История пополнений' }}
            name='recharge-history'
            component={RechargeHistoryScreen}
          />
          <Stack.Screen
            options={({ route }) => ({ title: route.params.transaction.date })}
            name='recharge-transaction-detail'
            component={RechargeTransactionDetailScreen}
          />
          <Stack.Screen
            options={{ title: 'Уведомления' }}
            name='notifications-settings'
            component={NotificationsSettingsScreen}
          />
          <Stack.Screen
            options={{ title: 'Служба поддержки' }}
            name='support-service'
            component={SupportService}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
