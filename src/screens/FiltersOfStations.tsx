import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Control, Controller, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, Switch, SwitchProps } from 'react-native';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import GBTIcon from '@assets/svg/connector/GBT.svg';
import Type2Icon from '@assets/svg/connector/Type 2.svg';
import DotBusy from '@assets/svg/dot-busy.svg';
import DotError from '@assets/svg/dot-error.svg';
import lodash from 'lodash';

import { ScreenProps } from '@src/navigation/types';
import {
  defaultState,
  FilterState,
  useFilterStore,
} from '@src/store/useFilterOfStationsStore';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Checkbox, Chip, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';

import { BinanceSlider } from '../widgets/ChargingStationPowerSlider';


export default function FiltersOfStations({
  navigation,
}: ScreenProps<'filters-of-stations'>) {
  const { insets, colors } = useAppTheme();
  const { persisted, applyFilters, resetAll } = useFilterStore();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: persisted,
  });

  const { reset, control, formState, handleSubmit } = form;

  const onSubmit = async (data: FilterState) => {
    try {
      setLoading(true)
      await wait(1000);
      applyFilters(data);
    } catch (error) {
      handleCatchError(error, 'FiltersOfStations onSubmit')
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = async () => {
    try {
      setLoading(true)
      await wait(1000);
      resetAll()
    } catch (error) {
      handleCatchError(error, 'FiltersOfStations resetFilters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reset(persisted);
  }, [persisted, reset]);

  const isEqual = useMemo(() => lodash.isEqual(defaultState, persisted), [persisted])

  return (
    <Box pb={insets.bottom || 19} flex={1}>
      <FormProvider {...form}>
        <ScrollView
          contentContainerStyle={{
            gap: 24,
            paddingBottom: 8,
            paddingHorizontal: 24,
            paddingTop: 8,
          }}>
          <Box gap={4}>
            <Text fontSize={17} fontWeight="600" children="Тип коннектора" />
            <Box>
              {renderSwitch(
                'connectors',
                'ccs',
                'CCS',
                {
                  chip: <Chip children="Быстрая" />,
                  icon: <CCSIcon height={28} width={28} />
                }, control)
              }
              {renderSwitch(
                'connectors',
                'gbt',
                'GB/T',
                {
                  chip: <Chip children="Быстрая" />,
                  icon: <GBTIcon height={28} width={28} />
                },
                control)}
              {renderSwitch(
                'connectors',
                'gbt_ac',
                'GB/T AC',
                { icon: <GBTIcon height={28} width={28} /> }, control)}
              {renderSwitch(
                'connectors',
                'type_2_socket',
                'Type 2 (Socket)',
                { icon: <Type2Icon height={28} width={28} /> }, control)}
              {renderSwitch(
                'connectors',
                'type_2_plug',
                'Type 2 (Plug)',
                { icon: <Type2Icon height={28} width={28} /> }, control)}
            </Box>
            <Controller
              control={control}
              name='hide_disabled'
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  checked={value}
                  children='Скрывать выключенные коннекторы из описания станций'
                  onPress={() => onChange(!value)}
                  wrapperStyle={{ paddingVertical: 18 }}
                />
              )}
            />

          </Box>

          <BinanceSlider />
          <Box gap={4}>
            <Text fontWeight="600" fontSize={17} children="Другие сети" />
            {renderSwitch('networks', 'malanka', 'Malanka', {}, control)}
            {renderSwitch('networks', 'batteryFly', 'BatteryFly', {}, control)}
          </Box>
          <Box gap={4}>
            <Text fontWeight="600" fontSize={17} children="Другое" />
            {renderSwitch('other',
              'busy',
              'Занятые',
              { icon: <DotBusy height={28} width={28} style={shadowStyle} /> },
              control)}
            {renderSwitch('other',
              'broken',
              'Неисправные',
              { icon: <DotError height={28} width={28} style={shadowStyle} /> },
              control)}
          </Box>

          <Button
            type="clear"
            children="Сбросить по умолчанию"
            onPress={resetFilters}
            disabled={isEqual && !formState.isDirty || loading}
          />
        </ScrollView>
      </FormProvider>
      <Button
        wrapperStyle={{ paddingHorizontal: 24 }}
        children="Применить фильтры"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!formState.isDirty || loading}
      />
    </Box>
  );
}

type FilterKeyMap = {
  connectors: keyof FilterState['connectors'];
  networks: keyof FilterState['networks'];
  other: keyof FilterState['other'];
};

function renderSwitch<K extends keyof Omit<FilterState, 'min_power' | 'hide_disabled'>>(
  objectKey: K,
  name: FilterKeyMap[K],
  label: string,
  options: {
    icon?: React.ReactNode;
    chip?: React.ReactNode;
  },
  control: Control<FilterState, any, FilterState>
) {
  return (
    <Controller
      control={control}
      name={`${objectKey}.${name}` as const}
      render={({ field: { value, onChange } }) => (
        <SwitchWithDescription
          icon={options.icon}
          title={label}
          onValueChange={onChange}
          value={value}
        >
          {options.chip}
        </SwitchWithDescription>
      )}
    />
  );
}

type SwitchWithDescriptionProps = SwitchProps &
  PropsWithChildren & {
    icon?: ReactNode | undefined;
    title: string;
  };

const SwitchWithDescription = ({
  icon,
  title,
  value,
  onValueChange,
  disabled,
  children,
}: SwitchWithDescriptionProps) => {
  const { colors } = useAppTheme();

  return (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      minHeight={55}
      borderColor={colors.grey_100}
      style={{ borderBottomWidth: 1 }}>
      <Box row gap={8} alignItems="center">
        {icon}
        <Text children={title} />
        {children}
      </Box>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: colors.main }}
      />
    </Box>
  );
};

const shadowStyle = {
  elevation: 6,
  shadowColor: '#000000',
  shadowOffset: {
    height: 4,
    width: 0,
  },
  shadowOpacity: 0.19,
  shadowRadius: 5.62,
};
