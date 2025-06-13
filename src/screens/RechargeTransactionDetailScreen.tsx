import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FilePdfIcon from '@assets/svg/file-pdf.svg'
import ByFlagIcon from '@assets/svg/flags/Belarus.svg'
import RuFlagIcon from '@assets/svg/flags/Russia.svg'

import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';

export default function RechargeTransactionDetailScreen({
  route
}: ScreenProps<'recharge-transaction-detail'>) {
  const { colors, insets } = useAppTheme();

  const transactionData = route?.params?.transaction || {
    amount: '10',
    balanceAfter: '12,40',
    balanceBefore: '2,40',
    currency: 'BYN',
    date: '7 июня 2025, 14:21:53',
    flag: '🇧🇾',
    id: 1,
    paymentMethod: 'Visa • 5123',
    status: 'Исполнена',
    walletName: 'BY Кошелёк'
  };

  const DetailRow = ({ label, value, isLast = false }:
    { label: string; value: string; isLast?: boolean }) => (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      py={16}
      px={16}
      borderBottomWidth={isLast ? 0 : 1}
      borderColor={colors.grey_100}
    >
      <Text variant="p2" colorName="grey_700" children={label} />
      <Text variant="p2-semibold" children={value} />
    </Box>
  );

  const renderFlag = () => {
    return (
      <Box
        borderRadius={40}
        justifyContent="center"
        alignItems="center"
      >
        {transactionData.currency === 'BYN' ?
          <ByFlagIcon width={80} height={80} /> :
          <RuFlagIcon width={80} height={80} />}
      </Box>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ ...styles.container, paddingBottom: insets.bottom + 15 }}
    >
      <Box alignItems="center" py={32}>
        {renderFlag()}
        <Text
          variant="p1"
          center
          mt={24}
          mb={8}
          children="Пополнение BY баланса"
        />

        <Text variant="h1" center>
          + {transactionData.amount} <Text variant="h5" children={transactionData.currency} />
        </Text>
      </Box>

      <Box flex={1} >
        <DetailRow
          label="Статус операции"
          value={transactionData.status}
        />
        <DetailRow
          label="Метод оплаты"
          value={transactionData.paymentMethod}
        />
        <DetailRow
          label="Баланс до пополнения"
          value={`${transactionData.balanceBefore || '???'} ${transactionData.currency}`}
        />
        <DetailRow
          label="Баланс после пополнения"
          value={`${transactionData.balanceAfter || '???'} ${transactionData.currency}`}
          isLast
        />
      </Box>

      <Button
        type="outline"
        icon={<FilePdfIcon />}
        children="Скачать чек"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});