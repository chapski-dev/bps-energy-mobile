import React from 'react';

import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';

export const DeleteAccountModal = () => {
  const { colors } = useAppTheme();
  const { t } = useLocalization();

  const { onLogout } = useAuth();

  const handleRemoveAccount = () => {
    modal()?.closeModal?.();
    onLogout();
  };
  const closeModal = () => modal()?.closeModal?.();

  return (
    <Box borderRadius={16} backgroundColor={colors.background} p={16} gap={16}>
      <Box gap={8}>
        <Text variant="p1-semibold" children="Удалить аккаунт?" mb={2} />
        <Text
          variant="p4"
          children="После удалении аккаунта вы не сможете запускать зарядные сессии и все ваши пользовательские данные будут удалены."
          colorName="grey_700"
        />
        <Text
          colorName="grey_700"
          variant="p4"
          children="Ваши средства будут возвращены на выбранную карту в течении пяти банковских дней."
        />
        <Text children="Это действие нельзя отменить." variant="p4" />
      </Box>
      <Button
        type="outline"
        onPress={handleRemoveAccount}
        children={'Удалить аккаунт'}
        textColor="red_500"
      />
      <Button onPress={closeModal} children={t('cancel')} />
    </Box>
  );
};
