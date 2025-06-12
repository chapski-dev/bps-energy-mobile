import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';

export const DeleteAccountModal = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { onLogout } = useAuth();

  const handleRemoveAccount = () => {
    modal()?.closeModal?.();
    onLogout();
  };
  const closeModal = () => modal()?.closeModal?.();

  return (
    <Box borderRadius={16} backgroundColor={colors.background} p={16} gap={16}>
      <Box gap={8}>
        <Text variant="p1-semibold" children={t('to-delete-account') +'?'} mb={2} />
        <Text children="Последствия:" variant="p4-semibold" />
        <Text
          variant="p4"
          children="- Вы не сможете запускать зарядные сессии.
- Все ваши пользовательские данные будут удалены.
- История зарядок и пополнений пропадет.
- Привязанные карты открепяться.
- Средства с текущего баланса будут возвращены на выбранную карту в течении пяти банковских дней."
          colorName="grey_700"
        />
        <Text children="Это действие нельзя отменить." variant="p4-semibold" />
      </Box>
      <Button
        onPress={handleRemoveAccount}
        children={t('to-delete-account')}
        textColor="red_500"
        backgroundColor="red_500_15"
      />
      <Button onPress={closeModal} children={t('to-cancel')} />
    </Box>
  );
};
