export type SignInReq = { email: string; password: string };

export type SignInResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

export type RegistrationReq = { email: string; password: string; phone?: string; agree: boolean };

export type RegistrationResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};


export type NotificationSettings = {
  settings: {
    push_notifications: boolean;
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
  email: string,
  id: number,
  name: string,
  phone_by: string,
  phone_ru: string,
  registration_date: string
}

export type UserBalance = {
  value_by: number;
  value_ru: number ;
}

export type ChangeUserFieldsReq = {
  field: 'Name' | 'PhoneBY' | 'PhoneRU';
  value: string;
}