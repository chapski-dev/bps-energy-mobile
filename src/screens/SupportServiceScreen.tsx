import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScreenProps } from '@src/navigation/types'
import { Box } from '@src/ui'
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow'

export default function SupportServiceScreen({
  navigation,
  route,
}: ScreenProps<'support-service'>) {
  const { t } = useTranslation('screens', { keyPrefix: 'support-service-screen' })
  return (
    <Box pt={15} px={16}>
      <SectionListItemWithArrow
        title={t('telegram')}
        onPress={() => null}
      />
      <SectionListItemWithArrow
        title={t('whatsapp')}
        onPress={() => null}
      />
    </Box>
  )
}
