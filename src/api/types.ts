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
  state: string
}
export type SessionsRes = {
  sessions: Session[]
}

export type Location = {
  city: string
  country: string
  id: number
  latitude: number
  longitude: number
  stations: Station[]
  street: string
}

export interface Station {
  charge_box_firmware: string
  charge_box_id: string
  charge_box_model: string
  charge_box_serial: string
  charge_box_vendor: string
  connectors: Connector[]
  id: number
  state: string
}

export interface Connector {
  connector_type: string
  id: number
  location_id: number
  ocpp_id: number
  power: number
  state: string
  station_id: number
}

export type LocationsRes = {
  locations: Location[];
}