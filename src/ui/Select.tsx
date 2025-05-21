import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import TickIcon from '@assets/svg/tick-fill.svg';

import { useAppTheme } from '@src/theme/theme';


interface SelectProps {
  selected?: boolean;
  children?: string;
  onPress?: () => void;
}
const Select = ({
  selected,
  children,
  onPress,
}: SelectProps) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        borderColor: selected ? colors.main : colors.grey_100,
        borderRadius: 15,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 8,
        height: 72,
        paddingHorizontal: 8,
        width: '100%'
      }}
      onPress={onPress}
      >
        <TickIcon color={selected ? colors.main : colors.grey_100} width={15} height={15} />
        <Text children={children} style={{color: colors.grey_800}} />
    </TouchableOpacity>
  );
};

export default Select;