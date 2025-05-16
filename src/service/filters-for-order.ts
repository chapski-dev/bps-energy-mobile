import { create } from 'zustand';

// Определяем типы для состояния фильтров
interface FiltersState {
  fawj7: boolean;
  ftl_transportations: boolean;
  gaz_2310_sobol: boolean;
  ltl_transportations: boolean;
  sany_syz_320: boolean;
  board: boolean;
  building_materials: boolean;
  bulk_materials: boolean;
  cargo_weight_from: string;
  cargo_weight_to: string;
  city_transportations: boolean;
  container: boolean;
  delivery_price_from: string;
  delivery_price_to: string;
  food_products: boolean;
  household_appliances: boolean;
  industrial: boolean;
  isotherm: boolean;
  lateral: boolean;
  load_capacity_from: string;
  load_capacity_to: string;
  manual: boolean;
  rear: boolean;
  refrigerator: boolean;
  route_from: string;
  route_to: string;
  tent: boolean;
  upper: boolean;
  setFilter: (filter: Partial<FiltersState>) => void;
  resetFilters: () => void;
}

// Начальное состояние
const initialFiltersState = {
  board: false,
  building_materials: false,
  bulk_materials: false,
  cargo_weight_from: '',
  cargo_weight_to: '',
  city_transportations: false,
  container: false,
  delivery_price_from: '',
  delivery_price_to: '',
  fawj7: false,
  food_products: false,
  ftl_transportations: false,
  gaz_2310_sobol: false,
  household_appliances: false,
  industrial: false,
  isotherm: false,
  lateral: false,
  load_capacity_from: '',
  load_capacity_to: '',
  ltl_transportations: false,
  manual: false,
  rear: false,
  refrigerator: false,
  route_from: '',
  route_to: '',
  sany_syz_320: false,
  tent: false,
  upper: false,
};

// Создаем хранилище Zustand
export const useFiltersForOrdersStore = create<FiltersState>((set) => ({
  ...initialFiltersState,
  resetFilters: () => set(initialFiltersState),
  setFilter: (filter) => set((state) => ({ ...state, ...filter })),
}));
