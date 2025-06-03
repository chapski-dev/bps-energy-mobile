import React, { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EnvelopeIcon from '@assets/svg/envelope.svg';
import LockIcon from '@assets/svg/lock.svg';
import LogoIcon from '@assets/svg/logo.svg';
import PhoneIcon from '@assets/svg/phone.svg';

import { postSignUp } from '@src/api';
import { RegistrationReq, SignInReq } from '@src/api/types';
import { OFFERS, PRIVACY_POLICY } from '@src/misc/documents';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Checkbox, Input, Text } from '@src/ui';
import { InputProps } from '@src/ui/Input';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';


const RegistrationScreen = ({ navigation }: ScreenProps<'registration'>) => {
  const { insets, colors } = useAppTheme();
  const { t, i18n: { language }, } = useLocalization()
  const { onSignIn } = useAuth();
  const { control, handleSubmit, formState } = useForm<RegistrationReq>({
    defaultValues: {
      agree: false,
      email: '',
      password: '',
      phone: '',
    },
    mode: 'all',
  });

  const secInputRef = useRef<InputProps>(null);

  const [loading, setLoading] = useState(false);

  const submitRegistatrion = async (data: SignInReq) => {
    try {
      setLoading(true)
      await postSignUp(data);
      navigation.navigate('otp-verify', {
        email: data.email,
        verify: 'registration',
      })
    } catch (error) {
      handleCatchError(error, 'RegistrationScreen')
    } finally {
      setLoading(false)
    }
  }

  const openOffer = useCallback(async () => {
    const url = OFFERS[language as keyof typeof OFFERS];
    await Linking.openURL(url);
  }, [language]);

  const openPrivacyPolicy = useCallback(async () => {
    const url = PRIVACY_POLICY[language as keyof typeof PRIVACY_POLICY];
    await Linking.openURL(url);
  }, [language]);


  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        alignItems: 'center',
        gap: 24,
        paddingBottom: insets.bottom + 35,
        paddingHorizontal: 24,
        paddingTop: 47
      }}
    >
      <LogoIcon />
      <Box gap={12} w='full'>
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
          render={({ field: { value, onBlur, onChange }, fieldState: { invalid, error } }) => (
            <Input
              value={value}
              onChangeText={(v) => onChange(v.trim())}
              onBlur={onBlur}
              placeholder={t('password')}
              error={invalid}
              errorText={error?.message}
              returnKeyType='next'
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
        <Controller
          control={control}
          name='phone'
          render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={'Телефон (опционально)'}
              error={invalid}
              returnKeyType="done"
              importantForAutofill="yes"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='phone-pad'
              prompting='Указанный номер телефона позволит нам быстрее помочь вам в случае обращения в службу поддержки'
              icon={<PhoneIcon color={colors.grey_400} />}
            />
          )}
        />
      </Box>
      <Controller
        control={control}
        name='agree'
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Checkbox
            checked={value}
            onPress={() => onChange(!value)}
            children={(
              <Trans
                i18nKey="user_agreement_checkbox"
                components={{
                  agree: <Text variant='p3' />,
                  privacy_policy: <Text variant='p3' onPress={openOffer} colorName='main' />,
                  user_agreement: <Text
                    variant='p3'
                    onPress={openPrivacyPolicy}
                    colorName='main'
                  />,
                }}
              />
            )}
            wrapperStyle={{ marginBottom: 32 }}
          />
        )}
      />

      <Button
        disabled={loading || !formState.isValid}
        loading={loading}
        children={t('next')}
        onPress={handleSubmit(submitRegistatrion)}
      />
    </KeyboardAwareScrollView>
  );
};

export default RegistrationScreen;
