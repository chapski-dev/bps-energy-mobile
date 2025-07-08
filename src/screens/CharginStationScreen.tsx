import React, { useCallback, useState } from 'react';
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
import { checkAuthOrRedirect, useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { getHighAccuracyPosition } from '@src/utils/helpers/get-current-geo-position';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { openYandexMaps } from '@src/utils/helpers/yandex-maps';
import { openTelegram } from '@src/utils/support/openTelegram';
import { CharginAccordion } from '@src/widgets/CharginAccrodion';
import { Gallery } from '@src/widgets/Gallery';

const CharginStationScreen: React.FC<ScreenProps<'charging-station'>> = ({ navigation, route }) => {
  const { insets } = useAppTheme();
  const { t } = useTranslation('screens');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationDetails>(route.params.location)
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


  const openRoute = async () => {
    try {
      setLoading(true);
      const userPoint = await getHighAccuracyPosition()
      openYandexMaps(userPoint, location.point)

    } catch (error) {
      handleCatchError(error, 'CharginStationScreen')
    } finally {
      setLoading(false);
    }
  }

  const handleWriteToSupport = async () => {
    const username = 'Alex_Poleshchuk';
    const message = 'Привет! У меня проблемы со станцией. Помогите';
    openTelegram(username, message)
  };


  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
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
            <CopyToClipboard value={fullAdress} message={t('charging-station-screen.address-copied') + '!'} />
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
        <Button
          children={t('charging-station-screen.give-feedback')}
          type="outline"
          disabled={loading}
          onPress={handleWriteToSupport}
        />
        <Button
          children={t('charging-station-screen.route')}
          onPress={openRoute}
          loading={loading}
          disabled={loading}
        />
      </Box>
    </>
  );
};

const NeedTopUpBalanceBanner = () => {
  const { user, authState } = useAuth()
  const { colors } = useAppTheme()
  const navigation = useNavigation();
  const { t } = useTranslation(['actions', 'screens']);

  const handleTopUpPress = () => {
    if (checkAuthOrRedirect(authState, navigation)) {
      navigation.navigate('top-up-account');
    }
  };

  if (!user?.wallets[0].value) {
    return (
      <Box backgroundColor={colors.grey_50} row px={16} py={12} gap={16} borderRadius={8} mb={24}>
        <Box flex={1} gap={4}>
          <Text children={t('screens:charging-station-screen.need-top-up')} />
          <Box onPress={handleTopUpPress}>
            <Text children={t('actions:to-top-up')} colorName="primary" />
          </Box>
        </Box>
        <WalletIcon color={colors.text} />
      </Box>
    )
  }
}

export default CharginStationScreen;