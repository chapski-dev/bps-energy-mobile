import React from 'react'

import { ScreenProps } from '@src/navigation/types'
import { Box, Text } from '@src/ui'

export default function ForgotPasswordScreen({ navigation }: ScreenProps<'forgot-password'>) {
  return (
    <Box>
      <Text children="ForgotPasswordScreen" />
    </Box>
  )
}
