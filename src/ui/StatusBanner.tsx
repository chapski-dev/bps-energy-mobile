import React, { View } from 'react-native';
import WarningIcon from '@assets/svg/warning-circle.svg';

import { useAppTheme } from '@src/theme/theme';

import { Text } from './Text';


type Status = 'error' | 'warning' | 'success';

interface StatusBannerProps {
  status: Status;
  title: string;
  description: string;
}

export const StatusBanner = ({ status, title, description }: StatusBannerProps) => {
  const { colors } = useAppTheme();

  const statusConfig = {
    error: { bgColor: colors.red_light, icon: <WarningIcon color={colors.red} /> },
    success: { bgColor: colors.green_light, icon: <WarningIcon color={colors.green} /> },
    warning: { bgColor: colors.grey_50, icon: <WarningIcon color={colors.grey_500} /> },
  };

  return (
    <View style={{
      backgroundColor: statusConfig[status].bgColor,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 16,
      padding: 16,
    }}>
      <View style={{ gap: 4 }}>
        <Text fontWeight='600' fontSize={15}>{title}</Text>
        <Text fontSize={13}>{description}</Text>
      </View>
      {statusConfig[status].icon}
    </View>
  );
};