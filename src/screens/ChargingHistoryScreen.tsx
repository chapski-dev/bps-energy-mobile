import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { SectionList, StyleSheet } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler';
import Skeleton from 'react-native-reanimated-skeleton'
import MagnifyingIcon from '@assets/svg/magnifying-glass-cross.svg'

import { getFinishedChargingSessions } from '@src/api';
import { FinishedSession } from '@src/api/types';
import { isIOS } from '@src/misc/platform';
import type { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { ImageProgress } from '@src/ui/ImageProgress';
import { wait } from '@src/utils';
import { dateFormat } from '@src/utils/date-format';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { parseDate } from '@src/utils/parseDate';
import { chargingsSkeletonLayout } from '@src/utils/vars/skeletons';
import { DatePeriodSelect, initialDates } from '@src/widgets/DatePeriodSelect';

// Тип для секции SectionList
interface SectionData {
  title: string;
  data: FinishedSession[];
}

// Моки для скелетонов
const mockSessions: FinishedSession[] = Array.from({ length: 6 }).map((_, i) => ({
  begin: `2025-06-0${(i % 3) + 1}T10:00:00Z`,
  charged_energy: 5 + i,
  connector_id: 1,
  connector_power: 22,
  connector_type: 'Type2',
  current: 32,
  email: '',
  end: `2025-06-0${(i % 3) + 1}T11:00:00Z`,
  id: i,
  location_city: 'Минск',
  location_country: 'BY',
  location_id: 1,
  location_street: i % 2 === 0 ? 'Аранская улица, 11' : 'пр. Победителей, 84',
  percent_limit: 80,
  power: 22,
  price_limit: 0,
  price_per_kwh: 0.5,
  soc: 0,
  soc_begin: 20,
  soc_end: 80,
  station_id: 1,
  station_serial: 'BPS-001',
  total_price: 3.28 + i,
  voltage: 220,
}));

// Группировка сессий по дате (YYYY-MM-DD)
function groupSessionsByDate(sessions: FinishedSession[], locale: string): SectionData[] {
  const grouped: Record<string, FinishedSession[]> = {};
  sessions.forEach((session) => {
    const dateKey = parseDate(session.begin, 'dateOnlyLong', false, locale);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(session);
  });
  return Object.entries(grouped).map(([title, data]) => ({ data, title }));
}

export default function ChargingHistoryScreen({ navigation }: ScreenProps<'charging-history'>) {
  const { colors } = useAppTheme();
  const [filterDates, setFilterDates] = useState(initialDates)
  const { t, i18n } = useTranslation('screens', { keyPrefix: 'charging-history-screen' });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sectionsData, setSectionsData] = useState<SectionData[]>(groupSessionsByDate(mockSessions, i18n.language));

  const onRefresh = useCallback(async (): Promise<void> => {
    try {
      setRefreshing(true);
      await wait(1000)
      const res = await getFinishedChargingSessions({
        date_begin: dateFormat('yyyy-MM-DD', filterDates.start),
        date_end: dateFormat('yyyy-MM-DD', filterDates.end),
      });
      
      setSectionsData(groupSessionsByDate(res.sessions, i18n.language));
    } catch (error) {
      setSectionsData([]);
      handleCatchError(error);
    } finally {
      setRefreshing(false);
    }
  }, [filterDates.start, filterDates.end, i18n.language]);

  useEffect(() => {
    onRefresh()
  }, [onRefresh])

  const renderChargingItem = ({ item }: { item: FinishedSession }) => (
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
        p={16}
        onPress={() => navigation.navigate('charging-details', { session: item })}
      >
        <ImageProgress uri={item.location_photo_url} style={styles.chargingImage} resizeMode="cover" />
        <Box flex={1} gap={16}>
          <Box gap={4}>
            <Text
              variant='h5'
              children={item.owner || 'BPS Energy'}
            />
            <Text variant='p3' colorName='grey_700'>{item.location_street}, {item.location_city}</Text>
          </Box>

          <Box row justifyContent='space-between'>
            <Box flex={1} gap={4}>
              <Text variant='p3' colorName='grey_700' children={t('received')} />
              <Text variant='h4'>
                {item.charged_energy} <Text variant='p4-semibold'>{t('kilowatt-hour')}</Text>
              </Text>
            </Box>

            <Box flex={1} gap={4}>
              <Text variant='p3' colorName='grey_700' children={t('spent')} />
              <Text variant='h4'>
                {item.total_price} <Text variant='p4-semibold'>BYN</Text>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Skeleton>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Skeleton
      containerStyle={{ alignItems: 'baseline' }}
      isLoading={refreshing}
      animationType={isIOS ? 'shiver' : 'none'}
      boneColor={colors.grey_50}
      layout={[{ height: 28, marginBottom: 8, width: 120 }]}
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
      <Button children={t('reset-filters')} type='clear' onPress={() => setFilterDates(initialDates)} />
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
        sections={sectionsData}
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