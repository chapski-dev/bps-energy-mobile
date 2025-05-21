import React from 'react'

import { ScreenProps } from '@src/navigation/types'
import { Box, Text } from '@src/ui'

export default function RegistrationScreen({ navigation }: ScreenProps<'registration'>) {
  return (
    <Box>
      <Text children="RegistrationScreen" />
    </Box>
  )
}
