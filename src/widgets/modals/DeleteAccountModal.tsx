import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';

export const DeleteAccountModal = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation('widgets', { keyPrefix: 'delete-account-modal' });
  const { onLogout } = useAuth();

  const handleRemoveAccount = () => {
    modal()?.closeModal?.();
    onLogout();
  };
  const closeModal = () => modal()?.closeModal?.();

  return (
    <Box borderRadius={16} backgroundColor={colors.background} p={16} gap={16}>
      <Box gap={8}>
        <Text variant="p1-semibold" children={t('delete-account') + '?'} mb={2} />
        <Text children={t('consequences')} variant="p4-semibold" />
        <Text
          variant="p4"
          children={t('consequences-list')}
          colorName="grey_700"
        />
        <Text children={t('action-irreversible')} variant="p4-semibold" />
      </Box>
      <Button
        onPress={handleRemoveAccount}
        children={t('delete-account')}
        textColor="error_500"
        backgroundColor="error_500_15"
      />
      <Button onPress={closeModal} children={t('cancel')} />
    </Box>
  );
};

export const DeleteAccountButton = () => {
  const { t } = useTranslation('widgets', { keyPrefix: 'delete-account-modal' });

  const onDeleteAccountPress = () =>
    Alert.alert(t('alert.title'), undefined, [
      {
        onPress: () => null,
        text: t('alert.cancel'),
      },
      {
        onPress: onFinalyDeleteAccountPress,
        style: 'destructive',
        text: t('alert.delete'),
      },
    ]);

  const onFinalyDeleteAccountPress = useCallback(() => {
    modal().setupModal?.({
      element: <DeleteAccountModal />,
      justifyContent: 'center',
      marginHorizontal: 48,
    });
  }, []);

  return (
    <Button
      type="clear"
      textColor="error_500"
      children={t('delete-account')}
      onPress={onDeleteAccountPress}
    />
  )
}