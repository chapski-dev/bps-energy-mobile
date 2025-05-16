/* eslint-disable sort-keys-fix/sort-keys-fix */
import { create } from 'zustand';

import {
  OrderDetails,
  TransportationCargoInfoResponse,
  TransportationMainInfoResponse,
  TransportationStatusEnum
} from '@src/api/types';
import { RouteObjectType } from '@src/screens/TransportationsDetailsScreen';
import { DriverStatusEnum } from '@src/types/order';

interface ITransportationOrderState extends OrderDetails {
  setOrderStatus: (status: TransportationStatusEnum) => void;
  setDriverStatus: (status: DriverStatusEnum) => void;
  setRoute: (route: RouteObjectType[]) => void;
}

const initialMainInfo: TransportationMainInfoResponse = {
  status: TransportationStatusEnum.WAITING_DRIVER_CONFIRMATION,
  id: 0,
  contact: {
    id: 0,
    name: '',
    email: '',
    phoneNumber: ''
  },
  cargoName: '',
  cargoType: { id: 0, nameKk: '', nameRu: '' },
  tareType: { id: 0, nameKk: '', nameRu: '' },
  cargoPrice: 0,
  cargoPriceCurrency: { code: 'KZT', nameKk: 'Теңге', nameRu: 'Тенге' },
  cargoWeight: 0,
  cargoWeightUnit: {
    code: 'TONS',
    nameRu: '',
    nameKk: ''
  },
  cargoVolume: 0,
  vehicleBodyType: { id: 0, nameKk: '', nameRu: '' },
  capacityValue: { id: 0, capacityValue: 0 },
  capacityUnit: 'TONS',
  additionalInfo: ''
};

const initialCargoInfo: TransportationCargoInfoResponse = {
  vehicleBodyType: { id: 0, nameKk: '', nameRu: '' },
  cargoLoadings: []
};

const initialState: OrderDetails = {
  transportationMainInfoResponse: initialMainInfo,
  transportationCargoInfoResponse: initialCargoInfo,
  hasAlreadyApplied: false
};

const useTransportationStore = create<ITransportationOrderState>((set) => ({
  ...initialState,
  ...STATE_MOCK,

  // setTransportation:

  setOrderStatus: (status: TransportationStatusEnum) =>
    set((state) => ({ ...state, order_status: status })),

  setDriverStatus: (status: DriverStatusEnum) =>
    set((state) => ({ ...state, driver_status: status })),

  setRoute: (route: RouteObjectType[]) => set((state) => ({ ...state, route }))
}));

export default useTransportationStore;

export const STATE_MOCK: OrderDetails = {
  transportationMainInfoResponse: {
    status: TransportationStatusEnum.WAITING_DRIVER_CONFIRMATION,
    id: 15_020_342,
    contact: {
      id: 1,
      name: 'User name',
      email: 'user@mail.com',
      phoneNumber: '+7 777 77 77 77'
    },
    cargoName: 'Медицинское оборудование',
    cargoType: {
      id: 1,
      nameKk: '',
      nameRu: 'Деревянный короб'
    },
    tareType: {
      id: 2,
      nameKk: '',
      nameRu: 'Продукты питания'
    },
    cargoPrice: 0,
    cargoPriceCurrency: {
      code: 'KZT',
      nameKk: 'Теңге',
      nameRu: 'Тенге'
    },
    cargoWeight: 15,
    cargoWeightUnit: {
      code: 'TONS',
      nameKk: '',
      nameRu: ''
    },
    cargoVolume: 3000,
    vehicleBodyType: {
      id: 3,
      nameKk: '',
      nameRu: 'Ручной'
    },
    capacityValue: {
      id: 1,
      capacityValue: 15
    },
    capacityUnit: 'TONS',
    additionalInfo: 'Транспортные средства, используемые для перевозки продуктов'
  },
  transportationCargoInfoResponse: {
    vehicleBodyType: {
      id: 3,
      nameKk: '',
      nameRu: 'Ручной'
    },
    cargoLoadings: [
      {
        id: 1,
        loadingType: { code: 'LOADING', nameKk: '', nameRu: '' },
        orderNum: 1,
        binShipper: '',
        loadingDateTime: '2024-07-18T15:40:00Z',
        address: 'г. Алматы, улица Желтоксан, 12А',
        commentary: '',
        weight: 10,
        weightUnit: {
          code: 'TONS',
          nameKk: 'Тонны',
          nameRu: 'Тонны'
        },
        volume: 2000,
        loadingMethod: {
          id: 4,
          nameKk: '',
          nameRu: 'Ручной'
        },
        loadingOperation: {
          id: 5,
          nameKk: '',
          nameRu: 'Стандартная операция'
        },
        loadingTimeHours: 1,
        contactNumber: '+7 777 77 77 77',
        contactName: 'Анна',
        point: {
          lat: 0,
          lon: 0
        },
        isActive: false,
        isDriverAtLocation: false
      },
      {
        id: 2,
        loadingType: { code: 'LOADING', nameKk: '', nameRu: '' },
        orderNum: 2,
        binShipper: '',
        loadingDateTime: '2024-07-20T15:40:00Z',
        address: 'г. Астана, улица Пушкина, 10',
        commentary: '',
        weight: 5,
        weightUnit: {
          code: 'TONS',
          nameKk: 'Тонны',
          nameRu: 'Тонны'
        },
        volume: 500,
        loadingMethod: {
          id: 4,
          nameKk: '',
          nameRu: 'Ручной'
        },
        point: {
          lat: 0,
          lon: 0
        },
        isActive: false,
        isDriverAtLocation: false,
        loadingOperation: {
          id: 5,
          nameKk: '',
          nameRu: 'Стандартная операция'
        },
        loadingTimeHours: 1,
        contactNumber: '+7 777 77 77 77',
        contactName: 'Анна'
      },
      {
        id: 3,
        loadingType: { code: 'LOADING', nameKk: '', nameRu: '' },
        orderNum: 3,
        binShipper: '',
        loadingDateTime: '2024-07-25T15:40:00Z',
        address: 'г. Москва, улица Ленина, 10',

        commentary: '',
        weight: 2,
        weightUnit: {
          code: 'TONS',
          nameKk: 'Тонны',
          nameRu: 'Тонны'
        },
        volume: 300,
        loadingMethod: {
          id: 4,
          nameKk: '',
          nameRu: 'Ручной'
        },
        point: {
          lat: 0,
          lon: 0
        },
        isActive: false,
        isDriverAtLocation: false,
        loadingOperation: {
          id: 5,
          nameKk: '',
          nameRu: 'Стандартная операция'
        },
        loadingTimeHours: 1,
        contactNumber: '+7 777 77 77 77',
        contactName: 'Анна'
      }
    ]
  },
  hasAlreadyApplied: false
};
