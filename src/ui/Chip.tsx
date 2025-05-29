import React, { PropsWithChildren } from 'react';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

export const Chip = ({ children }: PropsWithChildren) => {
  const { colors } = useAppTheme();

  return (
    <Box backgroundColor={colors.grey_50} px={10} borderRadius={5}>
      <Text children={children} colorName='grey_700' />
    </Box>
  );
};

