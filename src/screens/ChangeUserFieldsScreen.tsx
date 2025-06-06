import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import UserIcon from '@assets/svg/user.svg';

import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { handleCatchError } from '@src/utils/handleCatchError';
import { PhoneInput } from '@src/widgets/PhoneInput';

type FormValues = {
  value: string;
};

function ChangeUserFieldsScreen({
  navigation,
  route,
}: ScreenProps<'change-user-fields'>) {
  const { insets, colors } = useAppTheme();
  const { t } = useLocalization();
  const { toastSuccess } = useThemedToasts();
  const { updateUser } = useAuth();

  const isNameField = route.params.filed === 'name';

  const form = useForm<FormValues>({
    defaultValues: { value: '' },
    mode: 'all',
  });

  const { control, handleSubmit, formState } = form;
  const [loading, setLoading] = useState(false);

  const handleUpdateData = async (data: FormValues) => {
    try {
      setLoading(true);
      await updateUser({
        field: route.params.filed,
        value: data.value,
      });
      toastSuccess(isNameField ? 'Имя обновлено!' : 'Телефон обновлен!');
      navigation.goBack();
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Box
        accessible={false}
        onPress={Keyboard.dismiss}
        effect="none"
        flex={1}
        px={20}
        pt={30}
      >
        <Box flex={1} gap={56}>
          <Box gap={12}>
            {isNameField ? (
              <Controller
                control={control}
                name="value"
                rules={{ required: true }}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { invalid },
                }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Имя"
                    error={invalid}
                    returnKeyType="done"
                    autoCorrect={false}
                    icon={<UserIcon color={colors.grey_400} />}
                    autoFocus
                  />
                )}
              />
            ) : (
              <PhoneInput placeholder="Телефон" autoFocus />
            )}
          </Box>
        </Box>
        <Button
          children={t('save')}
          onPress={handleSubmit(handleUpdateData)}
          disabled={loading || !formState.isValid}
          loading={loading}
        />
        <FakeView additionalOffset={-insets.bottom / 2} />
        <Gap y={insets.bottom || 16} />
      </Box>
    </FormProvider>
  );
}

export default ChangeUserFieldsScreen;
