import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const transactionData = route?.params?.transaction;

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
        {'BYN' === 'BYN' ?
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
          + {transactionData.amount} <Text variant="h5" children={'BYN'} />
        </Text>
      </Box>

      <Box flex={1} >
        <DetailRow
          label="Статус операции"
          value={transactionData.state ? 'Исполнена' : 'qwe'}
        />
        <DetailRow
          label="Метод оплаты"
          value={`${transactionData.card_type} · ${transactionData.card_mask}`}
        />
        <DetailRow
          label="Баланс до пополнения"
          value={`${transactionData.rest_before || '???'} ${'BYN'}`}
        />
        <DetailRow
          label="Баланс после пополнения"
          value={`${transactionData.rest_after || '???'} ${'BYN'}`}
          isLast
        />
      </Box>

      <Button
        type="outline"
        icon={<FilePdfIcon />}
        children={t('shared.to-download-check')}
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