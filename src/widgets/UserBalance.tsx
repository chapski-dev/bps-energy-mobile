import React from 'react';
import { useTranslation } from 'react-i18next';
import BelarusIcon from '@assets/svg/flags/Belarus.svg';
import RussiaIcon from '@assets/svg/flags/Russia.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';

export default function UserBalance({
  currency,
  value,
  disabled,
}: {
  currency: 'RUB' | 'BYN';
  value: number;
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();
  const naigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Box
      px={16}
      py={14}
      borderRadius={8}
      backgroundColor={colors.grey_50}
      gap={8}
    >
      <Box row gap={8}>
        {currency === 'BYN' ? (
          <BelarusIcon width={16} height={16} />
        ) : (
          <RussiaIcon />
        )}
        <Text disabled={disabled} colorName="grey_600" children={t('shared.current-balance')} />
      </Box>
      <Box row justifyContent="space-between">
        <Text
          fontSize={20}
          fontWeight="600"
          disabled={disabled}
          children={`${value} ${currency}`}
        />
        <Box
          row
          gap={4}
          justifyContent="center"
          alignItems="center"
          disabled={disabled}
          onPress={() => naigation.navigate('top-up-account', { currency })}
        >
          <Text disabled={disabled} children={t('shared.to-top-up')} colorName="main" />
          <PlusCircleFillIcon color={disabled ? colors.grey_400 : colors.main} />
        </Box>
      </Box>
    </Box>
  );
}
