import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  ScrollView,
} from 'react-native';
import WalletIcon from '@assets/svg/wallet.svg';
import { useNavigation } from '@react-navigation/native';

import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { wait } from '@src/utils';
import { CharginAccordion } from '@src/widgets/CharginAccrodion';
import { Gallery } from '@src/widgets/Gallery';

interface StationData {
  images: string[];
}

const stationData: StationData = {
  images: [
    'https://thumbs.dreamstime.com/b/vertical-shot-road-magnificent-mountains-under-blue-sky-captured-california-163571053.jpg',
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80',
    'https://images.unsplash.com/photo-1559666126-84f389727b9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1177&q=80',
    'https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1559&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    'https://images.unsplash.com/photo-1462400362591-9ca55235346a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1664&q=80',
    'https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1508163223045-1880bc36e222?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1503424886307-b090341d25d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1431631927486-6603c868ce5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  ],
};
const CharginStationScreen: React.FC<ScreenProps<'charging-station'>> = ({ navigation, route }) => {
  const { insets } = useAppTheme();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = async (): Promise<void> => {
    try {
      setRefreshing(true);
      await wait(500);
    } finally {
      setRefreshing(false);
    }
  };

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
          <Text variant="h1" children="BPS Energy" />
          <Box row gap={6}>
            <Text children="Аранская улица, 11, Минск" />
            <CopyToClipboard value={'Аранская улица, 11, Минск'} message={t('shared.address-copied') + '!'} />
          </Box>
        </Box>

        <Gallery images={stationData.images} />

        <CharginAccordion
          onStartCharging={() => console.log('Charging started!')}
          stations={[
            { id: '1', isAvailable: true, number: '0044' },
            { id: '12', isAvailable: false, number: '0045' },
            { id: '13', isAvailable: true, number: '0046' },
          ]}
          headerData={{
            availableCount: 1,
            power: '50 кВт',
            rate: '0.85 р.',
            totalCount: 2,
            type: 'CCS'
          }}
        />
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
  const { t } = useTranslation();

  if (!user?.wallets[0].value) {
    return (
      <Box backgroundColor={colors.grey_50} row px={16} py={12} gap={16} borderRadius={8} mb={24}>
        <Box flex={1} gap={4}>
          <Text children="Для начала зарядки требуется пополнение баланса." />
          <Box onPress={() => navigation.navigate('top-up-account')}>
            <Text children={t('shared.to-top-up')} colorName="main" />
          </Box>
        </Box>
        <WalletIcon />
      </Box>
    )
  }
}

export default CharginStationScreen;