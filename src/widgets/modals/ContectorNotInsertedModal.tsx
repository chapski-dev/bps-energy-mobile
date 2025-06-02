import React from 'react'

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { modal } from '@src/ui/Layouts/ModalLayout';

export const ContectorNotInsertedModal = () => {
  const { colors } = useAppTheme();
  const closeModal = () => modal()?.closeModal?.();

  return (
    <Box borderRadius={16} backgroundColor={colors.background} p={16} gap={16} >
      <Box alignItems='center'>
        <Text center fontWeight='600' fontSize={17} children="Коннектор не вставлен" mb={2} />
        <Text
          center
          children="Для начала зарядки необходимо вставить коннектор."
          colorName='grey_700'
        />
      </Box>

      <Button
        onPress={closeModal}
        children="Ok"
      />
    </Box>
  )
}
