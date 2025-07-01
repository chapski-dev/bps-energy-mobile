import React, { PropsWithChildren } from 'react';
import { FlexAlignType } from 'react-native';
import CaretRightIcon from '@assets/svg/caret-right.svg';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

type SectionListItemWithArrowProps = PropsWithChildren & {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  /** default true */
  borderBottom?: boolean;
  icon?: React.ReactNode;
  alignItems?: FlexAlignType;
  /** Дополнительная информация рядом с кареткой (например, выбранный язык) */
  rightText?: string;
};

export const SectionListItemWithArrow = ({
  title,
  onPress,
  disabled,
  children,
  icon,
  borderBottom = true,
  alignItems,
  rightText,
}: SectionListItemWithArrowProps) => {
  const { colors } = useAppTheme();

  return (
    <Box w="full">
      <Box
        w="full"
        minHeight={56}
        py={16}
        row
        alignItems={alignItems}
        justifyContent="space-between"
        onPress={onPress}
        disabled={disabled}
      >
        {/* Левая часть с иконкой */}
        {icon && (
          <Box mr={12}>
            {icon}
          </Box>
        )}
        
        {/* Основной контент с линией */}
        <Box 
          flex={1} 
          row 
          alignItems="center" 
          justifyContent="space-between"
          borderBottomWidth={borderBottom ? 1 : 0}
          borderColor={colors.grey_100}
          pb={borderBottom ? 16 : 0}
          mb={borderBottom ? -16 : 0}
        >
          {/* Текст */}
          <Box row alignItems={alignItems}>
            {children || (
              <Text
                color={disabled ? colors.grey_100 : undefined}
                variant='p2-semibold'
                children={title}
              />
            )}
          </Box>
          
          {/* Правая часть с доп. текстом и кареткой */}
          {onPress && (
            <Box row alignItems="center" gap={8}>
              {rightText && (
                <Text
                  color={disabled ? colors.grey_100 : colors.grey_400}
                  variant='p2'
                  children={rightText}
                />
              )}
              <CaretRightIcon color={disabled ? colors.grey_100 : colors.grey_400} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};