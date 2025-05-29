export type SignInReq = { email: string; password: string };

export type SigInResponse = {
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
  firstName: string;
  lastName: string;
  middleName: string;
  roles: ['EXECUTOR'];
  iconUrl: string;
  language: string;
  themeMode: 'LIGHT' | 'DARK';
};
