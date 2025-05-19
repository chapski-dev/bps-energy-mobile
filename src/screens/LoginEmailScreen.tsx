import React, { useState } from 'react';
import { useMaskedInputProps } from 'react-native-mask-input';

import { ScreenProps } from '@src/navigation/types';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { phoneMask } from '@src/utils/masks';
import { useAppTheme } from '@src/theme/theme';

import LogoIcon from '../../assets/svg/logo.svg';
import EnvelopeIcon from '../../assets/svg/envelope.svg';
import CastleIcon from '../../assets/svg/castle.svg';
import { TouchableOpacity } from 'react-native';

const LoginViaEmailScreen = ({
  navigation,
  route,
}: ScreenProps<'login-via-phone'>) => {
  const { t } = useLocalization();
  const { insets } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInput = (text: string) => {
    if (!text) {
      return 'Поле не должно быть пустым.';
    }
    if (text.length < 8) {
      return 'Пароль должен содержать минимум 8 символов.';
    }
    return null;
  };

  const handleSubmit = () => {
    navigation.navigate('otp-verify', { action: 'login' });
  };

  const [phone, setPhone] = useState('');

  const maskedInputProps = useMaskedInputProps({
    mask: phoneMask,
    onChangeText: setPhone,
    value: phone,
  });

  return (
    <Box px={24} pt={insets.top + 82} alignItems="center" gap={40}>
      <LogoIcon />
      <Box w="full">
        <Input
          icon={<EnvelopeIcon width={24} height={24} />}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          validate={validateInput}
        />
        <Input
          icon={<CastleIcon width={24} height={24} />}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          validate={validateInput}
          isPassword={true}
        />
        <TouchableOpacity
          style={{ alignItems: 'flex-end' }}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text>Забыли пароль?</Text>
        </TouchableOpacity>
      </Box>
      <Box w="full">
        <Button
          type="primary"
          title="Войти"
          onPress={() => navigation.navigate('tabs')}
        />
        <Box row alignItems="center" pt={28} pb={24}>
          <Box flex={1} h={1} backgroundColor="#D1D4DA" />
          <Text style={{ marginHorizontal: 10, color: '#A7ADB2' }}>или</Text>
          <Box flex={1} h={1} backgroundColor="#D1D4DA" />
        </Box>
        <Button
          title="Создать аккаунт"
          type="outline"
          onPress={() => navigation.navigate('Registration')}
        />
      </Box>
    </Box>
  );
};

export default LoginViaEmailScreen;
