import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { LocationSummary, Transaction } from '@src/api/types';

export type RootStackParamList = {
  tabs: NavigatorScreenParams<TabsParamList>;
  login: undefined
  registration: undefined
  'forgot-password': undefined
  'top-up-account'?: { currency: 'RUB' | 'BYN' }
  'adding-card-and-payment': { url: string }
  'profile-details': undefined
  'filters-of-stations': undefined
  'charging-station': { location: LocationSummary }
  'otp-verify': {
    verify: 'registration' | 'reset-password'
    email: string
    password?: string
  };
  'set-new-password': { email: string; otp: string };
  'change-password': undefined;
  'change-user-fields': { filed: 'name' | 'phone' };
  'charging-history': undefined;
  'charging-details': undefined;
  'recharge-history': undefined;
  'recharge-transaction-detail': { transaction: Transaction };
  'notifications-settings': undefined;
  'support-service': undefined;
  'error-tests': undefined;
};

export type TabsParamList = {
  map: undefined;
  'charging-session': undefined;
  profile: undefined;
};

export type AllStackParamList = RootStackParamList & TabsParamList;

export type AvailableRoutes = keyof AllStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllStackParamList {}
  }
}

export type ScreenProps<Screen extends keyof AllStackParamList> =
  NativeStackScreenProps<AllStackParamList, Screen>;
