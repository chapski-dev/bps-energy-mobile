import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Vibration } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EnvelopeIcon from '@assets/svg/envelope.svg';
import LockIcon from '@assets/svg/lock.svg';
import LogoIcon from '@assets/svg/logo.svg';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { isAxiosError } from 'axios';

import { SignInReq } from '@src/api/types';
import { returnCountryFlag } from '@src/i18n/config';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';
import SelectLanguageModal from '@src/widgets/modals/SelectLanguageModal';


const LoginScreen = ({ navigation }: ScreenProps<'login'>) => {
  const { insets, colors } = useAppTheme();
  const { t, i18n } = useTranslation(['screens', 'actions'])
  const { onSignIn } = useAuth();
  const { control, handleSubmit } = useForm<SignInReq>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });
  const modal = useRef<BottomSheetModal>(null);
  const modalClose = () => modal?.current?.forceClose();
  const modalOpen = () => modal?.current?.present();

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
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box
          onPress={modalOpen}
          mt={insets.top + 22}
          mx={24}
          backgroundColor={colors.grey_50}
          py={4}
          px={8}
          borderRadius={4}
          alignSelf='flex-end'
        >
          <Text children={`${i18n.language} ${returnCountryFlag(i18n.language)}`} right uppercase />
        </Box>
        <Box
          px={16}
          pt={60}
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
                    placeholder={t('login-screen.email-placeholder')}
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
                    placeholder={t('login-screen.password-placeholder')}
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
              <Text color={colors.grey_600} children={t('login-screen.forgot-password')} />
            </Box>

            <Button
              children={t('login-screen.to-login')}
              onPress={handleSubmit(handleLogIn)}
              loading={loading}
              disabled={loading}
            />
            <Button
              type='outline'
              children={t('login-screen.create-account')}
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
      <SelectLanguageModal ref={modal} modalClose={modalClose} />
    </>
  );
};

export default LoginScreen;