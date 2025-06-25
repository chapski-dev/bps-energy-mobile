import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorBoundary from 'react-native-error-boundary'
import WarningCircleIcon from '@assets/svg/warning-circle.svg';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'

const CustomFallback = (props: { error: Error, resetError: () => void }) => {
  const { t } = useTranslation('errors') 
  const { colors } = useAppTheme();

  return (
  <Box flex={1} justifyContent='center' alignItems='center' px={16} gap={50}> 
    <WarningCircleIcon color={colors.main} width={130} height={130} />
    <Box gap={15}>
    <Text variant='h2' center children={t('critical.error-boundary-title')} />
    <Text variant='p1' center children={t('critical.error-boundary-message')} />
    <Text>{props.error.toString()}</Text>
    </Box>
    <Button onPress={props.resetError} children={t('critical.try-again')} />
  </Box>
)}

export const AppErrorBoundary = ({ children }: PropsWithChildren) => (
  <ErrorBoundary FallbackComponent={CustomFallback}
    onError={() => console.log('AppErrorBoundary onError')}
  >
    {children}
  </ErrorBoundary>
)