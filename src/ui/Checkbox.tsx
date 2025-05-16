import React from 'react';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

interface SelectProps {
  selected?: boolean;
  children?: string;
  onPress?: () => void;
}
const Checkbox = ({ selected, children, onPress }: SelectProps) => {
  const { colors } = useAppTheme();

  return (
    <Box onPress={onPress} row gap={8} h={30} alignItems="center" w="full" >
      <Box
        w={20}
        h={20}
        borderColor={colors.disabled}
        borderWidth={1}
        alignItems="center"
        justifyContent="center"
        borderRadius={5}
      >
        {selected && (
          <Box w={15} h={15} backgroundColor={colors.main} borderRadius={4} />
        )}
      </Box>
      <Text color="black" fontWeight={400} children={children} />
    </Box>
  );
};

export default Checkbox;
