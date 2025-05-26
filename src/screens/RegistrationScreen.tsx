import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LogoIcon from '@assets/svg/logo.svg';

import { postSignUp } from '@src/api';
import { SignInReq } from '@src/api/types';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { InputProps } from '@src/ui/Input';
import { handleCatchError } from '@src/utils/handleCatchError';
import { validator } from '@src/utils/validations';


const RegistrationScreen = ({ navigation }: ScreenProps<'registration'>) => {
  const { insets } = useAppTheme();

  const { t } = useLocalization()
  const { onSignIn } = useAuth();

  const { control, handleSubmit } = useForm<SignInReq>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });

  const secInputRef = useRef<InputProps>(null);

  const [loading, setLoading] = useState(false);

  const submitRegistatrion = async (data: SignInReq) => {
    try {
      setLoading(true)
      await postSignUp(data);
      await onSignIn(data);

      navigation.navigate('tabs')
    } catch (error) {
      handleCatchError(error, 'RegistrationScreen')
    } finally {
      setLoading(false)
    }
  }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Box
        pr={16}
        pl={16}
        pt={47}
        gap={24}
        pb={insets.bottom + 35}
        alignItems='center'
        flex={1} >
        <LogoIcon />
        <Box flex={1} w='full' gap={24}>
          <Box gap={12} w='full'>
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
                  returnKeyType="next"
                  importantForAutofill="yes"
                  onSubmitEditing={() => secInputRef?.current?.focus()}

                />
              )}
            />
            <Controller
              control={control}
              name='password'
              rules={{ required: true, validate: validator.password }}
              render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
                <Input
                  required
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('password')}
                  error={invalid}
                  returnKeyType="done"
                  ref={secInputRef}
                  importantForAutofill="yes"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              rules={{ required: true, validate: validator.password }}
              render={({ field: { value, onBlur, onChange }, fieldState: { invalid } }) => (
                <Input
                  required
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={'Телефон (опционально)'}
                  error={invalid}
                  returnKeyType="done"
                  ref={secInputRef}
                  importantForAutofill="yes"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                />
              )}
            />
            <Text
              children="Указанный номер телефона позволит нам быстрее помочь вам в случае обращения в службу поддержки"
              colorName='grey_600'
              fontSize={13} />
          </Box>

          <Button
            disabled={loading}
            loading={loading}
            children={t('next')}
            onPress={handleSubmit(submitRegistatrion)}
          />

        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default RegistrationScreen;
