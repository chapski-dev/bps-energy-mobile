import React from 'react'

import { ScreenProps } from '@src/navigation/types'
import { Box, Text } from '@src/ui'

export default function ResetPasswordScreen({ navigation }: ScreenProps<'reset-password'>) {
  return (
    <Box>
      <Text children="ResetPasswordScreen" />
    </Box>
  )
}
