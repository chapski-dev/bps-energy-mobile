import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TextInput } from 'react-native';
import LockIcon from '@assets/svg/lock.svg';

import { postChangePassword, postForgotPassword } from '@src/api';
import { useLocalization } from '@src/hooks/useLocalization';
import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';

function ChangePasswordScreen({
  navigation,
  route,
}: ScreenProps<'change-password'>) {
  const { insets, colors } = useAppTheme();
  const { t } = useLocalization(['screens', 'actions'], { keyPrefix: 'change-password-screen' });
  const { control, handleSubmit, formState } = useForm({
    defaultValues: { new_password: '', old_password: '' },
    mode: 'all',
  });
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const { toastSuccess } = useThemedToasts();

  const handleSendOtpToResetPassword = async () => {
    try {
      setLoading(true);
      await postForgotPassword({ email: user?.email as string });
      navigation.navigate('otp-verify', {
        email: user?.email as string,
        verify: 'reset-password',
      });
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: {
    new_password: string;
    old_password: string;
  }) => {
    try {
      setLoading(true);
      await postChangePassword(data);
      toastSuccess(t('password-changed-success'));
      navigation.goBack();
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  const secInputRef = useRef<TextInput>(null);

  return (
    <Box
      accessible={false}
      onPress={Keyboard.dismiss}
      effect="none"
      flex={1}
      px={20}
      pt={30}>
      <Box flex={1} gap={56}>
        <Box gap={12}>
          <Controller
            control={control}
            name="old_password"
            rules={{ required: true, validate: validator.password }}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { invalid },
            }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('current-password-placeholder')}
                error={invalid}
                returnKeyType="next"
                importantForAutofill="yes"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                type="password"
                icon={<LockIcon color={colors.grey_400} />}
                autoFocus
                onSubmitEditing={() => secInputRef?.current?.focus()}
              />
            )}
          />
          <Controller
            control={control}
            name="new_password"
            rules={{ required: true, validate: validator.password }}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { invalid },
            }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('new-password-placeholder')}
                error={invalid}
                returnKeyType="done"
                importantForAutofill="yes"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                type="password"
                icon={<LockIcon color={colors.grey_400} />}
                ref={secInputRef}
              />
            )}
          />
        </Box>
        <Button
          disabled={loading}
          children={t('reset-password-button')}
          type="clear"
          textColor="grey_600"
          onPress={handleSendOtpToResetPassword}
        />
      </Box>

      <Button
        children={t('actions:to-save')}
        onPress={handleSubmit(handleUpdatePassword)}
        disabled={loading || !formState.isValid}
        loading={loading}
      />
      <FakeView additionalOffset={-insets.bottom / 2} />
      <Gap y={insets.bottom || 16} />
    </Box>
  );
}

export default ChangePasswordScreen;
