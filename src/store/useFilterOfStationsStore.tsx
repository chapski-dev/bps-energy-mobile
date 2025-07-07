/* eslint-disable sort-keys-fix/sort-keys-fix */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@src/utils/mmkv';

interface ConnectorState {
  ccs: boolean;
  gbt: boolean;
  gbt_ac: boolean;
  type_2_socket: boolean;
  type_2_plug: boolean;
}

interface NetworkState {
  malanka: boolean;
  batteryFly: boolean;
}

interface OtherState {
  busy: boolean;
  broken: boolean;
}

export interface FilterState {
  connectors: ConnectorState;
  hide_disabled: boolean;
  min_power: number;
  networks: NetworkState;
  other: OtherState;
}

interface FilterStore {
  persisted: FilterState;
  applyFilters: (value: FilterState) => void;
  resetAll: () => void;
}

export const defaultState: FilterState = {
  connectors: {
    ccs: true,
    gbt: true,
    gbt_ac: true,
    type_2_plug: true,
    type_2_socket: true,
  },
  hide_disabled: false,
  min_power: 0,
  networks: {
    batteryFly: true,
    malanka: true,
  },
  other: {
    broken: true,
    busy: true,
  }
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      persisted: defaultState,
      resetAll: () =>
        set(() => ({
          persisted: defaultState,
        })),
      applyFilters: (filters) =>
        set(() => ({
          persisted: filters,
        })),
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);