import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { validator } from '@src/utils/validations';


const ForgotPasswordScreen = ({ navigation }: ScreenProps<'forgot-password'>) => {
  const { insets } = useAppTheme();
  const { t } = useLocalization()

  const { control, handleSubmit } = useForm({
    defaultValues: { email: '' },
    mode: 'all',
  });

  const handleSendOtpToResetPassword = (data: { email: string }) => {
    console.log(data);
    navigation.navigate('tabs')
  }
  return (

    <Box accessible={false} onPress={Keyboard.dismiss} effect="none" flex={1} pr={20} pl={20}>
      <Box flex={1}>
        <Controller
          control={control}
          name='email'
          rules={{ required: true, validate: validator.email }}
          render={({ field: { value, onBlur, onChange }, fieldState }) => (
            <Input
              required
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder='E-mail'
              error={fieldState.invalid}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              inputMode="email"
              autoComplete="username"
              returnKeyType='done'
              importantForAutofill="yes"
              autoFocus
              prompting='Укажите E-mail на который создавали аккаунт и мы вышлем на него ссылку для восстановления пароля'
            />
          )}
        />
      </Box>

      <Button
        children={t('confirm')}
        onPress={handleSubmit(handleSendOtpToResetPassword)}
      />
      <FakeView additionalOffset={-insets.bottom / 2} />
      <Gap y={insets.bottom || 16} />
    </Box>
  );
};

export default ForgotPasswordScreen;
