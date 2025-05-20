import React from 'react'
import { Box, Text } from '@src/ui'
import { ScreenProps } from '@src/navigation/types'

export default function ResetPasswordScreen({ navigation }: ScreenProps<'reset-password'>) {
  return (
    <Box>
      <Text children="ResetPasswordScreen" />
    </Box>
  )
}
