import React, { useEffect, useState } from 'react'
import { ScrollView, SectionList, StyleSheet } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler';
import Skeleton from 'react-native-reanimated-skeleton'

import { isIOS } from '@src/misc/platform';
import { ScreenProps } from '@src/navigation/types'
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui'
import { ImageProgress } from '@src/ui/ImageProgress';
import { wait } from '@src/utils';
import { chargingsSkeletonLayout } from '@src/utils/vars/skeletons';


const chargingData = [
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
    title: '7 июня, суббота',
  },
  {
    data: [
      {
        address: 'ул. Сурганова, 57Б, Минск',
        id: 3,
        image: 'https://thumbs.dreamstime.com/b/vertical-shot-road-magnificent-mountains-under-blue-sky-captured-california-163571053.jpg',
        name: 'BPS Energy',
        received: '4.92',
        spent: '2.69',
      },
    ],
    title: '3 июня, вторник',
  },
  {
    data: [
      {
        address: 'ул. Притыцкого, 156, Минск',
        id: 4,
        image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        name: 'Malanka',
        received: '5.36',
        spent: '3.26',
      },
    ],
    title: '1 июня, воскресенье',
  },
];

export default function ChargingHistoryScreen({ navigation }: ScreenProps<'charging-history'>) {
  const [selectedFilter, setSelectedFilter] = useState('Все');
  const { colors } = useAppTheme();

  const filters = ['Все', 'BPS Energy', 'Butterfly', 'Malanka'];
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


  const filteredData = selectedFilter === 'Все'
    ? chargingData
    : chargingData.map(section => ({
      ...section,
      data: section.data.filter(item => item.name === selectedFilter)
    })).filter(section => section.data.length > 0);

  const renderFilterItem = (filter) => (
    <Box
      key={filter}
      backgroundColor={selectedFilter === filter ? colors.grey_800 : colors.grey_50}
      borderRadius={50}
      p={15.5}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text colorName={selectedFilter === filter ? 'white' : 'grey_800'} children={filter} variant='p3-semibold' />
    </Box>
  );

  const renderChargingItem = ({ item }) => (
    <Skeleton
      containerStyle={{ backgroundColor: colors.grey_50, borderRadius: 12 }}
      isLoading={refreshing}
      animationType={isIOS ? 'pulse' : 'none'}
      layout={chargingsSkeletonLayout}
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
              <Text variant='p3' colorName='grey_700' children="Получено" />
              <Text variant='h4'>
                {item.received} <Text variant='p4-semibold'>кВт·ч</Text>
              </Text>
            </Box>

            <Box flex={1} gap={4}>
              <Text variant='p3' colorName='grey_700' children="Потрачено" />
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
    <Box py={8}>
      <Text
        colorName='grey_600'
        variant='p3'
        children={title}
      />
    </Box>
  );


  return (
    <Box flex={1}>
      <Box>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(renderFilterItem)}
        </ScrollView>
      </Box>

      <SectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 30, paddingHorizontal: 16, }}
        sections={filteredData}
        ItemSeparatorComponent={() => <Box h={5} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChargingItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
      />
    </Box>
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