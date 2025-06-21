import React, { useCallback, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import Skeleton from 'react-native-reanimated-skeleton';
import ByFlagIcon from '@assets/svg/flags/Belarus.svg'
import RuFlagIcon from '@assets/svg/flags/Russia.svg'
import MagnifyingIcon from '@assets/svg/magnifying-glass-cross.svg'

import { getTransactionsHistory } from '@src/api';
import { useLocalization } from '@src/hooks/useLocalization';
import { isIOS } from '@src/misc/platform';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { dateFormat } from '@src/utils/date-format';
import { rechargingsSkeletonLayout } from '@src/utils/vars/skeletons';
import { DatePeriodSelect, initialDates } from '@src/widgets/DatePeriodSelect';

type Transaction = {
  amount: number,
  card_mask: string,
  card_type: string,
  date: string,
  id: number,
  rest_after: number,
  rest_before: number,
  state: string,
  wallet_type: string
}

type SectionData = {
  title: string;
  data: Transaction[];
}

// Утилита для группировки транзакций по датам
const groupTransactionsByDate = (transactions: Transaction[]): SectionData[] => {
  const grouped = transactions.reduce((acc, transaction) => {
    // Конвертируем дату в читаемый формат (предполагаем что date в ISO формате)
    const date = new Date(transaction.date);
    const dateKey = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'long'
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return Object.entries(grouped).map(([title, data]) => ({
    data,
    title
  }));
};

// Утилита для получения валюты из wallet_type
const getCurrencyFromWalletType = (walletType: string): string => {
  if (walletType.toLowerCase().includes('by') || walletType.toLowerCase().includes('byn')) {
    return 'BYN';
  }
  if (walletType.toLowerCase().includes('ru') || walletType.toLowerCase().includes('rub')) {
    return 'RUB';
  }
  return 'BYN'; // По умолчанию
};

// Утилита для получения названия кошелька
const getWalletName = (walletType: string): string => {
  const currency = getCurrencyFromWalletType(walletType);
  return currency === 'BYN' ? 'BY Кошелёк' : 'RU Кошелёк';
};

// Утилита для форматирования способа оплаты
const formatPaymentMethod = (cardType: string, cardMask: string): string => {
  if (cardMask && cardMask.length >= 4) {
    const lastFour = cardMask.slice(-4);
    return `${cardType} • ${lastFour}`;
  }
  return cardType || 'Неизвестно';
};

// Моковые данные для скелетонов загрузки
const mockTransactions: Transaction[] = [
  {
    amount: 10,
    card_mask: '5123',
    card_type: 'Visa',
    date: '2025-06-07T14:21:53Z',
    id: 1,
    rest_after: 100,
    rest_before: 90,
    state: 'completed',
    wallet_type: 'BY_WALLET'
  },
  {
    amount: 1500,
    card_mask: '5141',
    card_type: 'Visa',
    date: '2025-06-07T14:21:53Z',
    id: 2,
    rest_after: 2500,
    rest_before: 1000,
    state: 'completed',
    wallet_type: 'RU_WALLET'
  },
  {
    amount: 15,
    card_mask: '',
    card_type: 'Apple Pay',
    date: '2025-06-03T14:21:53Z',
    id: 3,
    rest_after: 115,
    rest_before: 100,
    state: 'completed',
    wallet_type: 'BY_WALLET'
  }
];

export default function RechargeHistoryScreen({ navigation }: ScreenProps<'recharge-history'>) {
  const { colors } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [filterDates, setFilterDates] = useState(initialDates)
  const { t } = useLocalization();
  const [sectionsData, setSectionsData] = useState<SectionData[]>(groupTransactionsByDate(mockTransactions));

  const onRefresh = useCallback(async (): Promise<void> => {
    try {
      setRefreshing(true);

      // Показываем моковые данные во время загрузки для скелетонов
      setSectionsData(groupTransactionsByDate(mockTransactions));

      const res = await getTransactionsHistory({
        date_begin: dateFormat('yyyy-MM-DD', filterDates.start),
        date_end: dateFormat('yyyy-MM-DD', filterDates.end)
      });
      // setTransactions(res.transactions);

      setSectionsData(groupTransactionsByDate(res.transactions));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setSectionsData([]);
    } finally {
      setRefreshing(false);
    }
  }, [filterDates.start, filterDates.end]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const renderRechargeItem = ({ item }: { item: Transaction }) => {
    const currency = getCurrencyFromWalletType(item.wallet_type);
    const walletName = getWalletName(item.wallet_type);
    const paymentMethod = formatPaymentMethod(item.card_type, item.card_mask);

    return (
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
          onPress={() => navigation.navigate('recharge-transaction-detail', { transaction: item })}
        >
          {currency === 'BYN' ? <ByFlagIcon width={24} height={24} /> : <RuFlagIcon width={24} height={24} />}
          <Box row flex={1} alignItems='center'>
            <Box flex={1} gap={4}>
              <Text variant='h5' children={walletName} mb={4} />
              <Text variant='p3' colorName='grey_700' children={paymentMethod} />
            </Box>

            <Box alignItems="flex-end">
              <Text variant='h4'>
                + {item.amount} <Text variant='h5' children={currency} />
              </Text>
            </Box>
          </Box>
        </Box>
      </Skeleton>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Skeleton
      containerStyle={{ borderRadius: 12 }}
      isLoading={refreshing}
      animationType={isIOS ? 'pulse' : 'none'}
      layout={[{ height: 25, width: 150 }]}
    >
      <Box py={12} px={16}>
        <Text colorName='grey_600' variant='p3' children={title} />
      </Box>
    </Skeleton>
  );

  const renderEmptyComponent = useCallback(() => (
    <Box flex={1} justifyContent='center' alignItems='center' gap={24} >
      <MagnifyingIcon />
      <Box gap={8}>
        <Text center children="Пополнений не найдено" variant='h5' colorName='grey_600' mb={8} />
        <Text
          children="За выбранный период вы не пополняли внутренний баланс"
          variant='p3'
          colorName='grey_600'
          center
        />
      </Box>
      <Button
        children={t('actions:to-reset-filter')}
        type='clear'
        onPress={() => setFilterDates(initialDates)}
      />
    </Box>
  ), [t])

  return (
    <>
      <Box flex={1}>
        <Box p={16} >
          <DatePeriodSelect
            filterDates={filterDates}
            onSubmit={setFilterDates}
          />
        </Box>

        <SectionList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, paddingHorizontal: 16 }}
          sections={sectionsData}
          ItemSeparatorComponent={() => <Box h={8} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRechargeItem}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          SectionSeparatorComponent={() => <Box h={8} />}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={() => console.log('onEndReached')}
        />
      </Box>
    </>
  );
}