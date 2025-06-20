import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Vibration } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EnvelopeIcon from '@assets/svg/envelope.svg';
import LockIcon from '@assets/svg/lock.svg';
import LogoIcon from '@assets/svg/logo.svg';
import { isAxiosError } from 'axios';

import { SignInReq } from '@src/api/types';
import { useLocalization } from '@src/hooks/useLocalization';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';


const LoginScreen = ({ navigation }: ScreenProps<'login'>) => {
  const { insets, colors } = useAppTheme();
  const { t } = useLocalization()
  const { onSignIn } = useAuth();
  const { control, handleSubmit } = useForm<SignInReq>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  const handleSkip = async () => {
    navigation.preload('tabs');
    await wait(100)
    navigation.navigate('tabs');
  }
  const [loading, setLoading] = useState(false);

  const handleLogIn = async (data: SignInReq) => {
    try {
      setLoading(true)
      await onSignIn(data)
    } catch (error) {
      if (isAxiosError(error) && error?.response?.status === 403) {
        navigation.navigate('otp-verify', {
          email: data.email,
          verify: 'registration',
        })
      }
      handleCatchError(error)
      Vibration.vibrate();
    } finally {
      setLoading(false)
    }
  }
  const secInputRef = useRef<TextInput>(null);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
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
            <Controller
              control={control}
              name='email'
              rules={{ required: true, validate: validator.email }}
              render={({ field: { value, onBlur, onChange }, fieldState }) => (
                <Input
                  value={value}
                  onChangeText={(v) => onChange(v.trim())}
                  onBlur={onBlur}
                  placeholder='E-mail'
                  error={fieldState.invalid}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                  inputMode="email"
                  autoComplete="username"
                  returnKeyType="next"
                  importantForAutofill="yes"
                  onSubmitEditing={() => secInputRef?.current?.focus()}
                  icon={<EnvelopeIcon color={colors.grey_400} />}
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              rules={{ required: true, validate: validator.password }}
              render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
                <Input
                  value={value}
                  onChangeText={(v) => onChange(v.trim())}
                  onBlur={onBlur}
                  placeholder={t('password')}
                  error={invalid}
                  returnKeyType="done"
                  ref={secInputRef}
                  importantForAutofill="yes"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  type='password'
                  icon={<LockIcon color={colors.grey_400} />}
                />
              )}
            />
          </Box>
          <Box
            style={{ alignSelf: 'flex-end' }}
            onPress={() => navigation.navigate('forgot-password')}
          >
            <Text color={colors.grey_600} children={t('forgot-password')} />
          </Box>

          <Button
            children={t('actions:to-login')}
            onPress={handleSubmit(handleLogIn)}
            loading={loading}
            disabled={loading}
          />
          <Button
            type='outline'
            children="Создать аккаунт"
            onPress={() => navigation.navigate('registration')}
          />
        </Box>

        <Button
          type="clear"
          children={t('actions:to-skip')}
          onPress={handleSkip}
        />
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;