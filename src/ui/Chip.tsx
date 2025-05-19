import React from 'react';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

type ChipProps = {
  children: string;
};
export const Chip = ({ children }: ChipProps) => {
  const { colors } = useAppTheme();

  return (
    <Box borderColor={colors.grey_100} borderWidth={1} px={10} borderRadius={5}>
      <Text children={children} />
    </Box>
  );
};

