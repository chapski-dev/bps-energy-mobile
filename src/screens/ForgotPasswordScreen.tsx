import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';

import { postForgotPassword } from '@src/api';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';


const ForgotPasswordScreen = ({ navigation }: ScreenProps<'forgot-password'>) => {
  const { insets } = useAppTheme();
  const { t } = useTranslation()
  const { control, handleSubmit, formState } = useForm({
    defaultValues: { email: '' },
    mode: 'all',
  });

  const [loading, setLoading] = useState(false);

  const handleSendOtpToResetPassword = async (data: { email: string }) => {
    try {
      setLoading(true);
      await postForgotPassword(data)
      navigation.navigate('otp-verify', {
        email: data.email,
        verify: 'reset-password',
      })
    } catch (error) {
      handleCatchError(error)
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Box accessible={false} onPress={Keyboard.dismiss} effect="none" flex={1} px={20} pt={30}>
      <Box flex={1}>
        <Controller
          control={control}
          name='email'
          rules={{ required: true, validate: validator.email }}
          render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
            <Input
              value={value}
              onChangeText={(v) => onChange(v.trim())}
              onBlur={onBlur}
              placeholder='E-mail'
              error={invalid}
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
              onSubmitEditing={handleSubmit(handleSendOtpToResetPassword)}
            />
          )}
        />
      </Box>

      <Button
        children={t('shared.to-confirm')}
        onPress={handleSubmit(handleSendOtpToResetPassword)}
        loading={loading}
        disabled={loading || !formState.isValid }
      />
      <FakeView additionalOffset={-insets.bottom / 2} />
      <Gap y={insets.bottom || 16} />
    </Box>
  );
};

export default ForgotPasswordScreen;
