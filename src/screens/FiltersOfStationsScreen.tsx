import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Control, Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch, SwitchProps } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import GBTACIcon from '@assets/svg/connector/GBT AC.svg';
import GBTIcon from '@assets/svg/connector/GBT.svg';
import Type2PlugIcon from '@assets/svg/connector/Type 2 (Plug).svg'
import Type2SocketIcon from '@assets/svg/connector/Type 2 (Socket).svg';
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
import { vibrate } from '@src/utils/vibrate';

import { ChargingStationPowerSlider } from '../widgets/ChargingStationPowerSlider';


export default function FiltersOfStationsScreen({
  navigation,
}: ScreenProps<'filters-of-stations'>) {
  const { insets } = useAppTheme();
  const { t } = useTranslation('screens', { keyPrefix: 'filters-of-stations-screen' });
  const { persisted, applyFilters, resetAll } = useFilterStore();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: persisted,
  });

  const { reset, control, formState, handleSubmit } = form;

  const isEqual = useMemo(() => lodash.isEqual(defaultState, persisted), [persisted])

  const onSubmit = async (data: FilterState) => {
    try {
      setLoading(true)
      await wait(1000);
      applyFilters(data);
      vibrate(HapticFeedbackTypes.impactMedium)
    } catch (error) {
      handleCatchError(error, 'FiltersOfStations onSubmit')
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = async () => {
    try {
      if(formState.isDirty && isEqual) {
        reset()
      } else {
        setLoading(true)
        await wait(1000);
        resetAll()
      }
      vibrate(HapticFeedbackTypes.impactMedium)
    } catch (error) {
      handleCatchError(error, 'FiltersOfStations resetFilters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reset(persisted);
  }, [persisted, reset]);


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
            <Text fontSize={17} fontWeight="600" children={t('connector-type')} />
            <Box>
              {renderSwitch(
                'connectors',
                'ccs',
                t('connectors.ccs'),
                {
                  chip: <Chip children={t('fast')} />,
                  icon: <CCSIcon height={28} width={28} />
                }, control)
              }
              {renderSwitch(
                'connectors',
                'gbt',
                t('connectors.gbt'),
                {
                  chip: <Chip children={t('fast')} />,
                  icon: <GBTIcon height={28} width={28} />
                },
                control)}
              {renderSwitch(
                'connectors',
                'gbt_ac',
                t('connectors.gbt-ac'),
                { icon: <GBTACIcon height={28} width={28} /> }, control)}
              {renderSwitch(
                'connectors',
                'type_2_socket',
                t('connectors.type-2-socket'),
                { icon: <Type2SocketIcon height={28} width={28} /> }, control)}
              {renderSwitch(
                'connectors',
                'type_2_plug',
                t('connectors.type-2-plug'),
                { icon: <Type2PlugIcon height={28} width={28} /> }, control)}
            </Box>
            <Controller
              control={control}
              name='hide_disabled'
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  checked={value}
                  children={t('hide-disabled')}
                  onPress={() => onChange(!value)}
                  wrapperStyle={{ paddingVertical: 18 }}
                />
              )}
            />

          </Box>

          <ChargingStationPowerSlider />
          <Box gap={4}>
            <Text fontWeight="600" fontSize={17} children={t('other-networks')} />
            {renderSwitch('networks', 'malanka', 'Malanka', {}, control)}
            {renderSwitch('networks', 'batteryFly', 'BatteryFly', {}, control)}
          </Box>
          <Box gap={4}>
            <Text fontWeight="600" fontSize={17} children={t('other')} />
            {renderSwitch('other',
              'busy',
              t('busy'),
              { icon: <DotBusy height={28} width={28} style={shadowStyle} /> },
              control)}
            {renderSwitch('other',
              'broken',
              t('broken'),
              { icon: <DotError height={28} width={28} style={shadowStyle} /> },
              control)}
          </Box>

          <Button
            type="clear"
            children={t('reset-default')}
            onPress={resetFilters}
            disabled={isEqual && !formState.isDirty || loading}
          />
        </ScrollView>
      </FormProvider>
      <Button
        wrapperStyle={{ paddingHorizontal: 24 }}
        children={t('apply-filters')}
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
