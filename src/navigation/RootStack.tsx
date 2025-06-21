import React from 'react';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthState, useAuth } from '@src/providers/auth';
import AddingCardAndPayment from '@src/screens/AddingCardAndPaymentScreen';
import ChangePasswordScreen from '@src/screens/ChangePasswordScreen';
import ChangeUserFieldsScreen from '@src/screens/ChangeUserFieldsScreen';
import ChargingHistoryScreen from '@src/screens/ChargingHistoryScreen';
import CharginStationScreen from '@src/screens/CharginStationScreen';
import FiltersOfStationsScreen from '@src/screens/FiltersOfStationsScreen';
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
import { dateFormat } from '@src/utils/date-format';

import { Tabs } from './Tabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { t } = useTranslation('screens');
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
            options={{ title: t('registration-screen.title') }}
            name="registration"
            component={RegistrationScreen}
          />
          <Stack.Screen
            options={{ title: t('forgot-password-screen.title') }}
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
        options={{ title: t('top-up-account-screen.title') }}
        name="top-up-account"
        component={TopUpAccountScreen}
      />
      <Stack.Screen
        options={{ title: t('adding-card-and-payment-screen.title') }}
        name="adding-card-and-payment"
        component={AddingCardAndPayment}
      />
      <Stack.Screen
        options={{ title: t('filters-of-stations-screen.title') }}
        name='filters-of-stations'
        component={FiltersOfStationsScreen}
      />
      <Stack.Screen
        options={{ title: '' }}
        name='charging-station'
        component={CharginStationScreen}
      />
      <Stack.Screen
        options={{ title: t('set-new-password-screen.title') }}
        name='set-new-password'
        component={SetNewPasswordScreen}
      />
      <Stack.Screen
        options={({ route }) => ({
          title: route.params.verify === 'registration' ?
            '' : t('otp-verify-screen.title')
        })}
        name='otp-verify'
        component={OtpVerifyScreen}
      />
      {authState === AuthState.ready && (
        <Stack.Group navigationKey="authorized">
          <Stack.Screen
            options={{ title: t('profile-details-screen.title') }}
            name="profile-details"
            component={ProfileDetailsScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              title: route.params.filed === 'name' ?
                t('profile-details-screen.how-to-address-you') :
                t('profile-details-screen.phone-number')
            })}
            name='change-user-fields'
            component={ChangeUserFieldsScreen}
          />
          <Stack.Screen
            options={{ title: t('change-password-screen.title') }}
            name='change-password'
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            options={{ title: t('charging-history-screen.title') }}
            name='charging-history'
            component={ChargingHistoryScreen}
          />
          <Stack.Screen
            options={{ title: t('recharge-history-screen.title') }}
            name='recharge-history'
            component={RechargeHistoryScreen}
          />
          <Stack.Screen
            options={({ route }) => ({ title: dateFormat('DD.MM.yyyy, HH:mm', route.params.transaction.date) })}
            name='recharge-transaction-detail'
            component={RechargeTransactionDetailScreen}
          />
          <Stack.Screen
            options={{ title: t('notifications-settings-screen.title') }}
            name='notifications-settings'
            component={NotificationsSettingsScreen}
          />
          <Stack.Screen
            options={{ title: t('support-service-screen.title') }}
            name='support-service'
            component={SupportService}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
