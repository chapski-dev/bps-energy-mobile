import React, { FC, useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ArrowIcon from '@assets/svg/caret-down.svg';
import CCSIcon from '@assets/svg/connector/CCS.svg';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Chip, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';

import { ContectorNotInsertedModal } from './ContectorNotInsertedModal';

type ChargerType = 'CCS' | 'CHAdeMO' | 'Type 2';

interface ChargingStation {
  id: string;
  number: string;
  isAvailable: boolean;
}

interface ChargerHeaderData {
  type: ChargerType;
  power: string;
  rate: string;
  availableCount: number;
  totalCount: number;
}

interface AccordionProps {
  renderHeader: (isOpen: SharedValue<boolean>) => React.ReactNode;
  children: React.ReactNode;
}

const Accordion: FC<AccordionProps> = ({ renderHeader, children }) => {
  const isOpen = useSharedValue(false);

  const toggleOpen = useCallback(() => {
    isOpen.value = !isOpen.value;
  }, [isOpen]);

  return (
    <Box>
      <TouchableOpacity onPress={toggleOpen} accessibilityRole="button">
        {renderHeader(isOpen)}
      </TouchableOpacity>
      <AnimatedContent isExpanded={isOpen}>{children}</AnimatedContent>
    </Box>
  );
};

interface AnimatedContentProps {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
}

const AnimatedContent: FC<AnimatedContentProps> = ({ isExpanded, children }) => {
  const height = useSharedValue(0);
  const derivedHeight = useDerivedValue(() =>
    withTiming(isExpanded.value ? height.value : 0, { duration: 300 })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={bodyStyle}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={{ position: 'absolute', width: '100%' }}
      >
        {children}
      </View>
    </Animated.View>
  );
};

interface ChargerHeaderProps {
  isOpen: SharedValue<boolean>;
  data: ChargerHeaderData;
}

const ChargerHeader: FC<ChargerHeaderProps> = ({ isOpen, data }) => {
  const { colors } = useAppTheme();

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isOpen.value ? '180deg' : '0deg', { duration: 200 }) }],
  }));

  const getChargerIcon = (type: ChargerType) => {
    switch (type) {
      case 'CCS':
        return <CCSIcon width={32} height={32} />;
      default:
        return null;
    }
  };

  return (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      py={12}
      borderBottomWidth={1}
      borderColor={colors.grey_200}
    >
      <Box row gap={8} alignItems="center">
        {getChargerIcon(data.type)}
        <Box gap={4}>
          <Box row gap={6} alignItems="center">
            <Text children={data.type} fontSize={17} fontWeight="600" />
            <Text children={`· ${data.power}`} colorName="grey_600" fontSize={16} />
          </Box>
          <Chip style={{ paddingHorizontal: 9, paddingVertical: 4 }} >
            <Text>
              <Text children={`${data.rate}`} fontWeight='400' fontSize={12} colorName="grey_800" />
              <Text children=" / кВт·ч" fontWeight='400' fontSize={12} colorName="grey_600" />
            </Text>
          </Chip>
        </Box>
      </Box>
      <Box row gap={8} alignItems="center">
        <Text
          children={`Доступно ${data.availableCount}/${data.totalCount}`}
          fontSize={16}
          fontWeight="600"
          colorName={data.availableCount > 0 ? 'green' : 'red_500'}
        />
        <Animated.View style={arrowStyle}>
          <ArrowIcon width={20} height={20} fill={colors.grey_600} />
        </Animated.View>
      </Box>
    </Box>
  );
};

// Компонент StationList
interface StationListProps {
  stations: ChargingStation[];
  onStartCharging: (stationId: string) => void;
}

const StationList: FC<StationListProps> = ({ stations, onStartCharging }) => {
  const { colors } = useAppTheme();

  const handlePress = useCallback(
    (stationId: string) => {
      modal().setupModal?.({
        element: <ContectorNotInsertedModal />,
        justifyContent: 'center',
        marginHorizontal: 48,
      });
      onStartCharging(stationId);
    },
    [onStartCharging]
  );

  const sortedStations = useMemo(() =>
    [...stations].sort((a, b) => a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1)
    , [stations]);

  return (
    <Box>
      {sortedStations.map((station) => (
        <Box
          key={station.id}
          row
          justifyContent="space-between"
          alignItems="center"
          py={10}
          borderBottomWidth={1}
          borderColor={colors.grey_100}
        >
          <Box row gap={12} alignItems="center">
            <Text children={`№ ${station.number}`} fontSize={16} fontWeight="500"
              colorName={station.isAvailable ? 'grey_800' : 'grey_400'}
            />
            <Text
              children={station.isAvailable ? 'Доступен' : 'Занят'}
              fontSize={14}
              colorName={station.isAvailable ? 'green' : 'grey_600'}
            />
          </Box>
          {station.isAvailable && (
            <Button
              children="Заряжаться"
              onPress={() => handlePress(station.id)}
              backgroundColor='green'
              wrapperStyle={{ width: 147 }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

interface CharginAccordionProps {
  stations: ChargingStation[];
  headerData: ChargerHeaderData;
  onStartCharging: (stationId: string) => void;
}

export const CharginAccordion: FC<CharginAccordionProps> = ({
  stations,
  headerData,
  onStartCharging,
}) => {
  return (
    <Accordion
      renderHeader={(isOpen) => <ChargerHeader isOpen={isOpen} data={headerData} />}
    >
      <StationList stations={stations} onStartCharging={onStartCharging} />
    </Accordion>
  );
};