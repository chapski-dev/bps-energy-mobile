import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import LockIcon from '@assets/svg/lock.svg';

import { postChangePasswordViaOtp } from '@src/api';
import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';


const SetNewPasswordScreen = ({ navigation, route }: ScreenProps<'set-new-password'>) => {
  const { insets, colors } = useAppTheme();
  const { t } = useTranslation(['screens', 'actions'])
  const { onSignIn } = useAuth();
  const { control, handleSubmit, formState } = useForm({
    defaultValues: { password: '' },
    mode: 'all',
  });

  const [loading, setLoading] = useState(false);
  const { toastSuccess } = useThemedToasts();

  const handleSendOtpToResetPassword = async (data: { password: string }) => {
    try {
      setLoading(true);
      await postChangePasswordViaOtp({
        email: route.params.email,
        new_password: data.password,
        verification_code: route.params.otp,
      })

      await onSignIn({ email: route.params?.email, password: data.password })
      toastSuccess(t('set-new-password-screen.password-changed-success'))
      navigation.replace('tabs')
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
          name='password'
          rules={{ required: true, validate: validator.password }}
          render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('set-new-password-screen.password-placeholder')}
              error={invalid}
              returnKeyType="done"
              importantForAutofill="yes"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              type='password'
              icon={<LockIcon color={colors.grey_400} />}
              autoFocus
            />
          )}
        />
      </Box>

      <Button
        children={t('actions:to-save')}
        onPress={handleSubmit(handleSendOtpToResetPassword)}
        disabled={loading || !formState.isValid}
        loading={loading}
      />
      <FakeView additionalOffset={-insets.bottom / 2} />
      <Gap y={insets.bottom || 16} />
    </Box>
  );
};

export default SetNewPasswordScreen;
