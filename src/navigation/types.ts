import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  tabs: undefined
  login: undefined
  registration: undefined
  'forgot-password': undefined
  'reset-password': undefined
  'top-up-account'?: { currency: 'RUB' | 'BYN' }
  'adding-card-and-payment': { url: string }
  'profile-details': undefined
  'filters-of-stations': undefined
  'charging-station': undefined
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
  'recharge-transaction-detail': { transaction: any };
  'notifications-settings': undefined;
  'support-service': undefined;
};

export type TabsParamList = {
  map: undefined;
  charging: undefined;
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
