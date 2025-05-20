import React from 'react'
import { Box, Text } from '@src/ui'
import { ScreenProps } from '@src/navigation/types'

export default function ForgotPasswordScreen({ navigation }: ScreenProps<'forgot-password'>) {
  return (
    <Box>
      <Text children="ForgotPasswordScreen" />
    </Box>
  )
}
