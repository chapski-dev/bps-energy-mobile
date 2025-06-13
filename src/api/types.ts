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
  amount: string;
  created_at: number;
  from: string;
  status: string;
  to: string;
  tx: any;
  tx_hash: string;
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
