import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard } from 'react-native';
import UserIcon from '@assets/svg/user.svg';

import { updateUserProfile } from '@src/api';
import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { handleCatchError } from '@src/utils/handleCatchError';
import { PhoneInput } from '@src/widgets/PhoneInput';

type FormValues = {
  name: string;
  phone: string;
};

function ChangeUserFieldsScreen({
  navigation,
  route,
}: ScreenProps<'change-user-fields'>) {
  const { user } = useAuth();
  const { insets, colors } = useAppTheme();
  const { t } = useTranslation();
  const { toastSuccess } = useThemedToasts();
  const { getUserData } = useAuth();

  const isNameField = route.params.filed === 'name';

  const form = useForm<FormValues>({
    defaultValues: { name: user?.name, phone: user?.phone },
    mode: 'all',
  });

  const { control, handleSubmit, formState } = form;

  const [loading, setLoading] = useState(false);

  const handleUpdateData = async (data: FormValues) => {
    try {
      setLoading(true);
      await updateUserProfile(data)
      await getUserData()
      toastSuccess(isNameField ? 'Имя обновлено!' : 'Телефон обновлен!');
      navigation.goBack();
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmationDeletePhone = () => {
    Alert.alert(t('do-you-want-to-logout?'), undefined, [
      {
        onPress: () => null,
        text: t('to-cancel'),
      },
      {
        onPress: () => {
          // TODO: доработать удаление номера телефона.
          handleUpdateData()
        },
        style: 'destructive',
        text: t('to-log-out'),
      },
    ]);
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
                name="name"
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
              <Box gap={56}>
                <PhoneInput />
                {user?.phone && (
                  <Button
                    type="clear"
                    children="Удалить номер"
                    textColor="red_500"
                    onPress={openConfirmationDeletePhone}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
        <Button
          children={t('to-save')}
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
