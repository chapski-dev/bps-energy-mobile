import React from 'react'

import { ScreenProps } from '@src/navigation/types'
import { Box } from '@src/ui'
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow'

export default function SupportServiceScreen({
  navigation,
  route,
}: ScreenProps<'support-service'>) {
  return (
    <Box pt={15} px={16}>
      <SectionListItemWithArrow
        title='Написать в Telegram'
        onPress={() => null}
      />
      <SectionListItemWithArrow
        title='Написать в WhatsApp'
        onPress={() => null}
      />
    </Box>
  )
}
