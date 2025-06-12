import React, { useEffect, useState } from 'react';
import { ScrollView, SectionList, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import Skeleton from 'react-native-reanimated-skeleton';
import ByFlagIcon from '@assets/svg/flags/Belarus.svg'
import RuFlagIcon from '@assets/svg/flags/Russia.svg'

import { isIOS } from '@src/misc/platform';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { wait } from '@src/utils';
import { rechargingsSkeletonLayout } from '@src/utils/vars/skeletons';

const rechargeData = [
  {
    data: [
      {
        amount: '10',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 1,
        paymentMethod: 'Visa • 5123',
        walletName: 'BY Кошелёк',
      },
      {
        amount: '1500',
        currency: 'RUB',
        flag: '🇷🇺',
        id: 2,
        paymentMethod: 'Visa • 5141',
        walletName: 'RU Кошелёк',
      },
    ],
    title: '7 июня, суббота',
  },
  {
    data: [
      {
        amount: '15',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 3,
        paymentMethod: 'Apple Pay',
        walletName: 'BY Кошелёк',
      },
    ],
    title: '3 июня, вторник',
  },
  {
    data: [
      {
        amount: '5',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 4,
        paymentMethod: 'Visa • 5123',
        walletName: 'BY Кошелёк',
      },
      {
        amount: '700',
        currency: 'RUB',
        flag: '🇷🇺',
        id: 5,
        paymentMethod: 'Apple Pay',
        walletName: 'RU Кошелёк',
      },
    ],
    title: '2 июня, понедельник',
  },
  {
    data: [
      {
        amount: '20',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 6,
        paymentMethod: 'Visa • 5123',
        walletName: 'BY Кошелёк',
      },
      {
        amount: '20',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 88,
        paymentMethod: 'Visa • 5123',
        walletName: 'BY Кошелёк',
      },
      {
        amount: '20',
        currency: 'BYN',
        flag: '🇧🇾',
        id: 99,
        paymentMethod: 'Visa • 5123',
        walletName: 'BY Кошелёк',
      },
    ],
    title: '1 июня, воскресенье',
  },
];

export default function RechargeHistoryScreen({ navigation }: ScreenProps<'recharge-history'>) {
  const [selectedFilter, setSelectedFilter] = useState('Все');
  const { colors } = useAppTheme();
  const filters = ['Все', 'BYN', 'RUB'];
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async (): Promise<void> => {
    try {
      setRefreshing(true);
      await wait(500);
    } finally {
      setRefreshing(false);
    }
  };
  console.log(rechargeData.length);
  
  useEffect(() => {
    onRefresh();
  }, []);

  const filteredData = selectedFilter === 'Все'
    ? rechargeData
    : rechargeData.map(section => ({
      ...section,
      data: section.data.filter(item => item.currency === selectedFilter),
    })).filter(section => section.data.length > 0);

  const renderFilterItem = (filter) => (
    <Box
      key={filter}
      backgroundColor={selectedFilter === filter ? colors.grey_800 : colors.grey_50}
      borderRadius={50}
      px={20}
      py={12}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        colorName={selectedFilter === filter ? 'white' : 'grey_800'}
        children={filter}
        variant='p3-semibold'
      />
    </Box>
  );

  const renderRechargeItem = ({ item }) => (
    <Skeleton
      containerStyle={{ backgroundColor: colors.grey_50, borderRadius: 12 }}
      isLoading={refreshing}
      animationType={isIOS ? 'pulse' : 'none'}
      layout={rechargingsSkeletonLayout}
    >
      <Box
        backgroundColor={colors.grey_50}
        borderRadius={12}
        row
        p={16}
        gap={11}
      >

        {item.currency === 'BYN' ? <ByFlagIcon width={24} height={24} /> : <RuFlagIcon width={24} height={24} />}
        <Box row flex={1} alignItems='center'>
          <Box flex={1} gap={4}>
            <Text variant='h5' children={item.walletName} mb={4} />
            <Text variant='p3' colorName='grey_700' children={item.paymentMethod} />
          </Box>

          <Box alignItems="flex-end">
            <Text variant='h4'>
              + {item.amount} <Text variant='h5' children={item.currency} />
            </Text>
          </Box>
        </Box>
      </Box>
    </Skeleton>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Box py={12} px={16}>
      <Text colorName='grey_600' variant='p3' children={title} />
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, paddingHorizontal: 16 }}
        sections={filteredData}
        ItemSeparatorComponent={() => <Box h={8} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRechargeItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        SectionSeparatorComponent={() => <Box h={8} />}
        onEndReached={() => {
          if (rechargeData.length > 8) return
          console.log('onEndReached');
          
          rechargeData.push({
            data: [
              {
                amount: '100',
                currency: 'BYN',
                flag: '🇧🇾',
                id: 7,
                paymentMethod: 'Visa • 5123',
                walletName: 'BY Кошелёк',
              },
            ],
            title: '1 июня, воскресенье',
          },)
          // onRefresh()
        }}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersContent: {
    gap: 12,
    paddingHorizontal: 16,
  },
});