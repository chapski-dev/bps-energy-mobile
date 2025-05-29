import React, { useState } from 'react'
import CopySuccessIcon from '@assets/svg/check-circle-fill.svg'
import CopyIcon from '@assets/svg/copy.svg';

import { useAppTheme } from '@src/theme/theme';
import { copyToClipboard } from '@src/utils/copyToClipboard';

export const CopyToClipboard = ({ onPress, value, message }:
  { onPress?: () => void; value: string, message: string }) => {
  const { colors } = useAppTheme();
  const [copied, setCopied] = useState(false);
  
  const _handlePress = () => {
    onPress && onPress();
    copyToClipboard(value, message)
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return copied ? <CopySuccessIcon color={colors.green} width={16} height={16} /> :
    <CopyIcon
      width={16}
      height={16}
      color={colors.grey_400}
      onPress={_handlePress}
    />
}
