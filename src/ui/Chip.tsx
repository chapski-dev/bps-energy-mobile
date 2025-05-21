import React, { PropsWithChildren } from 'react';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

export const Chip = ({ children }: PropsWithChildren) => {
  const { colors } = useAppTheme();

  return (
    <Box borderColor={colors.grey_100} borderWidth={1} px={10} borderRadius={5}>
      <Text children={children} />
    </Box>
  );
};

