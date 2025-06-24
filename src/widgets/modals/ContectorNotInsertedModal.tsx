import React from 'react'
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { modal } from '@src/ui/Layouts/ModalLayout';

export const ContectorNotInsertedModal = () => {
  const { colors } = useAppTheme();
  const closeModal = () => modal()?.closeModal?.();
  const { t } = useTranslation('widgets', { keyPrefix: 'contector-not-inserted-modal' })

  return (
    <Box borderRadius={16} backgroundColor={colors.background} p={16} gap={16} >
      <Box alignItems='center'>
        <Text center fontWeight='600' fontSize={17} children={t('title')} mb={2} />
        <Text
          center
          children={t('description')}
          colorName='grey_700'
        />
      </Box>

      <Button
        onPress={closeModal}
        children={t('ok-button')}
      />
    </Box>
  )
}
