import React from 'react';
import LogoIcon from '@assets/svg/logo.svg';

import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';


const LoginScreen = ({ navigation }: ScreenProps<'login'>) => {
  const { insets } = useAppTheme();

  const { t } = useLocalization()

  return (
    <Box flexGrow={1} pt={insets.top} pl={16} pr={16} alignItems="center" gap={24} justifyContent="center">
      <LogoIcon />
      <Text type="h3"
        center
        children={t('log_in_or_register_to_manage_your_routes')}
      />
      <Box gap={12} w="full" >
        <Button
          children={t('enter')}
          onPress={() => navigation.navigate('login-via-phone')}

        />
        <Button
          type="clear"
          children={t('registration')}
          textColor="main"
          onPress={() => navigation.navigate('registration', { step: 'driver_performer_or_invaitetion' })}
        />
      </Box>
    </Box>
  );
};

export default LoginScreen;
