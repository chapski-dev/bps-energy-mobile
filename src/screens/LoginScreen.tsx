import React, { useState } from 'react';
import { useMaskedInputProps } from 'react-native-mask-input';
import LogoIcon from '@assets/svg/logo.svg';

import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { phoneMask } from '@src/utils/masks';


const LoginScreen = ({ navigation }: ScreenProps<'login'>) => {
  const { insets, colors } = useAppTheme();

  const { t } = useLocalization()
  const { onSignin } = useAuth();

  const handleSubmit = () => {
    onSignin()
  };

  const [phone, setPhone] = useState('');

  const maskedInputProps = useMaskedInputProps({
    mask: phoneMask,
    onChangeText: setPhone,
    value: phone
  });

  const handleSkip = async () => {
    navigation.preload('tabs');
    navigation.navigate('tabs');
  }

  return (
    <Box
      pr={16}
      pl={16}
      pt={insets.top + 82}
      gap={24}
      pb={insets.bottom + 35}
      alignItems='center'
      flex={1} >
      <LogoIcon />
      <Box flex={1} w='full' gap={24}>
        <Box gap={16} w='full'>
          <Input required {...maskedInputProps} placeholder='Email' />
          <Input required {...maskedInputProps} placeholder={t('password')} />
        </Box>
        <Box style={{ alignSelf: 'flex-end' }} onPress={handleSubmit} >
          <Text color={colors.grey_600} children='Забыли пароль?' />
        </Box>

        <Button children={t('enter')} onPress={handleSubmit} />

        <Button
          type="clear"
          children={t('registration')}
          textColor="main"
          onPress={() => navigation.navigate('registration')}
        />
      </Box>

      <Button
        type="clear"
        children={t('skip')}
        onPress={handleSkip}
      />
    </Box>
  );
};

export default LoginScreen;
