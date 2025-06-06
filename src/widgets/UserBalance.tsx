import React from 'react';
import BelarusIcon from '@assets/svg/flags/Belarus.svg';
import RussiaIcon from '@assets/svg/flags/Russia.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';

export default function UserBalance({ currency, value, }: { currency: 'RUB' | 'BYN', value: number }) {
  const { colors } = useAppTheme();
  const naigation = useNavigation();

  return (
    <Box
      px={16}
      py={14}
      borderRadius={8}
      backgroundColor={colors.grey_50}
      gap={8}
    >
      <Box row gap={8}>
        {currency === 'BYN' ? <BelarusIcon width={16} height={16} /> : <RussiaIcon />}
        <Text colorName='grey_600' children="Текущий баланс" />
      </Box>
      <Box row justifyContent="space-between">
        <Text fontSize={20} fontWeight="600" children={`${value} ${currency}`} />
        <Box
          row
          gap={4}
          justifyContent="center"
          alignItems="center"
          onPress={() => naigation.navigate('top-up-account', { currency })}
        >
          <Text children="Пополнить" colorName="main" />
          <PlusCircleFillIcon color={colors.main} />
        </Box>
      </Box>
    </Box>
  );
}
