import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import LogoIcon from '@assets/svg/logo.svg';

import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { InputProps } from '@src/ui/Input';
import { validator } from '@src/utils/validations';


const LoginScreen = ({ navigation }: ScreenProps<'login'>) => {
  const { insets, colors } = useAppTheme();

  const { t } = useLocalization()
  const { onSignin } = useAuth();

  const { control } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
  });
  const handleSubmit = () => {
    onSignin()
  };

  const handleSkip = async () => {
    navigation.preload('tabs');
    navigation.navigate('tabs');
  }

  const secInputRef = useRef<InputProps>(null);

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
