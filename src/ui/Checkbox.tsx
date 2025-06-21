import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import CheckboxIcon from '@assets/svg/checkbox.svg';
import CheckboxFillIcon from '@assets/svg/checkbox-fill.svg';

import { useAppTheme } from '@src/theme/theme';
import { vibrate } from '@src/utils/vibrate';

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
  const _handlePess = () => {
    vibrate(HapticFeedbackTypes.impactMedium)
    onPress && onPress()
  }
  return (
    <Box onPress={_handlePess} row gap={12} style={[{ width: '100%' }, wrapperStyle]} >
      {checked ? <CheckboxFillIcon /> : <CheckboxIcon color={colors.grey_400} />}
      <Text style={{ flexShrink: 1 }} >{children}</Text>
    </Box>
  );
};

export default Checkbox;
