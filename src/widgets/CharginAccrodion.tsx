import React, { FC, useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ArrowIcon from '@assets/svg/caret-down.svg';
import CHAdeMOIcon from '@assets/svg/connector/ac.svg';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import GBTACIcon from '@assets/svg/connector/GBT AC.svg';
import GBTIcon from '@assets/svg/connector/GBT.svg';
import Type2Icon from '@assets/svg/connector/Type 2.svg';
import LightningIcon from '@assets/svg/lightning.svg';

import type { Connector, ConnectorType } from '@src/api/types';
import { useTabNavigation } from '@src/hooks/useTabNavigation';
import { checkAuthOrRedirect, useAuth } from '@src/providers/auth';
import chargingService from '@src/service/charging';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Chip, Text } from '@src/ui';
import { AnimatedBox } from '@src/ui/Box';
import { modal } from '@src/ui/Layouts/ModalLayout';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';

import { ContectorNotInsertedModal } from './modals/ContectorNotInsertedModal';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface ChargerHeaderData {
  type: ConnectorType;
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
  const { t } = useTranslation('widgets', { keyPrefix: 'chargin-accordion' });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isOpen.value ? '180deg' : '0deg', { duration: 200 }) }],
  }));

  const renderChargerIcon = useCallback((type: ConnectorType) => {
    switch (type) {
      case 'CCS':
        return (<CCSIcon width={32} height={32} color={colors.text} />)
      case 'GBT':
        return (<GBTIcon width={32} height={32} color={colors.text} />)
      case 'Type2':
        return (<Type2Icon width={32} height={32} color={colors.text} />)
      case 'GBT AC':
        return (<GBTACIcon width={32} height={32} color={colors.text} />)
      case 'CHAdeMO':
        return (<CHAdeMOIcon width={32} height={32} color={colors.text} />)
      default:
        return null
    }
  }, [colors])


  return (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      py={12}
      borderBottomWidth={1}
      borderColor={colors.border}
    >
      <Box row gap={8} alignItems="center">
        {renderChargerIcon(data.type)}
        <Box gap={4}>
          <Box row gap={6} alignItems="center">
            <Text children={data.type} fontSize={17} fontWeight="600" />
            <Text children={`· ${data.power} ${t('kW')}`} colorName="grey_600" fontSize={16} />
          </Box>
          <Chip style={{ paddingHorizontal: 9, paddingVertical: 4 }} >
            <Text>
              <Text children={`${data.rate} BYN`} fontWeight='400' fontSize={12} colorName="grey_800" />
              <Text children={t('kW-h')} fontWeight='400' fontSize={12} colorName="grey_600" />
            </Text>
          </Chip>
        </Box>
      </Box>
      <Box row gap={8} alignItems="center">
        <Text
          children={t('available-count', { total: data.totalCount, available: data.availableCount })}
          fontSize={16}
          fontWeight="600"
          colorName={data.availableCount > 0 ? 'green' : 'grey_400'}
        />
        <AnimatedBox style={arrowStyle}>
          <ArrowIcon
            width={20}
            height={20}
            color={data.availableCount > 0 ? colors.green : colors.grey_400} />
        </AnimatedBox>
      </Box>
    </Box>
  );
};

// Компонент StationList
interface StationListProps {
  connectors: Connector[];
}

const StationList: FC<StationListProps> = ({ connectors }) => {

  // const sortedconnectors = useMemo(() =>
  //   connectors.sort((a) => a.state === 'available' ? 0 : a.state !== 'available' ? -1 : 1)
  //   , [connectors]);
  const [disbledConnectors, setDisbledConnectors] = useState(false);

  return (
    <>
      {connectors?.map((connector, i) => (
        <ConnectorElement
          key={i}
          connector={connector}
          disbledConnectors={disbledConnectors}
          setDisbledConnectors={setDisbledConnectors}
        />
      ))}
    </>
  );
};

type ConnectorElementProps = {
  connector: Connector;
  setDisbledConnectors: React.Dispatch<React.SetStateAction<boolean>>;
  disbledConnectors: boolean
}

const ConnectorElement = ({
  connector,
  disbledConnectors,
  setDisbledConnectors
}: ConnectorElementProps) => {
  const { t } = useTranslation('widgets', { keyPrefix: 'chargin-accordion' });
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const nav = useTabNavigation();
  const { authState } = useAuth();

  const handleStartCharging = async () => {
    if (!checkAuthOrRedirect(authState)) return;
    try {
      setLoading(true);
      setDisbledConnectors(true);
      await chargingService.startSession(connector.id)
      nav.navigateToTab('charging-session')
    } catch (error) {
      modal().setupModal?.({
        element: <ContectorNotInsertedModal />,
        justifyContent: 'center',
        marginHorizontal: 48,
      });
      handleCatchError(error)
    } finally {
      setLoading(false);
      setDisbledConnectors(false);
    }
  }
  const isAvalible = connector.state === 'available' || connector.state === 'preparing';
  return (
    <Box
      key={connector.id}
      row
      justifyContent="space-between"
      alignItems="center"
      py={10}
      borderBottomWidth={1}
      borderColor={colors.grey_100}
    >
      <Box row gap={12} alignItems="center">
        <Text children={`№ ${connector.id}`} fontSize={16} fontWeight="500"
          colorName={isAvalible ? 'grey_800' : 'grey_400'}
        />
        <Text
          children={isAvalible ? t('available') : t('busy')}
          fontSize={14}
          colorName={isAvalible ? 'green' : 'grey_600'}
        />
      </Box>
      {isAvalible && (
        <Button
          children={t('charge-up')}
          onPress={handleStartCharging}
          backgroundColor='green'
          wrapperStyle={{ width: 147 }}
          icon={<LightningIcon color={colors.white} />}
          loading={loading}
          disabled={loading || disbledConnectors}
        />
      )}
    </Box>
  )
}

interface CharginAccordionProps {
  connectors: Connector[];
  headerData: ChargerHeaderData;
}

export const CharginAccordion: FC<CharginAccordionProps> = ({
  connectors,
  headerData,
}) => {
  return (
    <Accordion
      renderHeader={(isOpen) => <ChargerHeader isOpen={isOpen} data={headerData} />}
    >
      <StationList connectors={connectors} />
    </Accordion>
  );
};