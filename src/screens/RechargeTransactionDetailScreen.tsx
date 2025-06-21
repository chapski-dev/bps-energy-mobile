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
  const { t } = useTranslation('screens', { keyPrefix: 'recharge-transaction-detail-screen' });

  const transactionData = route?.params?.transaction;

  const getStatusText = () => {
    if (transactionData.state === 'completed') return t('status.completed');
    if (transactionData.state === 'pending') return t('status.pending');
    return t('status.failed');
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
          children={t('title')}
        />

        <Text variant="h1" center>
          + {transactionData.amount} <Text variant="h5" children={t('currency.byn')} />
        </Text>
      </Box>

      <Box flex={1}>
        <DetailRow
          label={t('labels.operation-status')}
          value={getStatusText()}
        />
        <DetailRow
          label={t('labels.payment-method')}
          value={`${transactionData.card_type} · ${transactionData.card_mask}`}
        />
        <DetailRow
          label={t('labels.balance-before')}
          value={`${transactionData.rest_before || '???'} ${t('currency.byn')}`}
        />
        <DetailRow
          label={t('labels.balance-after')}
          value={`${transactionData.rest_after || '???'} ${t('currency.byn')}`}
          isLast
        />
      </Box>

      <Button
        type="outline"
        icon={<FilePdfIcon />}
        children={t('labels.download-receipt')}
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