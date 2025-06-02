import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
  tabs: undefined
  login: undefined
  registration: undefined
  'forgot-password': undefined
  'reset-password': undefined
  'top-up-account': undefined
  'adding-card-and-payment': { sum: string | number }
  'profile-details': undefined
  'filters-of-stations': undefined
  'charging-station': undefined
};

export type TabsParamList = {
  map: undefined;
  charging: undefined;
  profile: undefined;
};

export type AllStackParamList = RootStackParamList &
  TabsParamList;

export type AvailableRoutes = keyof AllStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllStackParamList { }
  }
}

export type ScreenProps<Screen extends keyof AllStackParamList> =
  NativeStackScreenProps<AllStackParamList, Screen>;
