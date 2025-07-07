import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import BatteryChargingIcon from '@assets/svg/battery-charging.svg';
import CheckCircleIcon from '@assets/svg/check-circle.svg';
import ClockIcon from '@assets/svg/clock.svg';
import LogoIcon from '@assets/svg/logo.svg';
import WalletIcon from '@assets/svg/wallet.svg';

import { ChargingDetails } from '@src/api/types';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';

export default function ChargingSummaryScreen({
  navigation,
  route
}: ScreenProps<'charging-session-summary'>) {
  const { colors, insets } = useAppTheme();
  const { t } = useTranslation('screens', { keyPrefix: 'charging-session-screen' });

  const { session, remainingSessions = 0 }: { session: ChargingDetails; remainingSessions?: number } = route.params;

  const handleDone = () => {
    // Навигация обратно в ChargingScreen или на MapTab
    if (remainingSessions > 0) {
      navigation.goBack();
    } else {
      navigation.navigate('tabs'); // заменить на актуальное имя таба
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingTop: insets.top + 12 }}
      showsVerticalScrollIndicator={false}
    >
    <Box alignItems="center" mt={24 + 44} mb={48}>
      <LogoIcon color={colors.text} />
    </Box>

    <Text
      variant="h3"
      center
      mb={8}
      children={t('charging-complete')}
    />
    <Text
      variant="p2"
      center
      colorName="grey_600"
      mb={32}
      children={t('thank-you-message')}
    />

    <Box gap={8} mb={24}>
      <SummaryCard
        title={t('received')}
        value={`${session.session.energy_received.toFixed(2)} ${t('kilowatt-hour')}`}
        icon={<CheckCircleIcon color={colors.green} />}
      />

      <SummaryCard
        title={t('battery')}
        value={`${session.session.soc_end}%`}
        icon={<BatteryChargingIcon color={colors.green} />}
        from={`${session.session.soc_start}% → `}
      />

      <SummaryCard
        title={t('charging-time')}
        value={`${session.session.duration_minutes} мин`}
        icon={<ClockIcon color={colors.green} />}
      />

      <SummaryCard
        title={t('spent')}
        value={`${session.session.cost} ${session.session.currency}`}
        icon={<WalletIcon color={colors.green} />}
      />
    </Box>

    <Box gap={12}>
      <Button
        onPress={handleDone}
        backgroundColor="green"
        children={t('done')}
      />
    </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
});

const SummaryCard = ({
  title,
  value,
  icon,
  from,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  from?: string
}) => {
  const { colors } = useAppTheme();

  return (
    <Box
      backgroundColor={colors.grey_50}
      borderRadius={8}
      px={12}
      py={16}
      row
      alignItems="center"
      justifyContent="space-between"
    >
      <Box row alignItems="center" gap={8}>
        {icon}
        <Text variant="p2" colorName="grey_700" children={title} />
      </Box>
      <Text>
        <Text variant="p2-semibold" colorName="grey_600" children={from} />
        <Text variant="p2-semibold" colorName="grey_800" children={value} />
      </Text>
    </Box>
  );
};
