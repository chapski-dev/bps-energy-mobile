import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OrderDetails } from '@src/api/types';

export type RootStackParamList = {
  tabs: undefined;
  profile: undefined;
  'profile-data': undefined;
  identity: undefined;
  documents: { carModel: string };
  'technical-passport': undefined;
  'power-of-attorney': undefined;
  'search-for-new-order': undefined;
  'filters-for-orders': undefined;
  'from-where': undefined;
  'transportation-details': OrderDetails;
  'counter-offer': undefined;
  'upload-invoise-for-goods': undefined;
  'invoice-sent': undefined;
  'order-screen': OrderDetails;
  'company-configuration': undefined;
  'bank-details': undefined;
  'contact-details': undefined;
  'order-action-success': { order_number: number, action: 'complite' | 'accept' };
  'damage-to-cargo': undefined;
  'signing-order-details': undefined;
};

export type TabsParamList = {
  map: undefined;
  charging: undefined;
  profile: undefined;
};

export type UnauthorizedStackParamList = {
  launch: undefined;
  intro: undefined;
  login: undefined;
  registration: { step: 'driver_performer_or_invaitetion' | 'residency' };
  'registration-user-data': undefined;
  'otp-verify': {
    action: 'invite' | 'phone-verify' | 'login' | 'registration';
    resident?: boolean;
    phone?: string;
  };
  'pick-country': { handlePick: (val: string) => void };
  'login-via-phone': undefined;
  'settings-profile': undefined;
  'personal-identifier': undefined;
  'registration-finished': undefined;
  'add-drivers-license': undefined;
  'performer-registration': undefined;
  'company-configuration': undefined;
  'bank-details': undefined;
  'contact-details': undefined;
};

export type AllStackParamList = RootStackParamList &
  TabsParamList &
  UnauthorizedStackParamList;

export type AvailableRoutes = keyof AllStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllStackParamList {}
  }
}

export type ScreenProps<Screen extends keyof AllStackParamList> =
  NativeStackScreenProps<AllStackParamList, Screen>;
