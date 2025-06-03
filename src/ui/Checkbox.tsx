import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import CheckboxIcon from '@assets/svg/checkbox.svg';
import CheckboxFillIcon from '@assets/svg/checkbox-fill.svg';

import { useAppTheme } from '@src/theme/theme';

import { Box } from './Box';
import { Text } from './Text';

interface SelectProps {
  checked?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  wrapperStyle?: StyleProp<ViewStyle>
}
const Checkbox = ({ checked, children, onPress, wrapperStyle }: SelectProps) => {
  const { colors } = useAppTheme();

  return (
    <Box onPress={onPress} row gap={12} style={[{ width: '100%' }, wrapperStyle]} >
      {checked ? <CheckboxFillIcon /> : <CheckboxIcon color={colors.grey_400} />}
      <Text style={{ flexShrink: 1 }} >{children}</Text>
    </Box>
  );
};

export default Checkbox;
