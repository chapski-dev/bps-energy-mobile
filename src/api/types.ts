import { Point } from 'react-native-yamap';

export type SignInReq = { email: string; password: string };

export type SignInResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

export type RegistrationReq = {
  email: string;
  password: string;
  phone?: string;
  agree: boolean;
};

export type RegistrationResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

export type NotificationSettings = {
  settings: {
    push_notifications: boolean;
    start_and_end_of_charging: boolean;
    balance_replenished: boolean;
    balance_less_than_3_byn: boolean;
    special_offers: boolean;
  };
};

export type NotificationDetails = {
  loading?: boolean;
};

//* Profile
export type Profile = {
  cards: Card[];
  email: string;
  id: number;
  name: string;
  phone: string;
  registration_date: string;
  wallets: Wallet[];
};

export type Wallet = {
  currency: 'BYN' | 'RUB';
  value: number;
};

export type Card = {
  id: number;
  type: 'visa' | 'mastercard' | 'belcard' | 'maestro' | 'mir';
  mask: string; // последние 4 цифры
};

export type ChangeUserFieldsReq = {
  name: string;
  phone: string;
};


export type Transaction = {
  amount: number,
  card_mask: string,
  card_type: string,
  date: string,
  id: number,
  rest_after: number,
  rest_before: number,
  state: string,
  wallet_type: string
}

export type TransactionsRes = {
  transactions: Transaction[]
}


export type Session = {
  charged: number,
  duration: number,
  id: number,
  power: number,
  soc: number,
  soc_begin: number,
  soc_end: number,
  spent: number,
  state: 'begins' | 'charging' | 'finishing'
}
export type SessionsRes = {
  sessions: Session[]
}

// Базовый тип с обязательными полями
export type BaseLocation = {
  city: string
  connector_group: ConnectorGroup[]
  country: string
  id: number
  owner: string
  point: Point
  street: string
}

// Тип для списка локаций (краткая информация)
export type LocationSummary = BaseLocation

// Тип для детальной информации о локации (расширенная информация)
export type LocationDetails = BaseLocation & {
  images: string[] // теперь обязательное поле в деталях
}


export type ConnectorType =
  | 'CCS'
  | 'GBT'
  | 'Type2'
  | 'GBT AC'
  | 'NACS'
  | 'CHAdeMO'
  | 'Type1'

export interface ConnectorGroup {
  available_count: number
  max_power: number
  min_power: number
  connectors: Connector[]
  price_max: number
  price_min: number
  total_count: number
  type: ConnectorType
}

export type LocationsRes = {
  locations: LocationSummary[];
}

export type LocationDetailsRes = {
  location: LocationDetails;
}

export type ConnectorState =
  | 'available'
  | 'preparing'
  | 'precharge'
  | 'charging'
  | 'finishing'
  | 'unavailable'

export interface Connector {
  id: number
  power: number
  price: number
  state: ConnectorState
}