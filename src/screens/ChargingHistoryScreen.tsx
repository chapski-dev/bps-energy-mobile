import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { SectionList, StyleSheet } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler';
import Skeleton from 'react-native-reanimated-skeleton'
import MagnifyingIcon from '@assets/svg/magnifying-glass-cross.svg'

import { isIOS } from '@src/misc/platform';
import { ScreenProps } from '@src/navigation/types'
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { ImageProgress } from '@src/ui/ImageProgress';
import { wait } from '@src/utils';
import { parseDate } from '@src/utils/parseDate';
import { chargingsSkeletonLayout } from '@src/utils/vars/skeletons';
import { DatePeriodSelect, initialDates } from '@src/widgets/DatePeriodSelect';


const chargingData = Array.from({ length: 3 }).map((_, i) => (
  {
    data: [
      {
        address: 'Аранская улица, 11, Минск',
        id: 1,
        image: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80',
        name: 'BPS Energy',
        received: '5.85',
        spent: '3.28',
      },
      {
        address: 'пр. Победителей, 84, Минск',
        id: 2,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        name: 'Butterfly',
        received: '7.91',
        spent: '4.85',
      },
    ],
    title: parseDate(new Date()),
  }
))

export default function ChargingHistoryScreen({ navigation }: ScreenProps<'charging-history'>) {
  const { colors } = useAppTheme();
  const [filterDates, setFilterDates] = useState(initialDates)
  const { t } = useTranslation('screens', { keyPrefix: 'charging-history-screen' });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = async (): Promise<void> => {
    try {
      setRefreshing(true);
      await wait(500);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    onRefresh()
  }, [])



  const renderChargingItem = ({ item }) => (
    <Skeleton
      containerStyle={{ backgroundColor: colors.grey_50, borderRadius: 12 }}
      isLoading={refreshing}
      animationType={isIOS ? 'shiver' : 'none'}
      layout={chargingsSkeletonLayout}
      boneColor={colors.border}
    >
      <Box
        backgroundColor={colors.grey_50}
        borderRadius={12}
        row
        p={16}>
        <ImageProgress uri={item.image} style={styles.chargingImage} resizeMode="cover" />
        <Box flex={1} gap={16}>
          <Box gap={4}>
            <Text
              variant='h5'
              children={item.name}
            />
            <Text variant='p3' colorName='grey_700'>{item.address}</Text>
          </Box>

          <Box row justifyContent='space-between'>
            <Box flex={1} gap={4}>
              <Text variant='p3' colorName='grey_700' children={t('received')} />
              <Text variant='h4'>
                {item.received} <Text variant='p4-semibold'>{t('kilowatt-hour')}</Text>
              </Text>
            </Box>

            <Box flex={1} gap={4}>
              <Text variant='p3' colorName='grey_700' children={t('spent')} />
              <Text variant='h4'>
                {item.spent} <Text variant='p4-semibold'>BYN</Text>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Skeleton>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Skeleton
      containerStyle={{ alignItems: 'baseline' }}
      isLoading={refreshing}
      animationType={isIOS ? 'shiver' : 'none'}
      boneColor={colors.grey_50}
      layout={[{ height: 25, width: 120 }]}
    >
      <Box py={8}>
        <Text
          colorName='grey_600'
          variant='p3'
          children={title}
        />
      </Box>
    </Skeleton>
  );

  const renderEmptyComponent = useCallback(() => (
    <Box flex={1} justifyContent='center' alignItems='center' gap={24} >
      <MagnifyingIcon />
      <Box gap={8}>
        <Text center children={t('no-chargings-found')} variant='h5' colorName='grey_600' mb={8} />
        <Text
          children={t('no-chargings-description')}
          variant='p3'
          colorName='grey_600'
          center
        />
      </Box>
      <Button children={t('reset-filters')} type='clear' />
    </Box>
  ), [t])


  return (
    <>
      <Box p={16} >
        <DatePeriodSelect filterDates={filterDates} onSubmit={setFilterDates} />
      </Box>

      <SectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ flexGrow: 1, gap: 8, paddingBottom: 30, paddingHorizontal: 16 }}
        sections={chargingData}
        // sections={[]}
        ItemSeparatorComponent={() => <Box h={5} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChargingItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />
    </>
  )
}

const styles = StyleSheet.create({
  chargingImage: {
    borderRadius: 4,
    height: 64,
    marginRight: 16,
    width: 64,
  },
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersContent: {
    gap: 12,
    paddingHorizontal: 16
  },
})