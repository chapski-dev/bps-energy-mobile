import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  ScrollView,
} from 'react-native';
import WalletIcon from '@assets/svg/wallet.svg';
import { useNavigation } from '@react-navigation/native';

import { getLocationDetails } from '@src/api';
import { LocationDetails } from '@src/api/types';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { CharginAccordion } from '@src/widgets/CharginAccrodion';
import { Gallery } from '@src/widgets/Gallery';

const CharginStationScreen: React.FC<ScreenProps<'charging-station'>> = ({ navigation, route }) => {
  const { insets } = useAppTheme();
  const { t } = useTranslation();

  const [location, setLocation] = useState<LocationDetails>({ ...route.params.location, images: [] })
  const fullAdress = `${route.params.location?.street}, ${route.params.location?.city}`
  
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async (): Promise<void> => {
    try {
      setRefreshing(true);
      const res = await getLocationDetails(route.params.location.id);
      setLocation(res.location)
    } finally {
      setRefreshing(false);
    }
  }, [route.params.location.id]);

  useEffect(() => {
    onRefresh()
  }, [onRefresh])
  
  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 15,
          paddingHorizontal: 16,
          paddingTop: 22
        }}
      >
        <NeedTopUpBalanceBanner />
        <Box mb={16}>
          <Text variant="h1" children={route.params.location.owner} />
          <Box row gap={6}>
            <Text children={fullAdress} />
            <CopyToClipboard value={fullAdress} message={t('address-copied') + '!'} />
          </Box>
        </Box>

        <Gallery images={location?.images || []} />
        {location.connector_group.map((el, i) => (
          <CharginAccordion
            key={i}
            connectors={el.connectors}
            headerData={{
              availableCount: el.available_count,
              power: el.min_power,
              rate: el.price_min,
              totalCount: el.total_count,
              type: el.type
            }}
          />
        ))}
      </ScrollView>
      <Box px={16} pb={insets.bottom + 15} gap={12}>
        <Button children={t('give-feedback')} type="outline" />
        <Button children="3.7 км, ~14 мин" />
      </Box>
    </>
  );
};

const NeedTopUpBalanceBanner = () => {
  const { user } = useAuth()
  const { colors } = useAppTheme()
  const navigation = useNavigation();
  const { t } = useTranslation(['actions']);

  if (!user?.wallets[0].value) {
    return (
      <Box backgroundColor={colors.grey_50} row px={16} py={12} gap={16} borderRadius={8} mb={24}>
        <Box flex={1} gap={4}>
          <Text children="Для начала зарядки требуется пополнение баланса." />
          <Box onPress={() => navigation.navigate('top-up-account')}>
            <Text children={t('actions:to-top-up')} colorName="main" />
          </Box>
        </Box>
        <WalletIcon />
      </Box>
    )
  }
}

export default CharginStationScreen;