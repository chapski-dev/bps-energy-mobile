import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input } from '@src/ui';
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
                  autoFocus
                />
              )}
            />
          </Box>
          <Button
            children={t('confirm')}
            onPress={handleSubmit(handleSendOtpToResetPassword)}
          />
        </Box>

      </Box>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;
