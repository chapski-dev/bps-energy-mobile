import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorBoundary from 'react-native-error-boundary'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import TryAgainIcon from '@assets/svg/arrow-counter-clockwise.svg';
import EnvelopIcon from '@assets/svg/envelope.svg';
import WarningCircleIcon from '@assets/svg/warning-circle.svg';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { vibrate } from '@src/utils/vibrate';

import { CrashHandler } from './CrashHandler';

const CustomFallback = (props: { error: Error, resetError: () => void }) => {
  const { t } = useTranslation('errors')
  const { colors } = useAppTheme();

  return (
    <Box flex={1} justifyContent='center' alignItems='center' px={16} gap={24}>
      <WarningCircleIcon color={colors.primary} width={72} height={72} />
      <Box gap={8}>
        <Text variant='h5' center children={t('critical.error-boundary-title')} />
        <Text
          variant='p3'
          colorName="grey_600"
          center
          px={20}
          children={t('critical.error-boundary-message')}
        />
      </Box>
      <Box gap={12} alignItems='center'>
        <Button
          onPress={props.resetError}
          children={t('critical.try-again')}
          width="auto"
          icon={<TryAgainIcon />}
        />
        <Button
          type="outline"
          width='auto'
          icon={<EnvelopIcon color={colors.grey_800} />}
          onPress={() => CrashHandler.handleFatalError(props.error, 'JavaScript')}
          children={t('critical.send-report')}
        />
      </Box>
    </Box>
  )
}

export const AppErrorBoundary = ({ children }: PropsWithChildren) => (
  <ErrorBoundary FallbackComponent={CustomFallback}
    onError={() => vibrate(HapticFeedbackTypes.notificationError)}
  >
    {children}
  </ErrorBoundary>
)