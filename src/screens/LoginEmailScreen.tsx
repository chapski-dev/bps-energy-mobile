import React, { useState } from 'react';
import { useMaskedInputProps } from 'react-native-mask-input';
import LogoIcon from '@assets/svg/logo.svg';


import { ScreenProps } from '@src/navigation/types';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { phoneMask } from '@src/utils/masks';
import { useAppTheme } from '@src/theme/theme';

const LoginViaEmailScreen = ({ navigation, route }: ScreenProps<'login-via-phone'>) => {
  const { t } = useLocalization();
  const { insets } = useAppTheme()
  const handleSubmit = () => {
    navigation.navigate('otp-verify', { action: 'login' });
  };

  const [phone, setPhone] = useState('');

  const maskedInputProps = useMaskedInputProps({
    mask: phoneMask,
    onChangeText: setPhone,
    value: phone
  });

  return (
    <Box pr={16} pl={16} pt={insets.top + 82} gap={24} alignItems='center' flex={1} >
      <LogoIcon />
      <Box gap={16} w='full'>
        <Input required {...maskedInputProps} placeholder='Email' />
        <Input required {...maskedInputProps} placeholder={t('password')} />
      </Box>
      <Box style={{ alignSelf: 'flex-end' }} onPress={handleSubmit} >
        <Text children='Забыли пароль?' />
      </Box>

      <Button children={t('enter')} onPress={handleSubmit} />
    </Box>
  );
};

export default LoginViaEmailScreen;
