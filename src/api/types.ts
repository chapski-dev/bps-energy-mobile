import { Point } from 'react-native-yamap';

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

export type DriverOrderRequest = {
  page?: number;
  size?: number;
  sort?: string[];
};

export type DriverOrderResponse<T> = {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  pageable: Pageable;
  sort: Sort;
  totalElements: number;
  totalPages: number;
};

interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

//* OrderDetails - start -
export type OrderDetails = {
  transportationMainInfoResponse: TransportationMainInfoResponse;
  transportationCargoInfoResponse: TransportationCargoInfoResponse;
  hasAlreadyApplied: boolean;
};

export type ComplitedOrderDetails = {
  cargoName: string;
  dateBegin: string //'2025-03-09';
  dateEnd: string //'2025-04-02';
  id: number;
  number: string;
};

export interface TransportationMainInfoResponse {
  status: TransportationStatusEnum;
  id: number;
  contact: CustomerEmployee;
  cargoName: string;
  cargoType: Dictionary;
  tareType: Dictionary;
  cargoPrice: number;
  cargoPriceCurrency: Currency;
  cargoWeight: number;
  cargoWeightUnit: {
    code: WeightUnit;
    nameKk: string;
    nameRu: string;
  };
  cargoVolume: number;
  vehicleBodyType: Dictionary;
  capacityValue: CapacityValue;
  capacityUnit: CapacityUnit;
  additionalInfo: string;
}

export interface TransportationCargoInfoResponse {
  vehicleBodyType: Dictionary;
  cargoLoadings: CargoLoadings[];
}

export interface CargoLoadings {
  id: number;
  loadingType: {
    code: LoadingType;
    nameKk: string;
    nameRu: string;
  };
  orderNum: number;
  binShipper: string;
  loadingDateTime: string; // ISO 8601 format
  address: string;
  point: Point;
  commentary: string;
  weight: number;
  weightUnit: {
    code: WeightUnit;
    nameKk: string;
    nameRu: string;
  };
  volume: number;
  loadingMethod: Dictionary;
  loadingOperation: Dictionary;
  loadingTimeHours: number;
  contactNumber: string;
  contactName: string;
  isActive: boolean;
  isDriverAtLocation: boolean;
}

export enum TransportationStatusEnum {
  FORMING = 'FORMING',
  CREATED = 'CREATED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  SIGNED_CUSTOMER = 'SIGNED_CUSTOMER',
  WAITING_DRIVER_RESPONSE = 'WAITING_DRIVER_RESPONSE',
  /** Новый заказ */
  WAITING_DRIVER_CONFIRMATION = 'WAITING_DRIVER_CONFIRMATION',
  /** Вы подтвердили свое участие */
  DRIVER_ACCEPTED = 'DRIVER_ACCEPTED',
  /** В пути  */
  ON_THE_WAY = 'ON_THE_WAY',
  /** Рейс завершен */
  FINISHED = 'FINISHED',
  ACCEPTED = 'ACCEPTED'
}
export type CustomerEmployee = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};
export type Dictionary = {
  id: number;
  nameKk: string;
  nameRu: string;
};
export type Currency = {
  code: string;
  nameKk: string;
  nameRu: string;
};
export type WeightUnit = 'TONS';
export type CapacityValue = {
  id: number;
  capacityValue: number;
};
export type CapacityUnit = 'TONS';
export type LoadingType = 'LOADING' | 'UNLOADING';

//* OrderDetails - end -

export type DriverOrderAcceptOrDecline = {
  status: string;
  id: number;
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
