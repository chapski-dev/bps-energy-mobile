import React, { PropsWithChildren } from 'react';
import CaretRightIcon from '@assets/svg/caret-right.svg';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

type SectionListItemWithArrowProps = PropsWithChildren & {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  /** default true */
  borderBottom?: boolean;
};

export const SectionListItemWithArrow = ({
  title,
  onPress,
  disabled,
  children,
  borderBottom = true,
}: SectionListItemWithArrowProps) => {
  const { colors } = useAppTheme();

  return (
    <>
      <Box
        w="full"
        minHeight={56}
        py={16}
        row
        alignItems="center"
        justifyContent="space-between"
        onPress={onPress}
        disabled={disabled}
      >
        {children || (
          <Text
            color={disabled ? colors.grey_100 : undefined}
            variant='p2-semibold'
            children={children || title}
          />
        )}
        <CaretRightIcon color={disabled ? colors.grey_100 : colors.grey_400} />
      </Box>
      {borderBottom && <Box w="full" h={1} backgroundColor={colors.grey_100} />}
    </>
  );
};
